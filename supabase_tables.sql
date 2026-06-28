-- Run this in your Supabase SQL editor

create table chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default 'New Chat',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table chat_sessions enable row level security;
create policy "Users manage own sessions" on chat_sessions for all using (auth.uid() = user_id);

-- Auto-update updated_at on row change
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger chat_sessions_updated_at
before update on chat_sessions
for each row execute function update_updated_at();

-- ─── Financial profiles ────────────────────────────────────────────────────
create table financial_profiles (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid references auth.users(id) on delete cascade not null unique,

  monthly_income        numeric not null,
  income_source         text not null,
  income_is_regular     boolean not null default true,

  rent_or_emi           numeric not null default 0,
  other_emis            numeric not null default 0,
  school_fees           numeric not null default 0,
  groceries_utilities   numeric not null default 0,
  other_expenses        numeric not null default 0,
  monthly_expenses      numeric not null default 0,
  investable_surplus    numeric not null default 0,

  savings_balance       numeric not null default 0,
  existing_investments  text[] not null default '{}',
  has_insurance         boolean not null default false,

  risk_appetite         text not null,
  goals                 jsonb not null default '[]',
  num_children          int not null default 0,
  children_ages         int[] not null default '{}',

  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table financial_profiles enable row level security;
create policy "Users manage own profile" on financial_profiles for all using (auth.uid() = user_id);

create trigger financial_profiles_updated_at
before update on financial_profiles
for each row execute function update_updated_at();

-- ─── Chat messages ─────────────────────────────────────────────────────────
create table chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references chat_sessions(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  agent_metadata jsonb,
  created_at timestamptz default now()
);

alter table chat_messages enable row level security;
create policy "Users manage own messages" on chat_messages for all using (
  session_id in (select id from chat_sessions where user_id = auth.uid())
);
