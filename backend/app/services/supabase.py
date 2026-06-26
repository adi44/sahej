import httpx
from app.core.config import settings

# Base URLs
_AUTH_URL = f"{settings.SUPABASE_URL}/auth/v1"
_REST_URL = f"{settings.SUPABASE_URL}/rest/v1"


def _headers(jwt: str) -> dict:
    return {
        "apikey": settings.SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {jwt}",
        "Content-Type": "application/json",
    }


def get_user(jwt: str) -> dict | None:
    try:
        r = httpx.get(f"{_AUTH_URL}/user", headers=_headers(jwt), timeout=5.0)
        return r.json() if r.status_code == 200 else None
    except Exception:
        return None


class SupabaseTable:
    """Minimal query builder that mirrors the supabase-py table API."""

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

    def execute(self):
        url = f"{_REST_URL}/{self._table}"
        headers = _headers(self._jwt)
        if self._prefer:
            headers["Prefer"] = self._prefer
        if self._single:
            headers["Accept"] = "application/vnd.pgrst.object+json"

        if self._method == "GET":
            r = httpx.get(url, headers=headers, params=self._params, timeout=10.0)
        else:
            r = httpx.post(url, headers=headers, params=self._params, json=self._body, timeout=10.0)

        if r.status_code >= 400:
            return _Result(None, r.text)

        data = r.json()
        return _Result(data, None)


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
