from crewai import LLM
from app.core.config import settings


class LLMProvider:
    """Singleton that vends a single shared LLM instance across all agents."""

    _instance: LLM | None = None

    @classmethod
    def get(cls) -> LLM:
        if cls._instance is None:
            cls._instance = LLM(
                model="gpt-4o-mini",
                api_key=settings.OPENAI_API_KEY,
                temperature=0.4,
            )
        return cls._instance
