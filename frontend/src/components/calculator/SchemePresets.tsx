import type { Scheme } from "../../utils/calculator";

interface Props {
  schemes: Scheme[];
  selected: Scheme | null;
  onSelect: (s: Scheme) => void;
  loading: boolean;
}

export default function SchemePresets({ schemes, selected, onSelect, loading }: Props) {
  return (
    <div style={{ padding: "8px 16px 4px" }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
        {loading ? "Fetching live rates…" : "Live scheme rates"}
      </div>

      {loading && (
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, padding: "8px 4px" }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ height: 36, borderRadius: 8, background: "rgba(255,255,255,0.06)", marginBottom: 4, animation: "pulse 1.4s ease-in-out infinite", animationDelay: `${i * 0.1}s` }} />
          ))}
          <style>{`@keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:0.8} }`}</style>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {schemes.map((s) => {
          const isActive = selected?.id === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s)}
              style={{
                padding: "9px 12px",
                borderRadius: 8,
                border: isActive ? "1.5px solid rgba(22,163,74,0.8)" : "1.5px solid transparent",
                background: isActive ? "rgba(22,163,74,0.35)" : "rgba(255,255,255,0.04)",
                color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                fontSize: 13,
                textAlign: "left",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontWeight: isActive ? 600 : 400 }}>{s.label}</span>
              <span style={{ fontSize: 12, color: s.safe ? "#34D399" : "#FBBF24", fontWeight: 700 }}>
                {s.rate}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
