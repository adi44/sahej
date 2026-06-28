import type { ProfileData } from "../../../types/profile";

const INVESTMENTS = [
  { value: "ppf", label: "PPF", desc: "Public Provident Fund" },
  { value: "nsc", label: "NSC", desc: "National Savings Certificate" },
  { value: "fd", label: "FD", desc: "Fixed Deposit" },
  { value: "gold", label: "Gold", desc: "Physical or digital gold" },
  { value: "mf", label: "Mutual Funds", desc: "SIPs or lump sum" },
  { value: "stocks", label: "Stocks", desc: "Direct equity" },
];

interface Props {
  data: ProfileData;
  onChange: (patch: Partial<ProfileData>) => void;
}

export default function AssetsStep({ data, onChange }: Props) {
  function toggleInvestment(value: string) {
    const current = data.existing_investments;
    onChange({
      existing_investments: current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <label style={labelStyle}>Current savings in bank account</label>
        <div style={rupeeWrap}>
          <span style={rupeeSign}>₹</span>
          <input
            type="number"
            value={data.savings_balance}
            onChange={(e) => onChange({ savings_balance: e.target.value })}
            placeholder="0"
            style={numInput}
          />
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
          Helps us check if you have an emergency buffer already
        </div>
      </div>

      <div>
        <label style={labelStyle}>Existing investments (select all that apply)</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
          {INVESTMENTS.map((inv) => {
            const active = data.existing_investments.includes(inv.value);
            return (
              <button
                key={inv.value}
                type="button"
                onClick={() => toggleInvestment(inv.value)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: `2px solid ${active ? "var(--primary)" : "var(--border)"}`,
                  background: active ? "var(--primary-light)" : "var(--surface)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 14, color: active ? "var(--primary)" : "var(--text)" }}>
                  {inv.label}
                </div>
                <div style={{ fontSize: 12, color: active ? "#145432" : "var(--text-muted)", marginTop: 2 }}>
                  {inv.desc}
                </div>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => onChange({ existing_investments: [] })}
          style={{
            marginTop: 8,
            padding: "8px 14px",
            borderRadius: 8,
            border: `1.5px solid ${data.existing_investments.length === 0 ? "var(--primary)" : "var(--border)"}`,
            background: data.existing_investments.length === 0 ? "var(--primary-light)" : "transparent",
            color: data.existing_investments.length === 0 ? "var(--primary)" : "var(--text-muted)",
            fontSize: 13,
            fontWeight: data.existing_investments.length === 0 ? 600 : 400,
            cursor: "pointer",
            width: "100%",
            transition: "all 0.15s",
          }}
        >
          None — I haven't invested yet
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 500, fontSize: 14, color: "var(--text)" }}>Do you have life or health insurance?</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
            Affects how we prioritise insurance in your plan
          </div>
        </div>
        <button
          type="button"
          onClick={() => onChange({ has_insurance: !data.has_insurance })}
          style={{
            width: 52, height: 28, borderRadius: 14, border: "none",
            background: data.has_insurance ? "var(--primary)" : "var(--border)",
            cursor: "pointer", position: "relative", flexShrink: 0, transition: "background 0.2s",
          }}
        >
          <span style={{
            position: "absolute", top: 3,
            left: data.has_insurance ? 27 : 3,
            width: 22, height: 22, borderRadius: "50%", background: "#fff",
            transition: "left 0.2s", display: "block",
          }} />
        </button>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 8,
};

const rupeeWrap: React.CSSProperties = {
  display: "flex", alignItems: "center", border: "1.5px solid var(--border)",
  borderRadius: 10, background: "var(--bg)", overflow: "hidden",
};

const rupeeSign: React.CSSProperties = {
  padding: "0 12px", fontSize: 16, color: "var(--primary)", fontWeight: 600,
  borderRight: "1px solid var(--border)", background: "var(--primary-light)",
  alignSelf: "stretch", display: "grid", placeItems: "center",
};

const numInput: React.CSSProperties = {
  flex: 1, padding: "12px 14px", border: "none", outline: "none",
  background: "transparent", fontSize: 15, color: "var(--text)",
};
