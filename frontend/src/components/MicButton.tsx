interface Props {
  listening: boolean;
  supported: boolean;
  onStart: () => void;
  onStop: () => void;
}

export default function MicButton({ listening, supported, onStart, onStop }: Props) {
  if (!supported) return null;

  return (
    <>
      <style>{`
        @keyframes micPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
          50%        { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
        }
      `}</style>

      <button
        onClick={listening ? onStop : onStart}
        title={listening ? "Stop recording" : "Speak your question"}
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "none",
          background: listening ? "#EF4444" : "var(--primary-light)",
          color: listening ? "#fff" : "var(--primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          flexShrink: 0,
          transition: "background 0.2s",
          animation: listening ? "micPulse 1.2s ease-in-out infinite" : "none",
        }}
      >
        {listening ? <StopIcon /> : <MicIcon />}
      </button>
    </>
  );
}

function MicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4Zm7 10a1 1 0 0 1 1 1 8 8 0 0 1-7 7.94V22h2a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h2v-2.06A8 8 0 0 1 4 12a1 1 0 1 1 2 0 6 6 0 0 0 12 0 1 1 0 0 1 1-1Z"/>
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="2"/>
    </svg>
  );
}
