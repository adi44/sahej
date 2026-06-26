# PRD — Sahej

**Version:** 0.1 (MVP)
**Date:** June 2026
**Author:** Aditya Dhir

---

## 1. Problem Statement

Indian housewives collectively manage billions of rupees in household savings. They are disciplined savers — but they are severely underserved by the financial industry. Existing investment apps assume prior financial knowledge, use English-heavy interfaces, and are designed for salaried professionals, not homemakers.

The result: savings sit idle in bank accounts or are placed in sub-optimal instruments (cash, gold, chit funds) because there is no trusted, accessible guide to help them invest better.

**Sahej** closes this gap. It is a conversational AI advisor that meets women where they are — in plain language, in their own words, answering the specific questions they have about their savings.

---

## 2. Goals

| Goal | Metric |
|---|---|
| Help users find at least one suitable investment option per session | % sessions with ≥1 recommendation clicked |
| Reduce time-to-first-recommendation to under 2 minutes | P50 session time |
| Support Hindi and English natively | Language detection accuracy |
| Build trust with a credible, warm experience | User retention D7 |

---

## 3. Non-Goals (MVP)

- Direct investment execution (no payment integration in v0.1)
- Portfolio tracking
- Tax filing assistance
- Mobile app (web-first)
- Regional language support beyond Hindi/English

---

## 4. Target Users

**Primary:** Indian housewives, age 25–55, semi-urban and urban
- Manages household budget, makes regular savings (₹2,000–₹20,000/month)
- Low to moderate financial literacy
- Comfortable with WhatsApp; may or may not use banking apps
- Wants to invest but doesn't know where to start or who to trust

**Secondary:** Working women with limited time for financial planning

---

## 5. User Journey (MVP)

```
Land on Sahej → Sign in with Google → Chat screen
     │
     ▼
User types question in Hindi or English
     │
     ▼
Sahej AI (3-agent CrewAI crew) processes:
  1. Understands goals + savings capacity
  2. Researches live investment options
  3. Writes a personalised, friendly reply
     │
     ▼
User receives recommendation with:
  - 2–3 investment options
  - Current interest rates / expected returns
  - Minimum investment amounts
  - One clear next step
     │
     ▼
User can continue the conversation or start a new chat
```

---

## 6. Features

### 6.1 Authentication
- Google SSO via Supabase Auth
- No passwords stored
- Session persisted; user stays logged in across visits

### 6.2 Chat Interface
- Clean, WhatsApp-inspired message bubbles
- Typing indicator while AI processes
- Suggested starter questions on empty state
- Auto-scroll to latest message
- Shift+Enter for multi-line input

### 6.3 Chat History
- All sessions stored per user in Supabase
- Sidebar lists past conversations
- Sessions auto-titled from first message
- Full message history loaded on session click

### 6.4 AI Advisory (CrewAI)
- **Savings Coach Agent** — identifies user's financial situation, goals, time horizons
- **Investment Researcher Agent** — searches live rates for PPF, NSC, Sukanya Samriddhi, FD, RD, Mahila Samman, SIPs, ELSS
- **Financial Advisor Agent** — synthesises both into a warm, personalised, concise reply
- **SIP Calculator Tool** — computes projected maturity for any SIP amount + duration
- **Live Search Tool** — Serper API for real-time scheme rates (no stale data)

### 6.5 Safety & Disclaimer
- Every session footer shows: "Sahej provides general guidance. Always consult a certified financial advisor for major decisions."
- No investment execution — advisory only

---

## 7. Technical Architecture

### Backend
- **FastAPI** — async Python API server
- **CrewAI 1.x** — multi-agent orchestration with async kickoff
- **OpenAI GPT-4o-mini** — LLM powering all agents (via crewai LLM wrapper)
- **Supabase REST API** — database queries via direct HTTP (no ORM)
- **Serper API** — real-time Google search for investment rates

### Frontend
- **React + Vite + TypeScript** — SPA
- **Supabase JS** — auth + session management
- **Axios** — API client with automatic JWT injection
- **React Router** — client-side routing with auth gates

### Data Model (Supabase)
```
auth.users          ← managed by Supabase Auth (Google OAuth)
chat_sessions       ← id, user_id, title, created_at, updated_at
chat_messages       ← id, session_id, role, content, agent_metadata, created_at
```

Row-level security ensures users can only access their own sessions and messages.

---

## 8. Design Principles

1. **Trust first** — warm purple brand, credible tone, no hype
2. **Simplicity** — if a housewife with no financial background can't understand it, rewrite it
3. **Live data** — never show stale investment rates; always search before recommending
4. **Language agnostic** — detect and match the user's language automatically
5. **Advisory only** — no money moves in v0.1; build trust before adding transactions

---

## 9. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| AI gives incorrect financial advice | Disclaimer on every session; recommend consulting a CFP for large decisions |
| Scheme rates change frequently | Live web search on every query; never hardcode rates |
| Users don't trust AI for money | Warm UX, clear sourcing, no hard-sell |
| Slow AI response (3 agents × LLM call) | Collapse to single agent in v0.2; streaming responses |
| OpenAI/Serper API costs at scale | Cache frequent queries; add rate limiting |

---

## 10. Roadmap

| Version | Feature |
|---|---|
| **v0.1 (MVP)** | Google SSO, chat UI, 3-agent crew, SIP calculator, live scheme search, chat history |
| **v0.2** | Single fast agent + streaming responses, Hindi UI labels |
| **v0.3** | Investment calculator screen, comparison table for schemes |
| **v0.4** | Referral links to investment platforms (revenue model) |
| **v1.0** | Mobile app, regional languages (Marathi, Tamil, Bengali) |
