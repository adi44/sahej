interface Props {
  label: string;
  prefix?: string;
  suffix?: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
}

export default function InputCard({ label, prefix, suffix, value, onChange, min, max, step }: Props) {
  return (
    <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 14, padding: "16px 18px" }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 14 }}>
        {prefix && <span style={{ fontSize: 18, fontWeight: 400, color: "var(--text-muted)" }}>{prefix}</span>}
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (!isNaN(v)) onChange(Math.max(min, Math.min(max, v)));
          }}
          style={{ fontSize: 26, fontWeight: 700, color: "var(--primary)", border: "none", outline: "none", background: "transparent", width: "100%", minWidth: 0 }}
        />
        {suffix && <span style={{ fontSize: 16, fontWeight: 600, color: "var(--text-muted)", flexShrink: 0 }}>{suffix}</span>}
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "var(--primary)", cursor: "pointer" }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 11, color: "var(--text-muted)" }}>
        <span>{prefix}{min.toLocaleString("en-IN")}{suffix}</span>
        <span>{prefix}{max.toLocaleString("en-IN")}{suffix}</span>
      </div>
    </div>
  );
}
