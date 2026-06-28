import { useNavigate } from "react-router-dom";
import type { SavedProfile } from "../../api/profile";

const SOURCE_LABELS: Record<string, string> = {
  salary: "Salary",
  business: "Business income",
  both: "Salary & Business",
  spouse: "Spouse's income",
};

const RISK_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  conservative: { label: "Safe & Secure", color: "#15803D", bg: "#DCFCE7" },
  moderate: { label: "Balanced Growth", color: "#A16207", bg: "#FEF9C3" },
  aggressive: { label: "High Growth", color: "#B91C1C", bg: "#FEE2E2" },
};

const GOAL_LABELS: Record<string, string> = {
  emergency: "🏥 Emergency fund",
  education: "📚 Children's education",
  marriage: "💍 Children's marriage",
  retirement: "🌅 Retirement",
  home: "🏠 Own home",
  medical: "💊 Medical buffer",
};

const INV_LABELS: Record<string, string> = {
  ppf: "PPF", nsc: "NSC", fd: "FD", gold: "Gold", mf: "Mutual Funds", stocks: "Stocks",
};

interface Props {
  profile: SavedProfile;
  onEdit: () => void;
}

export default function ProfileSummary({ profile, onEdit }: Props) {
  const navigate = useNavigate();
  const risk = RISK_CONFIG[profile.risk_appetite] ?? { label: profile.risk_appetite, color: "var(--primary)", bg: "var(--primary-light)" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text)" }}>Your Financial Profile</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
            Last updated {new Date(profile.updated_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </div>
        </div>
        <button
          onClick={onEdit}
          style={{
            padding: "8px 18px",
            borderRadius: 8,
            border: "1.5px solid var(--primary)",
            background: "transparent",
            color: "var(--primary)",
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Edit →
        </button>
      </div>

      {/* Hero surplus */}
      <div style={{
        padding: "20px 24px",
        borderRadius: 14,
        background: "linear-gradient(135deg, #1C6B45 0%, #145432 100%)",
        color: "#fff",
        marginBottom: 20,
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.75, marginBottom: 6 }}>
          Available to invest each month
        </div>
        <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-1px", marginBottom: 8 }}>
          ₹{profile.investable_surplus.toLocaleString("en-IN")}
        </div>
        <div style={{ fontSize: 13, opacity: 0.8 }}>
          ₹{profile.monthly_income.toLocaleString("en-IN")} income &nbsp;−&nbsp; ₹{profile.monthly_expenses.toLocaleString("en-IN")} expenses
        </div>
      </div>

      {/* Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Income */}
        <Section label="Income">
          <Row label="Monthly" value={`₹${profile.monthly_income.toLocaleString("en-IN")}`} />
          <Row label="Source" value={SOURCE_LABELS[profile.income_source] ?? profile.income_source} />
          <Row label="Regular?" value={profile.income_is_regular ? "Yes" : "No (irregular)"} />
        </Section>

        {/* Expenses breakdown */}
        <Section label="Monthly expenses">
          {profile.rent_or_emi > 0 && <Row label="Rent / Home EMI" value={`₹${profile.rent_or_emi.toLocaleString("en-IN")}`} />}
          {profile.other_emis > 0 && <Row label="Other loan EMIs" value={`₹${profile.other_emis.toLocaleString("en-IN")}`} />}
          {profile.school_fees > 0 && <Row label="School fees" value={`₹${profile.school_fees.toLocaleString("en-IN")}`} />}
          {profile.groceries_utilities > 0 && <Row label="Groceries & utilities" value={`₹${profile.groceries_utilities.toLocaleString("en-IN")}`} />}
          {profile.other_expenses > 0 && <Row label="Other expenses" value={`₹${profile.other_expenses.toLocaleString("en-IN")}`} />}
          <Row label="Total" value={`₹${profile.monthly_expenses.toLocaleString("en-IN")}`} bold />
        </Section>

        {/* Risk */}
        <Section label="Risk comfort">
          <span style={{
            display: "inline-block",
            padding: "4px 14px",
            borderRadius: 20,
            background: risk.bg,
            color: risk.color,
            fontWeight: 700,
            fontSize: 13,
          }}>
            {risk.label}
          </span>
        </Section>

        {/* Goals */}
        {profile.goals.length > 0 && (
          <Section label="Goals">
            {profile.goals.map((g) => (
              <div key={g.type} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: 14, color: "var(--text)" }}>{GOAL_LABELS[g.type] ?? g.type}</span>
                <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>by {g.target_year}</span>
              </div>
            ))}
          </Section>
        )}

        {/* Assets */}
        <Section label="Savings & investments">
          <Row label="Bank savings" value={`₹${profile.savings_balance.toLocaleString("en-IN")}`} />
          {profile.existing_investments.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
              {profile.existing_investments.map((inv) => (
                <span key={inv} style={{
                  padding: "3px 12px",
                  borderRadius: 20,
                  background: "var(--primary-light)",
                  color: "var(--primary)",
                  fontSize: 13,
                  fontWeight: 600,
                }}>
                  {INV_LABELS[inv] ?? inv}
                </span>
              ))}
            </div>
          ) : (
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>None yet</span>
          )}
          <Row label="Insurance" value={profile.has_insurance ? "Yes" : "No"} />
        </Section>

        {/* Family */}
        <Section label="Family">
          <Row
            label="Children"
            value={
              profile.num_children === 0
                ? "None"
                : `${profile.num_children} · ages ${profile.children_ages.join(", ")}`
            }
          />
        </Section>
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate("/chat")}
        style={{
          marginTop: 28,
          padding: "14px",
          borderRadius: 12,
          border: "none",
          background: "var(--primary)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 15,
          cursor: "pointer",
          width: "100%",
        }}
      >
        Talk to Sahej →
      </button>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--bg)", borderRadius: 12, padding: "14px 16px" }}>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--primary)", marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {children}
      </div>
    </div>
  );
}

function Row({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: bold ? 700 : 500, color: bold ? "var(--text)" : "var(--text)" }}>{value}</span>
    </div>
  );
}
