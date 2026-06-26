# 🌸 Sahej — Smart Investing for Every Woman

Sahej is an AI-powered financial advisor built for Indian housewives who save regularly but lack access to personalised investment guidance. It combines a multi-agent CrewAI system with a clean chat interface to make investing simple, trustworthy, and accessible.

---

## Features

- **Google SSO** — one-tap sign-in, no passwords
- **AI-powered advice** — multi-agent CrewAI crew (Financial Advisor, Investment Researcher, Savings Coach) answers questions in plain Hindi or English
- **Live investment data** — fetches current rates for PPF, NSC, Sukanya Samriddhi, FDs, SIPs, and government schemes via web search
- **SIP calculator** — projects returns for any monthly investment amount and duration
- **Chat history** — all conversations persisted per user in Supabase
- **Built for India** — understands Indian investment context, government schemes, and household savings patterns

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + TypeScript |
| Backend | FastAPI (Python) |
| AI | CrewAI 1.x + OpenAI GPT-4o-mini |
| Auth | Supabase Auth (Google OAuth) |
| Database | Supabase (PostgreSQL) |
| Search | Serper API (Google Search) |

---

## Project Structure

```
sahej/
├── backend/
│   ├── app/
│   │   ├── api/routes/       # FastAPI routes (chat)
│   │   ├── core/             # Config and settings
│   │   ├── crew/
│   │   │   ├── agents/       # BaseAgent + FinancialAdvisor, Researcher, Coach
│   │   │   ├── tools/        # SIPCalculatorTool, SchemeLookupTool
│   │   │   ├── llm.py        # LLMProvider singleton
│   │   │   └── sahej_crew.py # Crew orchestration
│   │   ├── schemas/          # Pydantic schemas
│   │   └── services/         # Supabase HTTP client
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios client + chat API
│   │   ├── lib/              # Supabase JS client
│   │   └── pages/            # LoginPage, ChatPage
│   └── .env.example
├── supabase_tables.sql       # Run in Supabase SQL editor
├── PRD.md
└── USER_STORIES.md
```

---

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+
- Supabase account
- OpenAI API key
- Serper API key ([serper.dev](https://serper.dev))

### 1. Supabase setup

1. Create a Supabase project
2. Run `supabase_tables.sql` in the SQL editor
3. Enable Google provider: **Authentication → Providers → Google**

### 2. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# Fill in SUPABASE_URL, SUPABASE_ANON_KEY, OPENAI_API_KEY, SERPER_API_KEY

uvicorn app.main:app --reload
```

### 3. Frontend

```bash
cd frontend
npm install

cp .env.example .env
# Fill in VITE_SUPABASE_URL, VITE_SUPABASE_KEY

npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Architecture — CrewAI Agents

```
User message
     │
     ▼
┌─────────────────────┐
│   Savings Coach     │  identifies goals, time horizons, savings capacity
└────────┬────────────┘
         │ context
         ▼
┌─────────────────────┐
│ Investment Researcher│  searches live rates, finds matching schemes + products
└────────┬────────────┘
         │ context
         ▼
┌─────────────────────┐
│  Financial Advisor  │  writes the final warm, actionable reply to the user
└────────┬────────────┘
         │
   Response saved to Supabase → returned to frontend
```

All three agents share a single LLM instance (`LLMProvider` singleton) using OOP polymorphism — each subclasses `BaseAgent` and overrides `role`, `goal`, `backstory`, and `tools`.

---

## Environment Variables

### Backend `.env`

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon/publishable key |
| `OPENAI_API_KEY` | OpenAI API key |
| `SERPER_API_KEY` | Serper API key for live search |
| `CORS_ORIGINS` | JSON array, e.g. `["http://localhost:5173"]` |

### Frontend `.env`

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_KEY` | Supabase anon key |
| `VITE_API_URL` | Backend URL (default: `http://localhost:8000/api`) |
