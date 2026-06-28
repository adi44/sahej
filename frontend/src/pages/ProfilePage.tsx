import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import IncomeStep from "../components/profile/steps/IncomeStep";
import LiabilitiesStep from "../components/profile/steps/LiabilitiesStep";
import AssetsStep from "../components/profile/steps/AssetsStep";
import GoalsStep from "../components/profile/steps/GoalsStep";
import RiskStep from "../components/profile/steps/RiskStep";
import { saveProfile } from "../api/profile";
import { type ProfileData, EMPTY_PROFILE } from "../types/profile";

const STEPS = [
  { title: "Your income", subtitle: "Tell us what comes in each month" },
  { title: "Liabilities & expenses", subtitle: "What goes out every month" },
  { title: "What you already have", subtitle: "Savings and existing investments" },
  { title: "Your goals", subtitle: "What are you saving towards?" },
  { title: "Risk comfort", subtitle: "How do you feel about your money?" },
];

interface Props {
  onComplete: () => void;
}

export default function ProfilePage({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ProfileData>(EMPTY_PROFILE);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function patch(update: Partial<ProfileData>) {
    setData((prev) => ({ ...prev, ...update }));
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
    // Final step — save profile
    setSaving(true);
    setError("");
    try {
      await saveProfile(data);
      onComplete();
      navigate("/chat", { replace: true });
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

      {/* Card */}
      <div style={{
        width: "100%",
        maxWidth: 520,
        background: "var(--surface)",
        borderRadius: 20,
        boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        overflow: "hidden",
      }}>
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
          {/* Step indicator */}
          <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
            {STEPS.map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  background: i <= step ? "var(--primary)" : "var(--border)",
                  transition: "background 0.3s",
                }}
              />
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

          {/* Step content */}
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

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32 }}>
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
              style={{
                padding: "10px 20px",
                borderRadius: 10,
                border: "1.5px solid var(--border)",
                background: "transparent",
                color: step === 0 ? "var(--border)" : "var(--text)",
                fontSize: 14,
                fontWeight: 500,
                cursor: step === 0 ? "default" : "pointer",
              }}
            >
              ← Back
            </button>

            {/* Surplus chip visible from step 1 onward */}
            {step >= 1 && parseFloat(data.monthly_income) > 0 && (
              <div style={{
                fontSize: 12,
                fontWeight: 600,
                color: surplus >= 0 ? "var(--primary)" : "#DC2626",
                background: surplus >= 0 ? "var(--primary-light)" : "#FEE2E2",
                padding: "4px 12px",
                borderRadius: 20,
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
              {saving ? "Saving…" : step === STEPS.length - 1 ? "Finish setup →" : "Next →"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20, fontSize: 12, color: "var(--text-muted)", textAlign: "center", maxWidth: 400 }}>
        Your information is private and used only to personalise Sahej's advice for you.
      </div>
    </div>
  );
}
