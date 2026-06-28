import type { ProfileData } from "../../../types/profile";

const SOURCE_OPTIONS = [
  { value: "salary", label: "I earn a salary" },
  { value: "business", label: "I run a business" },
  { value: "both", label: "Both of us earn" },
  { value: "spouse", label: "My husband earns" },
];

interface Props {
  data: ProfileData;
  onChange: (patch: Partial<ProfileData>) => void;
}

export default function IncomeStep({ data, onChange }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <label style={labelStyle}>Monthly household income</label>
        <div style={rupeeWrap}>
          <span style={rupeeSign}>₹</span>
          <input
            type="number"
            value={data.monthly_income}
            onChange={(e) => onChange({ monthly_income: e.target.value })}
            placeholder="e.g. 35000"
            style={numInput}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Who earns in your household?</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
          {SOURCE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ income_source: opt.value })}
              style={{
                padding: "12px 14px",
                borderRadius: 10,
                border: `2px solid ${data.income_source === opt.value ? "var(--primary)" : "var(--border)"}`,
                background: data.income_source === opt.value ? "var(--primary-light)" : "var(--surface)",
                color: data.income_source === opt.value ? "var(--primary)" : "var(--text)",
                fontWeight: data.income_source === opt.value ? 600 : 400,
                fontSize: 14,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 500, fontSize: 14, color: "var(--text)" }}>Is income regular each month?</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
            Irregular income may need a more conservative plan
          </div>
        </div>
        <button
          type="button"
          onClick={() => onChange({ income_is_regular: !data.income_is_regular })}
          style={{
            width: 52,
            height: 28,
            borderRadius: 14,
            border: "none",
            background: data.income_is_regular ? "var(--primary)" : "var(--border)",
            cursor: "pointer",
            position: "relative",
            flexShrink: 0,
            transition: "background 0.2s",
          }}
        >
          <span style={{
            position: "absolute",
            top: 3,
            left: data.income_is_regular ? 27 : 3,
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "#fff",
            transition: "left 0.2s",
            display: "block",
          }} />
        </button>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 14,
  fontWeight: 500,
  color: "var(--text)",
  marginBottom: 8,
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
  fontSize: 18,
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
  padding: "12px 14px",
  border: "none",
  outline: "none",
  background: "transparent",
  fontSize: 16,
  color: "var(--text)",
};
