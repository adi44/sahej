from abc import ABC, abstractmethod
from crewai import Agent as CrewAgent
from crewai.tools import BaseTool
from app.crew.llm import LLMProvider


class BaseAgent(ABC):
    """
    Abstract base for all Sahej agents.

    Subclasses only need to declare role, goal, backstory, and optionally
    override tools(). The build() template method assembles the CrewAI agent
    using the shared LLM instance — no subclass touches the LLM directly.
    """

    def __init__(self) -> None:
        self._llm = LLMProvider.get()

    @property
    @abstractmethod
    def role(self) -> str: ...

    @property
    @abstractmethod
    def goal(self) -> str: ...

    @property
    @abstractmethod
    def backstory(self) -> str: ...

    @property
    def tools(self) -> list[BaseTool]:
        return []

    def build(self) -> CrewAgent:
        return CrewAgent(
            role=self.role,
            goal=self.goal,
            backstory=self.backstory,
            tools=self.tools,
            llm=self._llm,
            verbose=False,
            allow_delegation=False,
        )
