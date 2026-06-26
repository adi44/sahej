from crewai.tools import BaseTool
from app.crew.agents.base import BaseAgent
from app.crew.tools import SIPCalculatorTool, SchemeLookupTool


class FinancialAdvisorAgent(BaseAgent):
    @property
    def role(self) -> str:
        return "Financial Advisor"

    @property
    def goal(self) -> str:
        return (
            "Understand the user's financial situation and goals, ask clarifying questions "
            "when needed, and synthesise inputs from other agents into clear, actionable advice "
            "that a first-time investor can understand and act on."
        )

    @property
    def backstory(self) -> str:
        return (
            "You are a compassionate financial advisor specialising in helping Indian housewives "
            "take their first steps into investing. You know they are careful savers who lack access "
            "to proper guidance. You explain concepts simply — in Hindi or English depending on the "
            "user's preference — and you never use jargon without explaining it. You coordinate with "
            "the Investment Researcher and Savings Coach to give holistic advice."
        )

    @property
    def tools(self) -> list[BaseTool]:
        return [SIPCalculatorTool(), SchemeLookupTool()]
