-- Run this in the Supabase SQL editor to add the gym workout feature

-- 1. Add body weight fields to profiles
alter table public.profiles
  add column if not exists body_weight_kg numeric,
  add column if not exists weight_unit text not null default 'kg'
    check (weight_unit in ('kg', 'lbs'));

-- 2. Custom exercises (user-created)
create table if not exists public.custom_exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  category text not null,
  equipment text not null,
  primary_muscle text not null,
  secondary_muscles text[] not null default '{}',
  tracking_type text not null,
  default_met numeric not null default 4.0,
  instructions text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.custom_exercises enable row level security;
create policy "own custom_exercises" on public.custom_exercises
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 3. Workouts (also used for templates via is_template flag)
create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null default 'Workout',
  started_at timestamptz not null,
  ended_at timestamptz,
  duration_seconds integer,
  total_volume numeric,
  estimated_calories_low integer,
  estimated_calories_high integer,
  best_estimate_calories integer,
  calorie_confidence text,
  calorie_method text,
  effort_rating integer,
  notes text,
  linked_promise_id uuid references public.promises(id) on delete set null,
  is_template boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.workouts enable row level security;
create policy "own workouts" on public.workouts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 4. Exercises within a workout
create table if not exists public.workout_exercises (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid references public.workouts(id) on delete cascade not null,
  exercise_slug text,
  custom_exercise_id uuid references public.custom_exercises(id) on delete set null,
  exercise_name text not null,
  tracking_type text not null,
  exercise_order integer not null default 0,
  notes text,
  -- cardio fields
  duration_seconds integer,
  distance numeric,
  distance_unit text default 'km',
  speed numeric,
  incline numeric,
  resistance_level integer,
  average_heart_rate integer,
  maximum_heart_rate integer,
  machine_calories integer,
  estimated_calories integer,
  created_at timestamptz not null default now()
);

alter table public.workout_exercises enable row level security;
create policy "own workout_exercises" on public.workout_exercises
  for all using (
    exists (select 1 from public.workouts w where w.id = workout_id and w.user_id = auth.uid())
  );

-- 5. Sets within a workout exercise
create table if not exists public.workout_sets (
  id uuid primary key default gen_random_uuid(),
  workout_exercise_id uuid references public.workout_exercises(id) on delete cascade not null,
  set_number integer not null,
  set_type text not null default 'working',
  weight numeric,
  weight_unit text default 'kg',
  repetitions integer,
  duration_seconds integer,
  distance numeric,
  rpe integer,
  rir integer,
  rest_seconds integer,
  completed boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.workout_sets enable row level security;
create policy "own workout_sets" on public.workout_sets
  for all using (
    exists (
      select 1 from public.workout_exercises we
      join public.workouts w on w.id = we.workout_id
      where we.id = workout_exercise_id and w.user_id = auth.uid()
    )
  );

-- 6. Workout templates
create table if not exists public.workout_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.workout_templates enable row level security;
create policy "own workout_templates" on public.workout_templates
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 7. Exercises within a template
create table if not exists public.template_exercises (
  id uuid primary key default gen_random_uuid(),
  template_id uuid references public.workout_templates(id) on delete cascade not null,
  exercise_slug text,
  exercise_name text not null,
  exercise_order integer not null default 0,
  default_sets integer not null default 3,
  target_reps integer,
  target_weight numeric,
  rest_seconds integer default 90,
  notes text
);

alter table public.template_exercises enable row level security;
create policy "own template_exercises" on public.template_exercises
  for all using (
    exists (select 1 from public.workout_templates t where t.id = template_id and t.user_id = auth.uid())
  );
