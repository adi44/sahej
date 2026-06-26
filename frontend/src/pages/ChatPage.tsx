import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { sendMessage, getSessions, getSession, type ChatSession, type ChatMessage } from "../api/chat";

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ name: string; picture: string | null } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getSessions().then(setSessions);
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({
          name: data.user.user_metadata?.full_name ?? data.user.email ?? "User",
          picture: data.user.user_metadata?.avatar_url ?? null,
        });
      }
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput("");
    setLoading(true);

    // Optimistically add the user message
    const optimisticMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      agent_metadata: null,
      created_at: new Date().toISOString(),
    };
    setActiveSession((prev) => prev
      ? { ...prev, messages: [...(prev.messages ?? []), optimisticMsg] }
      : null
    );

    try {
      const { session_id } = await sendMessage(text, activeSession?.id);
      const updated = await getSession(session_id);
      setActiveSession(updated);
      setSessions((prev) => {
        const exists = prev.find((s) => s.id === session_id);
        return exists
          ? prev.map((s) => (s.id === session_id ? updated : s))
          : [updated, ...prev];
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)", overflow: "hidden" }}>
      {/* Sidebar */}
      <aside style={{
        width: 260,
        display: "flex",
        flexDirection: "column",
        background: "#1E1B4B",
        color: "#fff",
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>🌸 Sahej</div>
        </div>

        {/* New chat */}
        <div style={{ padding: "12px 12px 8px" }}>
          <button
            onClick={() => setActiveSession(null)}
            style={{
              width: "100%",
              padding: "10px 14px",
              background: "rgba(124,58,237,0.6)",
              border: "1px solid rgba(124,58,237,0.8)",
              borderRadius: 8,
              color: "#fff",
              fontSize: 14,
              fontWeight: 500,
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 18 }}>+</span> New chat
          </button>
        </div>

        {/* Sessions */}
        <div style={{ flex: 1, overflowY: "auto", padding: "4px 12px" }}>
          {sessions.length > 0 && (
            <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", padding: "8px 4px 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Recent
            </div>
          )}
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={async () => setActiveSession(await getSession(s.id))}
              style={{
                width: "100%",
                padding: "9px 10px",
                borderRadius: 7,
                background: activeSession?.id === s.id ? "rgba(124,58,237,0.4)" : "transparent",
                border: "none",
                color: activeSession?.id === s.id ? "#fff" : "rgba(255,255,255,0.65)",
                fontSize: 13,
                textAlign: "left",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                cursor: "pointer",
                marginBottom: 2,
                display: "block",
              }}
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* User / logout */}
        {user && (
          <div style={{
            padding: "12px 16px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}>
            {user.picture
              ? <img src={user.picture} style={{ width: 32, height: 32, borderRadius: "50%" }} />
              : <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--primary)", display: "grid", placeItems: "center", fontSize: 14, fontWeight: 600 }}>{user.name[0]}</div>
            }
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 18, cursor: "pointer", padding: 4 }}
            >
              ↩
            </button>
          </div>
        )}
      </aside>

      {/* Main chat area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{
          padding: "16px 24px",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>
              {activeSession ? activeSession.title : "New conversation"}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>
              Sahej AI · Investment advisor
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 4 }}>
          {!activeSession?.messages?.length && !loading && (
            <div style={{ margin: "auto", textAlign: "center", color: "var(--text-muted)" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🌸</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>
                Namaste! I'm Sahej
              </div>
              <div style={{ fontSize: 14, maxWidth: 380, lineHeight: 1.6 }}>
                Ask me anything about saving and investing — in Hindi or English. I'll find the best options for you.
              </div>
              <div style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                {[
                  "Where should I invest ₹5,000 per month?",
                  "What is PPF and should I invest in it?",
                  "How to start a SIP?",
                  "Best investment for my daughter's education",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); }}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 20,
                      border: "1.5px solid var(--primary-light)",
                      background: "var(--primary-light)",
                      color: "var(--primary)",
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeSession?.messages?.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}

          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div style={{
          padding: "16px 24px",
          borderTop: "1px solid var(--border)",
          background: "var(--surface)",
        }}>
          <div style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-end",
            background: "var(--bg)",
            border: "1.5px solid var(--border)",
            borderRadius: 14,
            padding: "6px 6px 6px 16px",
            transition: "border-color 0.2s",
          }}
            onFocusCapture={e => e.currentTarget.style.borderColor = "var(--primary)"}
            onBlurCapture={e => e.currentTarget.style.borderColor = "var(--border)"}
          >
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask about savings, investments, schemes… (Shift+Enter for new line)"
              disabled={loading}
              rows={1}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 14,
                lineHeight: 1.5,
                resize: "none",
                color: "var(--text)",
                paddingTop: 8,
                paddingBottom: 8,
                maxHeight: 160,
                overflow: "auto",
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                border: "none",
                background: loading || !input.trim() ? "var(--border)" : "var(--primary)",
                color: loading || !input.trim() ? "var(--text-muted)" : "#fff",
                fontWeight: 600,
                fontSize: 14,
                transition: "all 0.2s",
                flexShrink: 0,
              }}
            >
              {loading ? "…" : "Send"}
            </button>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6, textAlign: "center" }}>
            Sahej provides general guidance. Always consult a certified financial advisor for major decisions.
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: 8,
    }}>
      {!isUser && (
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "var(--primary-light)",
          display: "grid", placeItems: "center",
          fontSize: 16, flexShrink: 0, marginRight: 8, alignSelf: "flex-end",
        }}>🌸</div>
      )}
      <div style={{
        maxWidth: "68%",
        padding: "11px 15px",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        background: isUser ? "var(--primary)" : "var(--surface)",
        color: isUser ? "#fff" : "var(--text)",
        fontSize: 14,
        lineHeight: 1.65,
        whiteSpace: "pre-wrap",
        boxShadow: isUser ? "none" : "0 1px 3px rgba(0,0,0,0.07)",
        border: isUser ? "none" : "1px solid var(--border)",
      }}>
        {msg.content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 8 }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: "var(--primary-light)",
        display: "grid", placeItems: "center", fontSize: 16, flexShrink: 0,
      }}>🌸</div>
      <div style={{
        padding: "12px 16px",
        borderRadius: "18px 18px 18px 4px",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        display: "flex", gap: 5, alignItems: "center",
      }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "var(--primary)",
            animation: "bounce 1.2s infinite",
            animationDelay: `${i * 0.2}s`,
          }} />
        ))}
        <style>{`
          @keyframes bounce {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
            30% { transform: translateY(-6px); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}
