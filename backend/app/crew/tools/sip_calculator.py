from pydantic import BaseModel, Field
from app.crew.tools.base import BaseSahejTool


class SIPCalculatorInput(BaseModel):
    monthly_amount: float = Field(description="Monthly SIP amount in INR")
    annual_return_pct: float = Field(description="Expected annual return percentage (e.g. 12 for 12%)")
    years: int = Field(description="Investment duration in years")


class SIPCalculatorTool(BaseSahejTool):
    name: str = "SIP Calculator"
    description: str = (
        "Calculate the projected maturity value of a monthly SIP investment "
        "given an amount, expected annual return, and duration in years."
    )
    args_schema: type[BaseModel] = SIPCalculatorInput

    def _run(self, monthly_amount: float, annual_return_pct: float, years: int) -> str:
        r = (annual_return_pct / 100) / 12
        n = years * 12
        # standard SIP future value formula
        maturity = monthly_amount * (((1 + r) ** n - 1) / r) * (1 + r)
        invested = monthly_amount * n
        gain = maturity - invested

        return (
            f"SIP of ₹{monthly_amount:,.0f}/month for {years} years at {annual_return_pct}% p.a.:\n"
            f"  Total invested : ₹{invested:,.0f}\n"
            f"  Estimated value: ₹{maturity:,.0f}\n"
            f"  Estimated gain : ₹{gain:,.0f}"
        )
