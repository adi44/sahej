import { supabase } from "../lib/supabase";
import Logo from "../components/Logo";

export default function LoginPage() {
  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/chat` },
    });
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "linear-gradient(135deg, #1C6B45 0%, #145432 50%, #0E3D20 100%)",
    }}>
      {/* Left: Branding */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 64px",
        color: "#fff",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <Logo size={64} />
          <span style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-1px" }}>Sahej</span>
        </div>
        <h1 style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.15, marginBottom: 20, letterSpacing: "-1px" }}>
          Smart investing<br />for every woman
        </h1>
        <p style={{ fontSize: 18, opacity: 0.85, marginBottom: 48, maxWidth: 400, lineHeight: 1.6 }}>
          You save carefully. Now let your savings work smarter — with personalised investment guidance built for you.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            ["💰", "Tailored advice", "Based on your savings & goals"],
            ["📈", "Live investment options", "PPF, SIPs, FDs, government schemes & more"],
            ["🤝", "In your language", "Hindi or English — whichever you prefer"],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <span style={{ fontSize: 22 }}>{icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{title}</div>
                <div style={{ opacity: 0.75, fontSize: 13, marginTop: 2 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Login card */}
      <div style={{
        width: 440,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
      }}>
        <div style={{
          background: "#FEF9C3",
          borderRadius: 20,
          padding: "48px 40px",
          width: "100%",
          boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
        }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              <Logo size={72} />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
              Welcome to Sahej
            </h2>
            <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.5 }}>
              Sign in to start your investment journey
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              padding: "14px 20px",
              border: "1.5px solid #E5E7EB",
              borderRadius: 10,
              background: "#FEF9C3",
              color: "#374151",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "#1C6B45")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "#E5E7EB")}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: "#9CA3AF", lineHeight: 1.5 }}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}
