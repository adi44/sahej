import httpx
from app.core.config import settings

_AUTH_URL = f"{settings.SUPABASE_URL}/auth/v1"
_REST_URL = f"{settings.SUPABASE_URL}/rest/v1"

# Shared connection pool — initialized once at startup, closed at shutdown.
# All SupabaseTable.execute() calls reuse TCP connections from this pool
# instead of opening a new connection per DB call.
_http: httpx.Client | None = None


def init_http_client() -> None:
    global _http
    _http = httpx.Client(
        timeout=httpx.Timeout(connect=5.0, read=10.0, write=10.0, pool=5.0),
        limits=httpx.Limits(max_connections=20, max_keepalive_connections=10),
    )


def close_http_client() -> None:
    global _http
    if _http is not None:
        _http.close()
        _http = None


def _client() -> httpx.Client:
    if _http is None:
        raise RuntimeError("HTTP client not initialised — application startup incomplete")
    return _http


def _headers(jwt: str) -> dict:
    return {
        "apikey": settings.SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {jwt}",
        "Content-Type": "application/json",
    }


def get_user(jwt: str) -> dict | None:
    try:
        r = _client().get(f"{_AUTH_URL}/user", headers=_headers(jwt))
        return r.json() if r.status_code == 200 else None
    except Exception:
        return None


class SupabaseTable:
    """Minimal PostgREST query builder."""

    def __init__(self, jwt: str, table: str) -> None:
        self._jwt = jwt
        self._table = table
        self._params: dict = {}
        self._body: dict | None = None
        self._method = "GET"
        self._single = False
        self._prefer = ""

    def select(self, columns: str = "*"):
        self._params["select"] = columns
        return self

    def insert(self, data: dict):
        self._method = "POST"
        self._body = data
        self._prefer = "return=representation"
        return self

    def upsert(self, data: dict, *, on_conflict: str = ""):
        self._method = "POST"
        self._body = data
        self._prefer = "resolution=merge-duplicates,return=representation"
        if on_conflict:
            self._params["on_conflict"] = on_conflict
        return self

    def update(self, data: dict):
        self._method = "PATCH"
        self._body = data
        self._prefer = "return=representation"
        return self

    def eq(self, column: str, value):
        self._params[column] = f"eq.{value}"
        return self

    def order(self, column: str, *, desc: bool = False):
        self._params["order"] = f"{column}.{'desc' if desc else 'asc'}"
        return self

    def limit(self, n: int):
        self._params["limit"] = str(n)
        return self

    def single(self):
        self._single = True
        return self

    def execute(self) -> "_Result":
        url = f"{_REST_URL}/{self._table}"
        headers = _headers(self._jwt)
        if self._prefer:
            headers["Prefer"] = self._prefer
        if self._single:
            headers["Accept"] = "application/vnd.pgrst.object+json"

        client = _client()
        if self._method == "GET":
            r = client.get(url, headers=headers, params=self._params)
        elif self._method == "PATCH":
            r = client.patch(url, headers=headers, params=self._params, json=self._body)
        else:
            r = client.post(url, headers=headers, params=self._params, json=self._body)

        if r.status_code >= 400:
            return _Result(None, r.text)
        return _Result(r.json(), None)


class _Result:
    def __init__(self, data, error):
        self.data = data
        self.error = error


class SupabaseClient:
    def __init__(self, jwt: str) -> None:
        self._jwt = jwt

    def table(self, name: str) -> SupabaseTable:
        return SupabaseTable(self._jwt, name)


def get_authed_client(jwt: str) -> SupabaseClient:
    return SupabaseClient(jwt)
