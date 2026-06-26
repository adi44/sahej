from abc import abstractmethod
from crewai.tools import BaseTool


class BaseSahejTool(BaseTool):
    """
    Base for all Sahej tools. Enforces a standard _run signature and lets
    subclasses focus purely on their domain logic.
    """

    @abstractmethod
    def _run(self, **kwargs) -> str: ...
