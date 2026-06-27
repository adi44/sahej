import { sipFV, formatINR, type Scheme } from "../../utils/calculator";

interface Props {
  schemes: Scheme[];
  selected: Scheme | null;
  monthly: number;
  years: number;
  onSelect: (s: Scheme) => void;
}

export default function ComparisonTable({ schemes, selected, monthly, years, onSelect }: Props) {
  const invested = monthly * years * 12;

  const rows = schemes
    .map((s) => {
      const total = Math.round(sipFV(monthly, years, s.rate));
      return { ...s, total, returns: total - invested };
    })
    .sort((a, b) => b.total - a.total);

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontWeight: 600, fontSize: 15 }}>Scheme Comparison</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
          {formatINR(monthly)}/month for {years} year{years !== 1 ? "s" : ""} — ranked by maturity
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#F9FAFB" }}>
            {["Scheme", "Type", "Live Rate", "Total Invested", "Returns", "Maturity Amount"].map((h) => (
              <th
                key={h}
                style={{ padding: "10px 20px", textAlign: "left", fontWeight: 600, color: "var(--text-muted)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((s, i) => {
            const isActive = s.id === selected?.id;
            return (
              <tr
                key={s.id}
                onClick={() => onSelect(s)}
                style={{
                  borderTop: "1px solid var(--border)",
                  background: isActive ? "var(--primary-light)" : "transparent",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#F9FAFB"; }}
                onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <td style={{ padding: "12px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {i === 0 && (
                      <span style={{ fontSize: 10, background: "#F59E0B", color: "#fff", padding: "2px 6px", borderRadius: 4, fontWeight: 700, flexShrink: 0 }}>
                        BEST
                      </span>
                    )}
                    <span style={{ fontWeight: isActive ? 700 : 500, color: isActive ? "var(--primary)" : "var(--text)" }}>
                      {s.label}
                    </span>
                  </div>
                </td>
                <td style={{ padding: "12px 20px" }}>
                  <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 4, background: s.safe ? "#D1FAE5" : "#FEF3C7", color: s.safe ? "#065F46" : "#92400E", fontWeight: 600 }}>
                    {s.tag}
                  </span>
                </td>
                <td style={{ padding: "12px 20px", fontWeight: 700, color: s.safe ? "#059669" : "#D97706" }}>
                  {s.rate}%
                </td>
                <td style={{ padding: "12px 20px", color: "var(--text-muted)" }}>
                  {formatINR(invested)}
                </td>
                <td style={{ padding: "12px 20px", fontWeight: 600, color: "#D97706" }}>
                  {formatINR(s.returns)}
                </td>
                <td style={{ padding: "12px 20px", fontWeight: 700, color: isActive ? "var(--primary)" : "var(--text)" }}>
                  {formatINR(s.total)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
