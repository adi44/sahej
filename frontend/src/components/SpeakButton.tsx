interface Props {
  messageId: string;
  text: string;
  speakingId: string | null;
  onSpeak: (text: string, id: string) => void;
  onStop: () => void;
}

export default function SpeakButton({ messageId, text, speakingId, onSpeak, onStop }: Props) {
  const isPlaying = speakingId === messageId;

  return (
    <button
      onClick={() => isPlaying ? onStop() : onSpeak(text, messageId)}
      title={isPlaying ? "Stop" : "Listen"}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "4px 6px",
        borderRadius: 6,
        color: isPlaying ? "var(--primary)" : "var(--text-muted)",
        display: "flex",
        alignItems: "center",
        opacity: 0.7,
        transition: "opacity 0.15s, color 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
    >
      {isPlaying ? <StopIcon /> : <SpeakerIcon />}
    </button>
  );
}

function SpeakerIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11 5 6 9H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h3l5 4V5ZM15.54 8.46a5 5 0 0 1 0 7.07M18.36 5.64a9 9 0 0 1 0 12.73" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <path d="M11 5 6 9H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h3l5 4V5Z" fill="currentColor"/>
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="2"/>
    </svg>
  );
}
