import { supabase } from "../lib/supabase";
import Logo from "../components/Logo";

const FEATURES = [
  {
    title: "Tailored to your finances",
    desc: "Advice anchored to your actual income, expenses, and goals — not generic tips.",
  },
  {
    title: "Live investment options",
    desc: "Current rates for PPF, NSC, Sukanya Samriddhi, SIPs, FDs and more.",
  },
  {
    title: "Hindi or English, your choice",
    desc: "Ask in whichever language feels natural. Sahej understands both.",
  },
];

export default function LoginPage() {
  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/` },
    });
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* ── Left: brand panel ───────────────────────────────────── */}
      <div style={{
        flex: 1,
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        padding: "48px 72px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "auto" }}>
          <Logo size={30} />
          <span style={{ fontSize: 17, fontWeight: 700, color: "#1C6B45", letterSpacing: "-0.2px" }}>Sahej</span>
        </div>

        {/* Main copy */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 40, paddingBottom: 40 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 12px",
            borderRadius: 20,
            background: "#D1FAE5",
            color: "#065F46",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.03em",
            marginBottom: 24,
            width: "fit-content",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", display: "inline-block" }} />
            Now available — try Sahej free
          </div>

          <h1 style={{
            fontSize: 52,
            fontWeight: 800,
            lineHeight: 1.1,
            color: "#0B1F14",
            letterSpacing: "-2px",
            marginBottom: 20,
          }}>
            Smart investing<br />for every woman
          </h1>

          <p style={{
            fontSize: 17,
            color: "#4B5563",
            lineHeight: 1.75,
            maxWidth: 420,
            marginBottom: 52,
            fontWeight: 400,
          }}>
            You save carefully. Now let your savings work smarter — with personalised investment guidance built for you.
          </p>

          {/* Feature list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "#D1FAE5",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  marginTop: 2,
                }}>
                  <CheckIcon />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#111827", lineHeight: 1.4 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: "#6B7280", marginTop: 3, lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: "auto" }}>
          © 2025 Sahej · Built with care for Indian women
        </div>

        {/* Decorative rings */}
        <div style={{ position: "absolute", right: -140, bottom: -140, width: 420, height: 420, borderRadius: "50%", border: "1.5px solid #D1FAE5", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: -80, bottom: -80, width: 260, height: 260, borderRadius: "50%", border: "1.5px solid #D1FAE5", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: -24, bottom: -24, width: 120, height: 120, borderRadius: "50%", background: "#F0FDF4", pointerEvents: "none" }} />
      </div>

      {/* Divider */}
      <div style={{ width: 1, background: "#E5E7EB", flexShrink: 0 }} />

      {/* ── Right: login panel ──────────────────────────────────── */}
      <div style={{
        width: 440,
        background: "#1C6B45",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 48px",
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Subtle radial glow */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Logo size={56} />

          <h2 style={{
            fontSize: 26,
            fontWeight: 800,
            color: "#fff",
            marginTop: 20,
            marginBottom: 8,
            letterSpacing: "-0.5px",
            textAlign: "center",
          }}>
            Welcome to Sahej
          </h2>

          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 44, textAlign: "center", lineHeight: 1.6 }}>
            Sign in to start your investment journey
          </p>

          <button
            onClick={handleGoogleLogin}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              padding: "14px 20px",
              border: "none",
              borderRadius: 12,
              background: "#fff",
              color: "#111827",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
              transition: "transform 0.15s, box-shadow 0.15s",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.22)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.18)";
            }}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div style={{ marginTop: 32, width: "100%", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.12)" }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>Secured by Supabase Auth</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.12)" }} />
          </div>

          <p style={{ marginTop: 32, fontSize: 12, color: "rgba(255,255,255,0.35)", textAlign: "center", lineHeight: 1.7 }}>
            By continuing, you agree to our<br />Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M2.5 6.5L5.5 9.5L10.5 4" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
