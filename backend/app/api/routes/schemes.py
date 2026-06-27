import time
import json
import httpx
from fastapi import APIRouter
from app.core.config import settings

router = APIRouter(prefix="/schemes", tags=["schemes"])

# 6-hour in-memory cache
_cache: dict = {"data": None, "ts": 0.0}
_CACHE_TTL = 6 * 3600

SCHEME_NAMES = [
    "PPF", "NSC", "Sukanya Samriddhi Yojana",
    "Mahila Samman Savings Certificate",
    "Fixed Deposit", "Recurring Deposit", "ELSS",
]


def _search_serper(query: str) -> str:
    try:
        r = httpx.post(
            "https://google.serper.dev/search",
            headers={"X-API-KEY": settings.SERPER_API_KEY, "Content-Type": "application/json"},
            json={"q": query, "num": 8},
            timeout=10.0,
        )
        organic = r.json().get("organic", [])
        return "\n".join(f"{x.get('title','')}: {x.get('snippet','')}" for x in organic[:8])
    except Exception as e:
        return f"Search failed: {e}"


def _extract_rates_with_llm(snippets: str) -> list[dict]:
    from openai import OpenAI
    client = OpenAI(api_key=settings.OPENAI_API_KEY)

    prompt = (
        "From the following search results, extract the CURRENT annual interest rates for these "
        "Indian investment schemes: PPF, NSC, Sukanya Samriddhi Yojana, Mahila Samman Savings Certificate, "
        "Fixed Deposit (SBI/major banks), Recurring Deposit (SBI/major banks), ELSS (typical historic returns), "
        "SIP Equity (Nifty 50 long-term average).\n\n"
        f"Search results:\n{snippets}\n\n"
        "Return ONLY a JSON array. Each element must have exactly these keys: "
        '{"id": string, "label": string, "rate": number, "tag": string, "safe": boolean}\n'
        "id must be one of: ppf, nsc, sukanya, mahila, fd, rd, elss, sip\n"
        "rate is the annual percentage (number only, e.g. 7.1)\n"
        "safe=true for government-backed; false for market-linked.\n"
        "If a rate cannot be found, use the most recently known rate."
    )

    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0,
    )
    raw = resp.choices[0].message.content or "{}"
    parsed = json.loads(raw)
    # handle both {"schemes": [...]} and [...]
    if isinstance(parsed, list):
        return parsed
    for v in parsed.values():
        if isinstance(v, list):
            return v
    return []


@router.get("/rates")
async def get_scheme_rates():
    now = time.time()
    if _cache["data"] and (now - _cache["ts"]) < _CACHE_TTL:
        return {"schemes": _cache["data"], "cached": True}

    snippets = _search_serper(
        "PPF NSC Sukanya Samriddhi Mahila Samman FD RD ELSS SIP current interest rate 2025 India"
    )
    schemes = _extract_rates_with_llm(snippets)
    _cache["data"] = schemes
    _cache["ts"] = now
    return {"schemes": schemes, "cached": False}
