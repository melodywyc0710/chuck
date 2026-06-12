-- profiles: one row per user (both teachers and students)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  role text not null check (role in ('teacher', 'student')),
  mascot text not null default 'owl',
  density text not null default 'younger',
  color_theme text not null default 'purple',
  teacher_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- session_results: one row per completed lesson
create table public.session_results (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.profiles(id) on delete cascade not null,
  session_id text not null,
  subject text not null,
  completed_at timestamptz not null,
  score integer not null default 0,
  total integer not null default 0,
  stars_earned integer not null default 0,
  free_responses jsonb not null default '{}',
  homework_set boolean not null default false,
  time_spent_minutes integer not null default 0
);

-- RLS
alter table public.profiles enable row level security;
alter table public.session_results enable row level security;

-- Students see only their own profile; teachers see all profiles they manage
create policy "profiles_select" on public.profiles for select
  using (
    auth.uid() = id
    or exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role = 'teacher'
    )
  );

create policy "profiles_insert" on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles for update
  using (auth.uid() = id);

-- Session results: student sees own, teacher sees all
create policy "results_select" on public.session_results for select
  using (
    auth.uid() = student_id
    or exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role = 'teacher'
    )
  );

create policy "results_insert" on public.session_results for insert
  with check (
    auth.uid() = student_id
    or exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role = 'teacher'
    )
  );
