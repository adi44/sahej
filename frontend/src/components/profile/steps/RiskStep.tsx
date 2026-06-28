import type { ProfileData } from "../../../types/profile";

const OPTIONS = [
  {
    value: "conservative",
    icon: "🟢",
    title: "Keep it safe",
    desc: "Government-backed schemes only — PPF, NSC, Sukanya, Post Office. No market risk.",
    color: "#15803D",
    bg: "#DCFCE7",
    border: "#16A34A",
  },
  {
    value: "moderate",
    icon: "🟡",
    title: "Some growth is fine",
    desc: "Mix of safe schemes and a little mutual fund exposure. Steady, balanced growth.",
    color: "#A16207",
    bg: "#FEF9C3",
    border: "#CA8A04",
  },
  {
    value: "aggressive",
    icon: "🔴",
    title: "Grow my money fast",
    desc: "Willing to ride market ups and downs for potentially higher returns in the long run.",
    color: "#B91C1C",
    bg: "#FEE2E2",
    border: "#EF4444",
  },
];

interface Props {
  data: ProfileData;
  onChange: (patch: Partial<ProfileData>) => void;
}

export default function RiskStep({ data, onChange }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {OPTIONS.map((opt) => {
        const active = data.risk_appetite === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange({ risk_appetite: opt.value })}
            style={{
              padding: "18px 20px",
              borderRadius: 12,
              border: `2px solid ${active ? opt.border : "var(--border)"}`,
              background: active ? opt.bg : "var(--surface)",
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
              transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{opt.icon}</span>
            <div>
              <div style={{
                fontWeight: 700,
                fontSize: 15,
                color: active ? opt.color : "var(--text)",
                marginBottom: 4,
              }}>
                {opt.title}
              </div>
              <div style={{ fontSize: 13, color: active ? opt.color : "var(--text-muted)", lineHeight: 1.5 }}>
                {opt.desc}
              </div>
            </div>
            {active && (
              <span style={{
                marginLeft: "auto",
                flexShrink: 0,
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: opt.border,
                display: "grid",
                placeItems: "center",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
              }}>✓</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
