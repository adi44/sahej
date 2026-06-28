import type { ProfileData } from "../../../types/profile";

interface Props {
  data: ProfileData;
  onChange: (patch: Partial<ProfileData>) => void;
}

const FIELDS: { key: keyof ProfileData; label: string; hint: string }[] = [
  { key: "rent_or_emi", label: "Rent or home loan EMI", hint: "Monthly rent or housing loan instalment" },
  { key: "other_emis", label: "Other loan EMIs", hint: "Personal loan, car loan, credit card EMI" },
  { key: "school_fees", label: "Children's school fees", hint: "Monthly equivalent of annual fees" },
  { key: "groceries_utilities", label: "Groceries & utilities", hint: "Food, electricity, gas, phone, internet" },
  { key: "other_expenses", label: "Other monthly expenses", hint: "Domestic help, subscriptions, transport" },
];

export default function LiabilitiesStep({ data, onChange }: Props) {
  const income = parseFloat(data.monthly_income) || 0;
  const total =
    (parseFloat(data.rent_or_emi) || 0) +
    (parseFloat(data.other_emis) || 0) +
    (parseFloat(data.school_fees) || 0) +
    (parseFloat(data.groceries_utilities) || 0) +
    (parseFloat(data.other_expenses) || 0);
  const surplus = income - total;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {FIELDS.map(({ key, label, hint }) => (
        <div key={key}>
          <label style={labelStyle}>{label}</label>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>{hint}</div>
          <div style={rupeeWrap}>
            <span style={rupeeSign}>₹</span>
            <input
              type="number"
              value={data[key] as string}
              onChange={(e) => onChange({ [key]: e.target.value })}
              placeholder="0"
              style={numInput}
            />
          </div>
        </div>
      ))}

      {/* Live surplus pill */}
      <div style={{
        marginTop: 8,
        padding: "14px 18px",
        borderRadius: 12,
        background: surplus >= 0 ? "var(--primary-light)" : "#FEE2E2",
        border: `1.5px solid ${surplus >= 0 ? "var(--primary)" : "#EF4444"}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: surplus >= 0 ? "var(--primary)" : "#DC2626", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {surplus >= 0 ? "Available to invest" : "Expenses exceed income"}
          </div>
          <div style={{ fontSize: 11, color: surplus >= 0 ? "#145432" : "#B91C1C", marginTop: 2 }}>
            ₹{income.toLocaleString("en-IN")} income − ₹{total.toLocaleString("en-IN")} expenses
          </div>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: surplus >= 0 ? "var(--primary)" : "#DC2626" }}>
          ₹{Math.abs(surplus).toLocaleString("en-IN")}
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 14,
  fontWeight: 500,
  color: "var(--text)",
};

const rupeeWrap: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  border: "1.5px solid var(--border)",
  borderRadius: 10,
  background: "var(--bg)",
  overflow: "hidden",
};

const rupeeSign: React.CSSProperties = {
  padding: "0 12px",
  fontSize: 16,
  color: "var(--primary)",
  fontWeight: 600,
  borderRight: "1px solid var(--border)",
  background: "var(--primary-light)",
  alignSelf: "stretch",
  display: "grid",
  placeItems: "center",
};

const numInput: React.CSSProperties = {
  flex: 1,
  padding: "10px 14px",
  border: "none",
  outline: "none",
  background: "transparent",
  fontSize: 15,
  color: "var(--text)",
};
