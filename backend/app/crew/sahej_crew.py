import asyncio
from crewai import Crew, Task, Process

from app.crew.agents import (
    FinancialAdvisorAgent,
    InvestmentResearcherAgent,
    SavingsCoachAgent,
)


class SahejCrew:
    """
    Coach and Researcher run in parallel, Advisor synthesises both outputs.

    Parallel leg (simultaneous):
      - Savings Coach   → frames the user's situation and goals
      - Investment Researcher → fetches live scheme options + rates

    Sequential leg (after both complete):
      - Financial Advisor → synthesises into the final user-facing reply
    """

    def __init__(self) -> None:
        self._advisor = FinancialAdvisorAgent()
        self._researcher = InvestmentResearcherAgent()
        self._coach = SavingsCoachAgent()

    async def run(
        self,
        user_message: str,
        chat_history: list[dict],
        profile_summary: str = "",
    ) -> str:
        history_text = self._format_history(chat_history)

        context = (
            f"Chat history:\n{history_text}\n\nUser: {user_message}"
        ) if history_text else f"User: {user_message}"

        profile_block = f"{profile_summary}\n\n" if profile_summary else ""

        # ── Parallel tasks (no dependency on each other) ─────────────────────

        coach_task = Task(
            description=(
                f"{profile_block}"
                f"Identify the user's savings goals, monthly capacity, and time horizons.\n\n{context}"
            ),
            expected_output=(
                "Concise bullet list: monthly investable amount, short/medium/long-term goals, "
                "constraints or concerns the user mentioned."
            ),
            agent=self._coach.build(),
        )

        research_task = Task(
            description=(
                f"{profile_block}"
                f"Find 2–4 investment options suited to a beginner Indian investor for this query. "
                f"Fetch current interest rates and minimum investment amounts.\n\n{context}"
            ),
            expected_output=(
                "Bullet list of 2–4 options: name, current rate, minimum amount, pros/cons, "
                "and which goal or time horizon each fits."
            ),
            agent=self._researcher.build(),
        )

        coach_crew = Crew(
            agents=[self._coach.build()],
            tasks=[coach_task],
            process=Process.sequential,
            verbose=False,
        )
        research_crew = Crew(
            agents=[self._researcher.build()],
            tasks=[research_task],
            process=Process.sequential,
            verbose=False,
        )

        coach_result, research_result = await asyncio.gather(
            coach_crew.kickoff_async(),
            research_crew.kickoff_async(),
        )

        # ── Advisor synthesises both outputs ─────────────────────────────────

        advisor_task = Task(
            description=(
                f"{profile_block}"
                f"Situation analysis:\n{coach_result}\n\n"
                f"Available options:\n{research_result}\n\n"
                f"Write a warm, specific reply to the user. Reference their surplus and existing "
                f"investments where relevant. End with one clear next step. "
                f"Match the language (Hindi/English) the user used.\n\n{context}"
            ),
            expected_output=(
                "Friendly, specific response recommending 1–2 options with reasons, "
                "and one concrete action the user can take today."
            ),
            agent=self._advisor.build(),
        )

        advisor_crew = Crew(
            agents=[self._advisor.build()],
            tasks=[advisor_task],
            process=Process.sequential,
            verbose=False,
        )

        result = await advisor_crew.kickoff_async()
        return str(result)

    @staticmethod
    def _format_history(history: list[dict]) -> str:
        if not history:
            return ""
        lines = []
        for msg in history[-8:]:
            role = "User" if msg["role"] == "user" else "Sahej"
            lines.append(f"{role}: {msg['content']}")
        return "\n".join(lines)
