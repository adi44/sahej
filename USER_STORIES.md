# User Stories — Sahej

---

## Epic 1: Onboarding

**US-01** — As a new user, I want to sign in with my Google account so that I don't have to remember a password.
- **Acceptance criteria:**
  - "Sign in with Google" button visible on the landing page
  - Clicking it opens Google OAuth in the same tab
  - On success, I am redirected to the chat screen
  - I stay logged in on subsequent visits until I explicitly log out

**US-02** — As a returning user, I want to be taken directly to my chat if I'm already signed in so that I don't have to log in every time.
- **Acceptance criteria:**
  - If a valid Supabase session exists, the app skips the login page
  - The most recent chat session is loaded by default

---

## Epic 2: Getting Investment Advice

**US-03** — As a housewife who saves ₹5,000 a month, I want to ask Sahej where to invest so that my money grows safely.
- **Acceptance criteria:**
  - I can type my question in Hindi or English
  - Sahej responds with 2–3 investment options relevant to my amount
  - Each option includes the current interest rate and minimum investment
  - The reply is in the same language I used

**US-04** — As a user, I want to know the current rate for PPF before I invest so that I make an informed decision.
- **Acceptance criteria:**
  - Sahej fetches live PPF rates via web search (not hardcoded)
  - The response mentions the current quarterly rate and lock-in period
  - If the search fails, Sahej acknowledges it and provides general guidance

**US-05** — As a user saving for my daughter's education (15 years away), I want Sahej to suggest long-term schemes so that I pick the right one.
- **Acceptance criteria:**
  - Sahej identifies the long-term goal and time horizon from my message
  - It recommends long-term instruments (e.g., Sukanya Samriddhi, PPF, ELSS SIP)
  - It does not recommend short-term FDs as the primary option

**US-06** — As a risk-averse user, I want Sahej to recommend government-backed schemes so that my money is safe.
- **Acceptance criteria:**
  - When I express concern about risk, Sahej prioritises government-guaranteed schemes
  - Market-linked products (SIPs, ELSS) are mentioned with a clear risk caveat

**US-07** — As a user, I want to see how much I will earn if I invest ₹3,000/month in SIP for 10 years so that I can plan my savings.
- **Acceptance criteria:**
  - Sahej uses the SIP calculator tool to compute future value
  - The response shows the projected maturity amount at an assumed return rate (e.g., 12%)
  - The assumption is stated clearly (e.g., "assuming 12% annual returns")

---

## Epic 3: Chat Experience

**US-08** — As a user, I want to see a typing indicator while Sahej is thinking so that I know my message was received.
- **Acceptance criteria:**
  - A typing indicator (three bouncing dots) appears immediately after I send a message
  - It disappears when the response arrives

**US-09** — As a user, I want to see suggested questions when I open a new chat so that I know what I can ask.
- **Acceptance criteria:**
  - At least 3 example questions are shown on an empty chat screen
  - Clicking a suggestion pre-fills and sends it

**US-10** — As a user, I want to start a new chat session so that I can ask a fresh question without my old conversation getting mixed in.
- **Acceptance criteria:**
  - A "New chat" button is visible in the sidebar
  - Clicking it opens an empty chat screen
  - The new session is saved with the first message as the title

---

## Epic 4: Chat History

**US-11** — As a returning user, I want to see all my previous conversations in the sidebar so that I can revisit them.
- **Acceptance criteria:**
  - The sidebar lists all past sessions, newest first
  - Each entry shows the session title (first message, truncated)
  - Sessions are loaded from Supabase and scoped to my account only

**US-12** — As a user, I want to click on a past session and continue the conversation so that I don't have to repeat context.
- **Acceptance criteria:**
  - Clicking a session loads its full message history in the main panel
  - I can send a new message and it is appended to the existing session
  - The session is updated in Supabase with the new messages

---

## Epic 5: Trust & Safety

**US-13** — As a user, I want to see a disclaimer that Sahej is a guide, not a licensed advisor, so that I know how to use its advice.
- **Acceptance criteria:**
  - A disclaimer is visible in the chat UI (footer or message header)
  - Text: "Sahej provides general guidance. Consult a certified financial advisor for major decisions."

**US-14** — As a user, I want to log out of Sahej so that my account is secure if I share my device.
- **Acceptance criteria:**
  - A logout option is visible (in the sidebar or profile section)
  - Clicking it ends the Supabase session and redirects to the login page
  - My chat data is not accessible after logout without re-authentication

---

## Epic 6: Admin / Developer

**US-15** — As a developer, I want all API endpoints to require a valid Supabase JWT so that user data is always protected.
- **Acceptance criteria:**
  - Any request without a valid `Authorization: Bearer <token>` header returns 401
  - Row-level security in Supabase ensures users can only read/write their own sessions and messages

**US-16** — As a developer, I want the backend to surface full error tracebacks in development mode so that I can debug quickly.
- **Acceptance criteria:**
  - In development, 500 errors return `{"detail": "...", "traceback": "..."}` in the JSON body
  - In production, tracebacks are never exposed to the client
