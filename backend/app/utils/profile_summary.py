from datetime import date

_INCOME_SOURCE = {
    "salary": "a salaried job",
    "business": "running her own business",
    "both": "a salaried job and her own business",
    "spouse": "her husband's salary (she manages household finances)",
}

_RISK_TEXT = {
    "conservative": "she wants her money completely safe — only government-backed schemes, no stock market",
    "moderate": "she is comfortable with a small amount of market risk for better returns",
    "aggressive": "she is willing to accept market ups and downs to grow money faster",
}

_GOAL_LABELS = {
    "emergency": "Emergency fund",
    "education": "Children's education",
    "marriage": "Children's marriage",
    "retirement": "Retirement",
    "home": "Own home or land",
    "medical": "Medical buffer",
}

_INV_LABELS = {
    "ppf": "PPF (Public Provident Fund)",
    "nsc": "NSC (National Savings Certificate)",
    "fd": "Fixed Deposit",
    "gold": "Gold",
    "mf": "Mutual Funds (SIP)",
    "stocks": "Direct stocks",
}


def build_profile_summary(profile: dict) -> str:
    this_year = date.today().year
    lines: list[str] = []

    lines.append("=== USER FINANCIAL PROFILE (use this as ground truth) ===")

    # Income
    income = profile.get("monthly_income", 0)
    source = _INCOME_SOURCE.get(profile.get("income_source", ""), profile.get("income_source", ""))
    regular = "regular" if profile.get("income_is_regular", True) else "irregular (varies month to month)"
    lines.append(f"\nINCOME")
    lines.append(f"  Monthly household income: ₹{income:,.0f} from {source} ({regular})")

    # Expenses
    expenses = profile.get("monthly_expenses", 0)
    surplus = profile.get("investable_surplus", 0)
    lines.append(f"\nEXPENSES")
    expense_parts = []
    if profile.get("rent_or_emi", 0): expense_parts.append(f"rent/EMI ₹{profile['rent_or_emi']:,.0f}")
    if profile.get("other_emis", 0): expense_parts.append(f"other loan EMIs ₹{profile['other_emis']:,.0f}")
    if profile.get("school_fees", 0): expense_parts.append(f"school fees ₹{profile['school_fees']:,.0f}")
    if profile.get("groceries_utilities", 0): expense_parts.append(f"groceries & utilities ₹{profile['groceries_utilities']:,.0f}")
    if profile.get("other_expenses", 0): expense_parts.append(f"other expenses ₹{profile['other_expenses']:,.0f}")
    if expense_parts:
        lines.append(f"  Breakdown: {', '.join(expense_parts)}")
    lines.append(f"  Total monthly expenses: ₹{expenses:,.0f}")
    lines.append(f"  AVAILABLE TO INVEST EACH MONTH: ₹{surplus:,.0f}")

    # Assets
    savings = profile.get("savings_balance", 0)
    investments = profile.get("existing_investments", [])
    has_insurance = profile.get("has_insurance", False)
    lines.append(f"\nASSETS & SAVINGS")
    lines.append(f"  Bank savings: ₹{savings:,.0f}")
    if investments:
        inv_text = ", ".join(_INV_LABELS.get(i, i) for i in investments)
        lines.append(f"  Already investing in: {inv_text}")
    else:
        lines.append(f"  No existing investments — this is a fresh start")
    lines.append(f"  Insurance: {'Yes (has life/health insurance)' if has_insurance else 'No insurance yet'}")

    # Risk
    risk = profile.get("risk_appetite", "")
    risk_text = _RISK_TEXT.get(risk, risk)
    lines.append(f"\nRISK COMFORT")
    lines.append(f"  {risk_text.capitalize()}")

    # Goals
    goals = profile.get("goals", [])
    if goals:
        lines.append(f"\nGOALS")
        for g in goals:
            label = _GOAL_LABELS.get(g.get("type", ""), g.get("type", ""))
            target_year = g.get("target_year", this_year + 5)
            years_left = target_year - this_year
            lines.append(f"  • {label} — needs to be ready by {target_year} ({years_left} year{'s' if years_left != 1 else ''} from now)")

    # Family
    num_children = profile.get("num_children", 0)
    children_ages = profile.get("children_ages", [])
    lines.append(f"\nFAMILY")
    if num_children == 0:
        lines.append("  No children")
    else:
        ages_str = ", ".join(str(a) for a in children_ages) if children_ages else "ages not specified"
        lines.append(f"  {num_children} child{'ren' if num_children > 1 else ''}, ages: {ages_str}")
        # Sukanya Samriddhi eligibility: daughters under 10
        young_ones = [a for a in children_ages if a < 10]
        if young_ones:
            lines.append(
                f"  → Sukanya Samriddhi Yojana (SSY) may be applicable — "
                f"child{'ren' if len(young_ones) > 1 else ''} aged {', '.join(str(a) for a in young_ones)} "
                f"{'are' if len(young_ones) > 1 else 'is'} under 10"
            )

    lines.append("\n=== END OF PROFILE ===")
    lines.append("Use the above profile to give specific, personalised advice. "
                 "Do NOT ask for information already present above. "
                 "Always anchor recommendations to the ₹{:,.0f}/month investable surplus.".format(surplus))

    return "\n".join(lines)
