from datetime import date

_SOURCE = {"salary": "salary", "business": "business", "both": "salary+business", "spouse": "spouse income"}
_RISK = {"conservative": "conservative (safe only)", "moderate": "moderate", "aggressive": "aggressive"}
_GOAL = {"emergency": "emergency fund", "education": "education", "marriage": "marriage", "retirement": "retirement", "home": "home", "medical": "medical buffer"}
_INV = {"ppf": "PPF", "nsc": "NSC", "fd": "FD", "gold": "gold", "mf": "MF/SIP", "stocks": "stocks"}


def build_profile_summary(profile: dict) -> str:
    this_year = date.today().year

    income = profile.get("monthly_income", 0)
    expenses = profile.get("monthly_expenses", 0)
    surplus = profile.get("investable_surplus", 0)
    source = _SOURCE.get(profile.get("income_source", ""), "unknown")
    regular = "" if profile.get("income_is_regular", True) else " irregular"

    savings = profile.get("savings_balance", 0)
    investments = profile.get("existing_investments", [])
    inv_str = "+".join(_INV.get(i, i) for i in investments) if investments else "none"
    insurance = "insured" if profile.get("has_insurance") else "no insurance"

    risk = _RISK.get(profile.get("risk_appetite", ""), "moderate")

    goals = profile.get("goals", [])
    goal_parts = []
    for g in goals:
        label = _GOAL.get(g.get("type", ""), g.get("type", ""))
        yr = g.get("target_year", this_year + 5)
        goal_parts.append(f"{label} {yr} ({yr - this_year}y)")
    goals_str = ", ".join(goal_parts) if goal_parts else "none stated"

    num_children = profile.get("num_children", 0)
    ages = profile.get("children_ages", [])
    if num_children == 0:
        family_str = "no children"
    else:
        ages_str = "&".join(str(a) for a in ages) if ages else "?"
        ssy = any(a < 10 for a in ages)
        family_str = f"{num_children} child{'ren' if num_children > 1 else ''} ages {ages_str}" + (" SSY-eligible" if ssy else "")

    lines = [
        f"[PROFILE]",
        f"income ₹{income:,.0f}/mo {source}{regular} | expenses ₹{expenses:,.0f}/mo | surplus ₹{surplus:,.0f}/mo",
        f"savings ₹{savings:,.0f} | investments: {inv_str} | {insurance} | risk: {risk}",
        f"goals: {goals_str} | family: {family_str}",
        f"[/PROFILE]",
        f"Use surplus ₹{surplus:,.0f}/mo as baseline. Do not re-ask for info above.",
    ]
    return "\n".join(lines)
