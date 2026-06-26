import httpx
from pydantic import BaseModel, Field
from app.crew.tools.base import BaseSahejTool
from app.core.config import settings


class SchemeLookupInput(BaseModel):
    query: str = Field(
        description=(
            "Search query for the investment scheme, e.g. "
            "'PPF interest rate 2025 India' or 'Sukanya Samriddhi Yojana current rate'"
        )
    )


class SchemeLookupTool(BaseSahejTool):
    name: str = "Investment Scheme Lookup"
    description: str = (
        "Search the web for real-time details of Indian savings and investment schemes "
        "(PPF, NSC, Sukanya Samriddhi, FD rates, RD rates, Mahila Samman, etc.). "
        "Always use this tool to get current interest rates — never guess or use old figures."
    )
    args_schema: type[BaseModel] = SchemeLookupInput

    def _run(self, query: str) -> str:
        try:
            response = httpx.post(
                "https://google.serper.dev/search",
                headers={
                    "X-API-KEY": settings.SERPER_API_KEY,
                    "Content-Type": "application/json",
                },
                json={"q": query, "num": 5},
                timeout=10.0,
            )
            results = response.json()
            organic = results.get("organic", [])
            if not organic:
                return "No search results found."
            lines = []
            for r in organic[:5]:
                title = r.get("title", "")
                snippet = r.get("snippet", "")
                if title:
                    lines.append(f"{title}: {snippet}")
            return "\n\n".join(lines)
        except Exception as e:
            return f"Search failed: {e}"
