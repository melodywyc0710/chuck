-- Run in Supabase SQL Editor
-- Purely additive — does not touch any existing tables

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  icon text not null default 'check',
  tracking_type text not null default 'complete'
    check (tracking_type in ('complete','timer','counter','numeric','avoid','journal','checklist','workout')),
  target_value numeric,
  target_unit text,
  frequency text not null default 'daily'
    check (frequency in ('daily','weekdays','weekends','weekly')),
  checklist_items text[] not null default '{}',
  sort_order integer not null default 0,
  archived boolean not null default false,
  category text,
  created_at timestamptz not null default now()
);

alter table public.habits enable row level security;

create policy "own habits" on public.habits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  habit_id uuid references public.habits(id) on delete cascade not null,
  date_key date not null,
  value numeric,
  notes text,
  logged_at timestamptz not null default now(),
  unique (user_id, habit_id, date_key)
);

alter table public.habit_logs enable row level security;

create policy "own habit_logs" on public.habit_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
