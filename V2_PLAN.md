# Sahej v2 — Product Plan

**Theme:** From generic advisor → personal financial coach  
**Core shift:** Sahej knows who you are before you even ask a question.

---

## Hero Feature — Financial Profile

### The Problem
Right now Sahej gives solid generic advice. But it doesn't know:
- How much the user earns (or if she earns at all)
- What her fixed monthly commitments are
- How much she can actually invest each month
- How much risk she can stomach
- What she is saving towards

The result: advice like "invest ₹5,000/month in SIP" that may be completely wrong for someone whose entire household runs on ₹18,000/month.

### The Fix
A guided 5-step financial profile that takes 3 minutes to complete. Once done, **every chat session, every calculator result, every recommendation is personalised to her actual situation.**

---

## Profile Wizard — 5 Steps

### Step 1 · Income
> "Let's start with what comes in each month"

| Field | Type | Notes |
|---|---|---|
| Monthly household income | Number (₹) | Can be husband's income if homemaker |
| Income source | Single select | Salary / Business / Both / My husband earns |
| Is income regular? | Toggle | Irregular income → more conservative advice |

---

### Step 2 · Monthly Expenses
> "Now tell us what goes out"

| Field | Type | Notes |
|---|---|---|
| Rent or home loan EMI | Number (₹) | Largest fixed cost |
| Children's school fees | Number (₹) | Monthly equivalent |
| Groceries & utilities | Number (₹) | Food, electricity, phone, gas |
| Other fixed expenses | Number (₹) | Subscriptions, domestic help, etc. |

Sahej auto-computes: **Investable Surplus = Income − Total Expenses**  
Shown live as the user fills in fields.

---

### Step 3 · What You Already Have
> "Any savings or investments already?"

| Field | Type | Notes |
|---|---|---|
| Money in savings account | Number (₹) | Emergency buffer check |
| Existing investments | Multi-select | PPF / NSC / FD / Gold / Mutual Funds / None |
| Life / health insurance | Toggle | Affects advice priorities |

---

### Step 4 · Risk Comfort
> "How do you feel about your money?"

Three clear options (no jargon):

- 🟢 **I want it completely safe** — government schemes only, no market exposure
- 🟡 **Some risk is okay** — mix of safe + a little market
- 🔴 **I want my money to grow fast** — fine with ups and downs for higher returns

---

### Step 5 · Your Goals
> "What are you saving for?"

Multi-select cards with time horizon:

| Goal | Icon | Default horizon |
|---|---|---|
| Emergency fund | 🏥 | Immediate |
| Children's education | 📚 | 5–15 years |
| Children's marriage | 💍 | 10–20 years |
| Retirement | 🌅 | 20–30 years |
| Own home / land | 🏠 | 5–10 years |
| Medical expenses | 💊 | Ongoing |

For each selected goal: "When do you need this by?" (year picker)

---

### After Completing the Profile

User sees a **Financial Summary Card**:

```
Your snapshot

Monthly income     ₹38,000
Monthly expenses   ₹24,500
──────────────────────────
You can invest     ₹13,500 / month

Risk comfort       Moderate
Goals              Children's education · Emergency fund
Kids               2 children (ages 5 & 8)
Existing savings   PPF, some FD
```

Below the card: **"Talk to Sahej →"** — opens chat with the profile pre-loaded as context.

---

## How Profile Changes the AI

Today, the Savings Coach agent gets: `user_message + chat_history`

In v2, it gets:

```
FINANCIAL PROFILE:
  Monthly income: ₹38,000 (salary, regular)
  Monthly expenses: ₹24,500
  Investable surplus: ₹13,500
  Risk appetite: moderate
  Goals: children's education (needs ₹8L in 8 years), emergency fund
  Existing: PPF account active, 2 FDs
  Children: ages 5 and 8 — Sukanya Samriddhi Yojana eligible

USER MESSAGE:
  Where should I put ₹10,000 extra this month?
```

Now the response becomes:
> "Since you already have PPF, let's top that up first — it's tax-free and your daughter aged 8 still qualifies for Sukanya Samriddhi which gives 8.2%. For the remaining ₹2,000, a liquid fund for your emergency corpus makes sense…"

That is the difference between an app and a personal coach.

---

## Feature 2 — Streaming AI Responses

**Problem:** 3 sequential CrewAI agents take 30–60 seconds. Users drop off.

**Solution:** Single smart agent + token streaming so response appears word-by-word.

- Backend: FastAPI `StreamingResponse` + OpenAI `stream=True`
- Frontend: `EventSource` / `fetch` with `ReadableStream` — text types out live
- Perceived speed: near-instant, even if total LLM time is 12–15s

---

## Feature 3 — Investment Plan Generator

After the profile is set, user can tap **"Make my investment plan"**.  
Sahej generates a written, month-by-month plan:

```
Your Sahej Investment Plan
──────────────────────────
Surplus: ₹13,500 / month

Allocation:
  PPF top-up       ₹4,000   (tax saving + guaranteed returns)
  Sukanya SSY      ₹3,000   (daughter's education, 8.2% p.a.)
  Emergency SIP    ₹2,500   (liquid fund, target ₹1L in 12 months)
  Growth SIP       ₹4,000   (ELSS, 10-year horizon for retirement)

After 10 years at these rates, projected corpus: ₹38.4 lakh
```

- Saved to the user's account
- Can be revised ("add ₹2,000 more to retirement")
- Downloadable / shareable

---

## Feature 4 — Goal Progress Tracker

User marks progress: "I started the SSY account" / "I missed this month's SIP."  
Sahej recalculates and adjusts the plan accordingly.

---

## Feature 5 — Notifications (PWA)

- Monthly nudge: "Time to top up your PPF — deadline is March 31"
- Goal milestone: "You're 40% of the way to your education fund 🎉"
- Rate change alert: "PPF rate changed to 7.1% this quarter"

---

## Build Order for v2

| Sprint | Feature | Outcome |
|---|---|---|
| 1 | Financial profile wizard (5 steps) | Users can build a profile |
| 2 | Profile → chat context injection | Personalised advice unlocked |
| 3 | Streaming AI responses | Fast, modern feel |
| 4 | Investment plan generator | Shareable output |
| 5 | Goal tracker | Retention loop |
| 6 | PWA + push notifications | Re-engagement |

---

## New DB Tables

```sql
-- One profile per user, updated as life changes
create table financial_profiles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null unique,

  -- Step 1: Income
  monthly_income       numeric,
  income_source        text,   -- 'salary' | 'business' | 'both' | 'spouse'
  income_is_regular    boolean default true,

  -- Step 2: Expenses
  rent_or_emi          numeric default 0,
  school_fees          numeric default 0,
  groceries_utilities  numeric default 0,
  other_expenses       numeric default 0,

  -- Computed
  monthly_expenses     numeric,   -- sum of above
  investable_surplus   numeric,   -- income - expenses

  -- Step 3: Existing assets
  savings_balance      numeric default 0,
  existing_investments text[],    -- ['ppf','fd','gold',...]
  has_insurance        boolean default false,

  -- Step 4: Risk
  risk_appetite        text,   -- 'conservative' | 'moderate' | 'aggressive'

  -- Step 5: Goals
  goals                jsonb,  -- [{type:'education', target_year:2031}, ...]

  -- Family (collected in step 5)
  num_children         int default 0,
  children_ages        int[],   -- [5, 8] — for scheme eligibility checks

  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Saved investment plans
create table investment_plans (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  profile_id  uuid references financial_profiles,
  content     text not null,    -- full plan text
  allocations jsonb,            -- [{scheme, monthly_amount, years, projected}]
  created_at  timestamptz default now()
);
```

---

## New Routes

```
POST  /api/profile          — create / update financial profile
GET   /api/profile          — fetch current user's profile
POST  /api/plans/generate   — generate investment plan from profile
GET   /api/plans            — list user's saved plans
```

---

## New Pages

```
/profile          — 5-step wizard (or edit existing profile)
/plan             — view / download the generated investment plan
```
