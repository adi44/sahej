import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import IncomeStep from "../components/profile/steps/IncomeStep";
import LiabilitiesStep from "../components/profile/steps/LiabilitiesStep";
import AssetsStep from "../components/profile/steps/AssetsStep";
import GoalsStep from "../components/profile/steps/GoalsStep";
import RiskStep from "../components/profile/steps/RiskStep";
import ProfileSummary from "../components/profile/ProfileSummary";
import { fetchProfile, saveProfile, type SavedProfile } from "../api/profile";
import { type ProfileData, EMPTY_PROFILE } from "../types/profile";

const STEPS = [
  { title: "Your income", subtitle: "Tell us what comes in each month" },
  { title: "Liabilities & expenses", subtitle: "What goes out every month" },
  { title: "What you already have", subtitle: "Savings and existing investments" },
  { title: "Your goals", subtitle: "What are you saving towards?" },
  { title: "Risk comfort", subtitle: "How do you feel about your money?" },
];

function toFormData(p: SavedProfile): ProfileData {
  return {
    monthly_income: String(p.monthly_income),
    income_source: p.income_source,
    income_is_regular: p.income_is_regular,
    rent_or_emi: String(p.rent_or_emi || 0),
    other_emis: String(p.other_emis || 0),
    school_fees: String(p.school_fees || 0),
    groceries_utilities: String(p.groceries_utilities || 0),
    other_expenses: String(p.other_expenses || 0),
    savings_balance: String(p.savings_balance || 0),
    existing_investments: p.existing_investments || [],
    has_insurance: p.has_insurance,
    risk_appetite: p.risk_appetite,
    goals: p.goals || [],
    num_children: String(p.num_children || 0),
    children_ages: (p.children_ages || []).map(String),
  };
}

interface Props {
  onComplete: () => void;
}

export default function ProfilePage({ onComplete }: Props) {
  const [mode, setMode] = useState<"loading" | "summary" | "wizard">("loading");
  const [profile, setProfile] = useState<SavedProfile | null>(null);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ProfileData>(EMPTY_PROFILE);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile()
      .then((p) => {
        setProfile(p);
        setData(toFormData(p));
        setMode("summary");
      })
      .catch(() => setMode("wizard"));
  }, []);

  function patch(update: Partial<ProfileData>) {
    setData((prev) => ({ ...prev, ...update }));
  }

  function startEdit() {
    setStep(0);
    setError("");
    setMode("wizard");
  }

  function canNext(): boolean {
    if (step === 0) return !!data.monthly_income && !!data.income_source;
    if (step === 4) return !!data.risk_appetite;
    return true;
  }

  async function handleNext() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    setSaving(true);
    setError("");
    try {
      const saved = await saveProfile(data);
      setProfile(saved);
      onComplete();
      if (profile) {
        // editing — go back to summary
        setMode("summary");
      } else {
        // first time — go to chat
        navigate("/chat", { replace: true });
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const surplus =
    (parseFloat(data.monthly_income) || 0) -
    (parseFloat(data.rent_or_emi) || 0) -
    (parseFloat(data.other_emis) || 0) -
    (parseFloat(data.school_fees) || 0) -
    (parseFloat(data.groceries_utilities) || 0) -
    (parseFloat(data.other_expenses) || 0);

  if (mode === "loading") return null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "32px 16px 48px",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
        <Logo size={36} />
        <span style={{ fontSize: 22, fontWeight: 800, color: "var(--primary)", letterSpacing: "-0.3px" }}>Sahej</span>
      </div>

      <div style={{
        width: "100%",
        maxWidth: 520,
        background: "var(--surface)",
        borderRadius: 20,
        boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        overflow: "hidden",
      }}>
        {mode === "summary" && profile ? (
          <div style={{ padding: "28px 32px 32px" }}>
            <ProfileSummary profile={profile} onEdit={startEdit} />
          </div>
        ) : (
          <>
            {/* Progress bar */}
            <div style={{ height: 4, background: "var(--border)" }}>
              <div style={{
                height: "100%",
                width: `${((step + 1) / STEPS.length) * 100}%`,
                background: "var(--primary)",
                transition: "width 0.3s ease",
              }} />
            </div>

            <div style={{ padding: "28px 32px 32px" }}>
              {/* Step dots */}
              <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
                {STEPS.map((_, i) => (
                  <div key={i} style={{
                    flex: 1, height: 4, borderRadius: 2,
                    background: i <= step ? "var(--primary)" : "var(--border)",
                    transition: "background 0.3s",
                  }} />
                ))}
              </div>

              {/* Step header */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                  Step {step + 1} of {STEPS.length}
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>
                  {STEPS[step].title}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  {STEPS[step].subtitle}
                </div>
              </div>

              {step === 0 && <IncomeStep data={data} onChange={patch} />}
              {step === 1 && <LiabilitiesStep data={data} onChange={patch} />}
              {step === 2 && <AssetsStep data={data} onChange={patch} />}
              {step === 3 && <GoalsStep data={data} onChange={patch} />}
              {step === 4 && <RiskStep data={data} onChange={patch} />}

              {error && (
                <div style={{ marginTop: 16, padding: "10px 14px", background: "#FEE2E2", borderRadius: 8, fontSize: 13, color: "#DC2626" }}>
                  {error}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32 }}>
                <button
                  type="button"
                  onClick={() => {
                    if (step === 0 && profile) {
                      setMode("summary");
                    } else {
                      setStep((s) => s - 1);
                    }
                  }}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 10,
                    border: "1.5px solid var(--border)",
                    background: "transparent",
                    color: "var(--text)",
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  {step === 0 && profile ? "← Cancel" : "← Back"}
                </button>

                {step >= 1 && parseFloat(data.monthly_income) > 0 && (
                  <div style={{
                    fontSize: 12, fontWeight: 600,
                    color: surplus >= 0 ? "var(--primary)" : "#DC2626",
                    background: surplus >= 0 ? "var(--primary-light)" : "#FEE2E2",
                    padding: "4px 12px", borderRadius: 20,
                  }}>
                    Surplus ₹{Math.max(0, surplus).toLocaleString("en-IN")}/mo
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canNext() || saving}
                  style={{
                    padding: "10px 24px",
                    borderRadius: 10,
                    border: "none",
                    background: canNext() && !saving ? "var(--primary)" : "var(--border)",
                    color: canNext() && !saving ? "#fff" : "var(--text-muted)",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: canNext() && !saving ? "pointer" : "default",
                    transition: "all 0.2s",
                  }}
                >
                  {saving ? "Saving…" : step === STEPS.length - 1 ? (profile ? "Save changes →" : "Finish setup →") : "Next →"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div style={{ marginTop: 20, fontSize: 12, color: "var(--text-muted)", textAlign: "center", maxWidth: 400 }}>
        Your information is private and used only to personalise Sahej's advice for you.
      </div>
    </div>
  );
}
