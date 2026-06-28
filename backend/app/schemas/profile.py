from pydantic import BaseModel


class GoalItem(BaseModel):
    type: str
    target_year: int


class ProfileCreate(BaseModel):
    monthly_income: float
    income_source: str          # salary | business | both | spouse
    income_is_regular: bool = True
    rent_or_emi: float = 0
    other_emis: float = 0
    school_fees: float = 0
    groceries_utilities: float = 0
    other_expenses: float = 0
    savings_balance: float = 0
    existing_investments: list[str] = []
    has_insurance: bool = False
    risk_appetite: str          # conservative | moderate | aggressive
    goals: list[GoalItem] = []
    num_children: int = 0
    children_ages: list[int] = []
