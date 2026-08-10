-- Run this in the Supabase SQL editor to add the diary feature

create table if not exists public.diary_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  date_key date not null,
  content text not null default '',
  mood text check (mood in ('great', 'good', 'okay', 'low', 'rough')),
  word_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, date_key)
);

alter table public.diary_entries enable row level security;
create policy "own diary_entries" on public.diary_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
