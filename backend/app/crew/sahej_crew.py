from crewai import Crew, Task, Process

from app.crew.agents import (
    FinancialAdvisorAgent,
    InvestmentResearcherAgent,
    SavingsCoachAgent,
)


class SahejCrew:
    """
    Orchestrates the three Sahej agents to respond to a user's financial query.

    Process:
      1. Savings Coach frames the user's situation (goals, buckets)
      2. Investment Researcher fetches live scheme/product options
      3. Financial Advisor synthesises both into a final user-facing response
    """

    def __init__(self) -> None:
        self._advisor = FinancialAdvisorAgent()
        self._researcher = InvestmentResearcherAgent()
        self._coach = SavingsCoachAgent()

    async def run(self, user_message: str, chat_history: list[dict]) -> str:
        history_text = self._format_history(chat_history)

        context = (
            f"Chat history so far:\n{history_text}\n\n"
            f"Latest user message: {user_message}"
        ) if history_text else user_message

        coach_task = Task(
            description=(
                f"Review this user's message and identify their savings goals, "
                f"approximate savings capacity, and time horizons:\n\n{context}"
            ),
            expected_output=(
                "A concise summary of the user's financial situation: estimated monthly savings, "
                "short/medium/long-term goals, and any concerns or constraints they mentioned."
            ),
            agent=self._coach.build(),
        )

        research_task = Task(
            description=(
                "Based on the savings profile from the coach, search for 2–4 investment options "
                "that are suitable for a beginner Indian housewife investor. "
                "Fetch current interest rates and minimum investment amounts for each option."
            ),
            expected_output=(
                "A list of 2–4 investment options with current rates, pros, cons, "
                "minimum investment, and which goal/time horizon each suits best."
            ),
            agent=self._researcher.build(),
            context=[coach_task],
        )

        advisor_task = Task(
            description=(
                "Using the savings profile and the researched options, write a warm, clear, "
                "encouraging response directly to the user. Explain which options you recommend "
                "and why, with a simple next step they can take today. "
                "Match the language (Hindi/English) the user used."
            ),
            expected_output=(
                "A conversational, friendly response to the user that recommends specific "
                "investment options, explains them simply, and ends with one clear next action."
            ),
            agent=self._advisor.build(),
            context=[coach_task, research_task],
        )

        crew = Crew(
            agents=[self._coach.build(), self._researcher.build(), self._advisor.build()],
            tasks=[coach_task, research_task, advisor_task],
            process=Process.sequential,
            verbose=False,
        )

        result = await crew.kickoff_async()
        return str(result)

    @staticmethod
    def _format_history(history: list[dict]) -> str:
        if not history:
            return ""
        lines = []
        for msg in history[-10:]:  # last 10 messages for context window
            role = "User" if msg["role"] == "user" else "Sahej"
            lines.append(f"{role}: {msg['content']}")
        return "\n".join(lines)
