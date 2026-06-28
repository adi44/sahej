export interface GoalItem {
  type: string;
  target_year: number;
}

export interface ProfileData {
  monthly_income: string;
  income_source: string;
  income_is_regular: boolean;
  rent_or_emi: string;
  other_emis: string;
  school_fees: string;
  groceries_utilities: string;
  other_expenses: string;
  savings_balance: string;
  existing_investments: string[];
  has_insurance: boolean;
  risk_appetite: string;
  goals: GoalItem[];
  num_children: string;
  children_ages: string[];
}

export const EMPTY_PROFILE: ProfileData = {
  monthly_income: "",
  income_source: "",
  income_is_regular: true,
  rent_or_emi: "",
  other_emis: "",
  school_fees: "",
  groceries_utilities: "",
  other_expenses: "",
  savings_balance: "",
  existing_investments: [],
  has_insurance: false,
  risk_appetite: "",
  goals: [],
  num_children: "",
  children_ages: [],
};
