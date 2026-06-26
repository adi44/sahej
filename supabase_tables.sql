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
