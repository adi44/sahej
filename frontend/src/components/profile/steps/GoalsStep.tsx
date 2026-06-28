import type { ProfileData } from "../../../types/profile";

const GOAL_OPTIONS = [
  { type: "emergency", label: "Emergency fund", icon: "🏥", defaultYears: 1 },
  { type: "education", label: "Children's education", icon: "📚", defaultYears: 10 },
  { type: "marriage", label: "Children's marriage", icon: "💍", defaultYears: 15 },
  { type: "retirement", label: "Retirement", icon: "🌅", defaultYears: 25 },
  { type: "home", label: "Own home or land", icon: "🏠", defaultYears: 7 },
  { type: "medical", label: "Medical buffer", icon: "💊", defaultYears: 3 },
];

const THIS_YEAR = new Date().getFullYear();

interface Props {
  data: ProfileData;
  onChange: (patch: Partial<ProfileData>) => void;
}

export default function GoalsStep({ data, onChange }: Props) {
  function toggleGoal(type: string, defaultYears: number) {
    const exists = data.goals.find((g) => g.type === type);
    if (exists) {
      onChange({ goals: data.goals.filter((g) => g.type !== type) });
    } else {
      onChange({ goals: [...data.goals, { type, target_year: THIS_YEAR + defaultYears }] });
    }
  }

  function setTargetYear(type: string, year: number) {
    onChange({
      goals: data.goals.map((g) => (g.type === type ? { ...g, target_year: year } : g)),
    });
  }

  function setNumChildren(val: string) {
    const n = parseInt(val) || 0;
    const ages = Array.from({ length: n }, (_, i) => data.children_ages[i] ?? "");
    onChange({ num_children: val, children_ages: ages });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <label style={labelStyle}>What are you saving for?</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
          {GOAL_OPTIONS.map((opt) => {
            const selected = data.goals.find((g) => g.type === opt.type);
            return (
              <div key={opt.type} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <button
                  type="button"
                  onClick={() => toggleGoal(opt.type, opt.defaultYears)}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: `2px solid ${selected ? "var(--primary)" : "var(--border)"}`,
                    background: selected ? "var(--primary-light)" : "var(--surface)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 20 }}>{opt.icon}</span>
                  <span style={{
                    fontSize: 13, fontWeight: selected ? 600 : 400,
                    color: selected ? "var(--primary)" : "var(--text)",
                  }}>
                    {opt.label}
                  </span>
                </button>
                {selected && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 4 }}>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>By year</span>
                    <input
                      type="number"
                      value={selected.target_year}
                      min={THIS_YEAR + 1}
                      max={THIS_YEAR + 40}
                      onChange={(e) => setTargetYear(opt.type, parseInt(e.target.value) || THIS_YEAR + opt.defaultYears)}
                      style={{
                        width: 72, padding: "4px 8px", border: "1.5px solid var(--primary)",
                        borderRadius: 6, fontSize: 13, color: "var(--primary)", fontWeight: 600,
                        background: "var(--primary-light)", outline: "none",
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <label style={labelStyle}>Number of children</label>
        <div style={{ display: "flex", gap: 8 }}>
          {["0", "1", "2", "3", "4+"].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setNumChildren(n === "4+" ? "4" : n)}
              style={{
                padding: "10px 0",
                width: 52,
                borderRadius: 10,
                border: `2px solid ${data.num_children === (n === "4+" ? "4" : n) ? "var(--primary)" : "var(--border)"}`,
                background: data.num_children === (n === "4+" ? "4" : n) ? "var(--primary-light)" : "var(--surface)",
                color: data.num_children === (n === "4+" ? "4" : n) ? "var(--primary)" : "var(--text)",
                fontWeight: data.num_children === (n === "4+" ? "4" : n) ? 700 : 400,
                fontSize: 16,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {parseInt(data.num_children) > 0 && (
        <div>
          <label style={labelStyle}>Children's ages (years)</label>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {Array.from({ length: parseInt(data.num_children) || 0 }, (_, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Child {i + 1}</span>
                <input
                  type="number"
                  min={0}
                  max={25}
                  value={data.children_ages[i] ?? ""}
                  onChange={(e) => {
                    const ages = [...data.children_ages];
                    ages[i] = e.target.value;
                    onChange({ children_ages: ages });
                  }}
                  placeholder="Age"
                  style={{
                    width: 64, padding: "8px 10px", border: "1.5px solid var(--border)",
                    borderRadius: 8, fontSize: 15, textAlign: "center",
                    color: "var(--text)", outline: "none", background: "var(--bg)",
                  }}
                />
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
            Age helps us check Sukanya Samriddhi eligibility (daughters under 10)
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 0,
};
