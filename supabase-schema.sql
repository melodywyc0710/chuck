-- ─────────────────────────────────────────────
-- NAGI APP — Supabase Schema
-- Run this in Supabase SQL Editor
-- ─────────────────────────────────────────────

-- ─── MIGRATION: run these if tables already exist ─
-- alter table public.pets add column if not exists trait_points_available integer not null default 0;
-- alter table public.pets add column if not exists trait_strength integer not null default 0;
-- alter table public.pets add column if not exists trait_intelligence integer not null default 0;
-- alter table public.pets add column if not exists trait_agility integer not null default 0;
-- alter table public.pets add column if not exists trait_speed integer not null default 0;
-- alter table public.promises add column if not exists category text not null default 'general' check (category in ('strength','intelligence','agility','speed','general'));
-- alter table public.profiles add column if not exists subscription_tier text not null default 'free' check (subscription_tier in ('free','plus','pro'));
-- ──────────────────────────────────────────────────

-- Profiles: one per user
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text not null unique,
  subscription_tier text not null default 'free' check (subscription_tier in ('free','plus','pro')),
  created_at timestamptz not null default now()
);

-- Pets: one per user (the creature)
create table public.pets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  name text not null default 'Mochi',
  species text not null default 'melmel',
  color_seed integer not null default 120,
  personality_trait text not null default 'gentle',
  level integer not null default 1,
  xp integer not null default 0,
  xp_to_next integer not null default 100,
  happiness integer not null default 80,
  streak integer not null default 0,
  streak_freeze_count integer not null default 0,
  last_active_date text not null default '',
  costume_slot text,
  unlocked_costumes text[] not null default '{}',
  hatched boolean not null default false,
  trait_points_available integer not null default 0,
  trait_strength integer not null default 0,
  trait_intelligence integer not null default 0,
  trait_agility integer not null default 0,
  trait_speed integer not null default 0,
  created_at timestamptz not null default now()
);

-- Promises: user's recurring goals
create table public.promises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  category text not null default 'general' check (category in ('strength','intelligence','agility','speed','general')),
  frequency text not null default 'daily' check (frequency in ('daily','weekly')),
  verify_method text not null default 'timer' check (verify_method in ('timer','photo','location','friend')),
  timer_duration_mins integer,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Completions: verified proof a promise was kept
create table public.completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  promise_id uuid references public.promises(id) on delete cascade not null,
  date_key text not null,
  proof_type text not null,
  proof_url text,
  verified_by uuid references public.profiles(id) on delete set null,
  completed_at timestamptz not null default now(),
  unique(user_id, promise_id, date_key)
);

-- Friendships
create table public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid references public.profiles(id) on delete cascade not null,
  addressee_id uuid references public.profiles(id) on delete cascade not null,
  status text not null default 'pending' check (status in ('pending','accepted')),
  created_at timestamptz not null default now(),
  unique(requester_id, addressee_id)
);

-- Witness requests: asking a friend to confirm a completion
create table public.witness_requests (
  id uuid primary key default gen_random_uuid(),
  completion_id uuid references public.completions(id) on delete cascade not null,
  requester_id uuid references public.profiles(id) on delete cascade not null,
  witness_id uuid references public.profiles(id) on delete cascade not null,
  status text not null default 'pending' check (status in ('pending','confirmed','denied')),
  created_at timestamptz not null default now()
);

-- ─── Row Level Security ────────────────────────
alter table public.profiles         enable row level security;
alter table public.pets             enable row level security;
alter table public.promises         enable row level security;
alter table public.completions      enable row level security;
alter table public.friendships      enable row level security;
alter table public.witness_requests enable row level security;

-- Profiles: anyone can read (for friends feed), own row to write
create policy "profiles_select" on public.profiles for select using (true);
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- Pets: anyone can read (friends see your pet state), own row to write
create policy "pets_select" on public.pets for select using (true);
create policy "pets_insert" on public.pets for insert with check (auth.uid() = user_id);
create policy "pets_update" on public.pets for update using (auth.uid() = user_id);

-- Promises: own only
create policy "promises_select" on public.promises for select using (auth.uid() = user_id);
create policy "promises_insert" on public.promises for insert with check (auth.uid() = user_id);
create policy "promises_update" on public.promises for update using (auth.uid() = user_id);
create policy "promises_delete" on public.promises for delete using (auth.uid() = user_id);

-- Completions: anyone can read (for witnessing), own to insert
create policy "completions_select" on public.completions for select using (true);
create policy "completions_insert" on public.completions for insert with check (auth.uid() = user_id);

-- Friendships: involved parties only
create policy "friendships_select" on public.friendships for select
  using (auth.uid() = requester_id or auth.uid() = addressee_id);
create policy "friendships_insert" on public.friendships for insert
  with check (auth.uid() = requester_id);
create policy "friendships_update" on public.friendships for update
  using (auth.uid() = addressee_id);

-- Witness requests: involved parties only
create policy "witness_select" on public.witness_requests for select
  using (auth.uid() = requester_id or auth.uid() = witness_id);
create policy "witness_insert" on public.witness_requests for insert
  with check (auth.uid() = requester_id);
create policy "witness_update" on public.witness_requests for update
  using (auth.uid() = witness_id);

-- ─── Storage bucket for proof photos ──────────
insert into storage.buckets (id, name, public)
values ('proofs', 'proofs', false)
on conflict do nothing;

create policy "proof_upload" on storage.objects for insert
  with check (bucket_id = 'proofs' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "proof_read" on storage.objects for select
  using (bucket_id = 'proofs' and auth.uid()::text = (storage.foldername(name))[1]);
