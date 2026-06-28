import type { Lang } from "../hooks/useSpeech";

interface Props {
  lang: Lang;
  onChange: (l: Lang) => void;
}

export default function LangToggle({ lang, onChange }: Props) {
  return (
    <div style={{
      display: "flex",
      background: "var(--primary-light)",
      borderRadius: 20,
      padding: 3,
      gap: 2,
      flexShrink: 0,
    }}>
      {(["en-IN", "hi-IN"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          style={{
            padding: "4px 10px",
            borderRadius: 16,
            border: "none",
            background: lang === l ? "var(--primary)" : "transparent",
            color: lang === l ? "#fff" : "var(--primary)",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          {l === "en-IN" ? "EN" : "हिं"}
        </button>
      ))}
    </div>
  );
}
