from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import current_user
from app.services.supabase import get_authed_client
from app.schemas.profile import ProfileCreate

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("/")
async def get_profile(auth=Depends(current_user)):
    user, jwt = auth
    db = get_authed_client(jwt)
    res = db.table("financial_profiles").select("*").eq("user_id", user["id"]).limit(1).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return res.data[0]


@router.post("/")
async def upsert_profile(body: ProfileCreate, auth=Depends(current_user)):
    user, jwt = auth
    db = get_authed_client(jwt)

    monthly_expenses = (
        body.rent_or_emi + body.other_emis + body.school_fees +
        body.groceries_utilities + body.other_expenses
    )
    investable_surplus = max(0.0, body.monthly_income - monthly_expenses)

    payload = {
        "user_id": user["id"],
        "monthly_income": body.monthly_income,
        "income_source": body.income_source,
        "income_is_regular": body.income_is_regular,
        "rent_or_emi": body.rent_or_emi,
        "other_emis": body.other_emis,
        "school_fees": body.school_fees,
        "groceries_utilities": body.groceries_utilities,
        "other_expenses": body.other_expenses,
        "monthly_expenses": monthly_expenses,
        "investable_surplus": investable_surplus,
        "savings_balance": body.savings_balance,
        "existing_investments": body.existing_investments,
        "has_insurance": body.has_insurance,
        "risk_appetite": body.risk_appetite,
        "goals": [g.model_dump() for g in body.goals],
        "num_children": body.num_children,
        "children_ages": body.children_ages,
    }

    res = db.table("financial_profiles").upsert(payload, on_conflict="user_id").execute()
    return res.data[0]
