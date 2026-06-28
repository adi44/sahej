import api from "./client";
import type { ProfileData } from "../types/profile";

export interface SavedProfile {
  id: string;
  user_id: string;
  monthly_income: number;
  income_source: string;
  income_is_regular: boolean;
  monthly_expenses: number;
  investable_surplus: number;
  savings_balance: number;
  existing_investments: string[];
  has_insurance: boolean;
  risk_appetite: string;
  goals: { type: string; target_year: number }[];
  num_children: number;
  children_ages: number[];
  created_at: string;
  updated_at: string;
}

export async function fetchProfile(): Promise<SavedProfile> {
  const { data } = await api.get<SavedProfile>("/profile/");
  return data;
}

export async function saveProfile(form: ProfileData): Promise<SavedProfile> {
  const { data } = await api.post<SavedProfile>("/profile/", {
    monthly_income: parseFloat(form.monthly_income) || 0,
    income_source: form.income_source,
    income_is_regular: form.income_is_regular,
    rent_or_emi: parseFloat(form.rent_or_emi) || 0,
    other_emis: parseFloat(form.other_emis) || 0,
    school_fees: parseFloat(form.school_fees) || 0,
    groceries_utilities: parseFloat(form.groceries_utilities) || 0,
    other_expenses: parseFloat(form.other_expenses) || 0,
    savings_balance: parseFloat(form.savings_balance) || 0,
    existing_investments: form.existing_investments,
    has_insurance: form.has_insurance,
    risk_appetite: form.risk_appetite,
    goals: form.goals,
    num_children: parseInt(form.num_children) || 0,
    children_ages: form.children_ages.map((a) => parseInt(a) || 0).filter((a) => a > 0),
  });
  return data;
}
