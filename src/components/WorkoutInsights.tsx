import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { BUILT_IN_EXERCISES } from '../lib/exerciseData';
import type { MuscleGroup } from '../lib/workoutTypes';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SetRow {
  weight: number | null;
  repetitions: number | null;
  set_type: string;
  completed: boolean;
}

interface ExerciseRow {
  id: string;
  exercise_slug: string | null;
  exercise_name: string;
  tracking_type: string;
  workout_sets: SetRow[];
}

interface WorkoutRow {
  id: string;
  started_at: string;
  duration_seconds: number | null;
  total_volume: number | null;
  best_estimate_calories: number | null;
  effort_rating: number | null;
  workout_exercises: ExerciseRow[];
}

// ─── Muscle group config ──────────────────────────────────────────────────────

const MUSCLE_META: Record<MuscleGroup, { label: string; color: string }> = {
  chest:      { label: 'Chest',      color: '#FF4D4D' },
  back:       { label: 'Back',       color: '#3B82F6' },
  shoulders:  { label: 'Shoulders',  color: '#F97316' },
  biceps:     { label: 'Biceps',     color: '#F59E0B' },
  triceps:    { label: 'Triceps',    color: '#EC4899' },
  quads:      { label: 'Quads',      color: '#10B981' },
  hamstrings: { label: 'Hamstrings', color: '#06B6D4' },
  glutes:     { label: 'Glutes',     color: '#8B5CF6' },
  calves:     { label: 'Calves',     color: '#84CC16' },
  abs:        { label: 'Abs',        color: '#EAB308' },
  forearms:   { label: 'Forearms',   color: '#78716C' },
  full_body:  { label: 'Full Body',  color: '#6366F1' },
  cardio:     { label: 'Cardio',     color: '#14B8A6' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const slugToMuscle = new Map(BUILT_IN_EXERCISES.map(e => [e.slug, e.primary_muscle]));

function epley1RM(weight: number, reps: number) {
  return weight * (1 + reps / 30);
}

function fmtDuration(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function fmtVol(kg: number) {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)}t`;
  return `${Math.round(kg).toLocaleString()} kg`;
}

function weekKey(dateStr: string) {
  const d = new Date(dateStr);
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

function last8Weeks(): string[] {
  const weeks: string[] = [];
  const now = new Date();
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    weeks.push(weekKey(d.toISOString()));
  }
  return weeks;
}

function workoutStreak(dates: string[]) {
  if (!dates.length) return { current: 0, best: 0 };
  const days = [...new Set(dates.map(d => d.slice(0, 10)))].sort().reverse();
  let current = 1, best = 1, streak = 1;
  const today = new Date().toISOString().slice(0, 10);
  // current streak starts only if most recent day is today or yesterday
  const diffToday = (new Date(today).getTime() - new Date(days[0]).getTime()) / 86400000;
  if (diffToday > 1) current = 0;
  else {
    for (let i = 1; i < days.length; i++) {
      const diff = (new Date(days[i - 1]).getTime() - new Date(days[i]).getTime()) / 86400000;
      if (diff === 1) { streak++; if (i < (diffToday > 0 ? 1 : days.length)) current = streak; }
      else { if (i === 1 && diffToday <= 1) current = 1; break; }
      best = Math.max(best, streak);
    }
    if (current === 1 && diffToday <= 1) current = streak;
    best = Math.max(best, streak);
  }
  return { current: diffToday <= 1 ? streak : 0, best };
}

// ─── Body heatmap SVG ─────────────────────────────────────────────────────────

/**
 * Returns a hex color for a muscle based on its intensity (0–1).
 * 0 = untrained (dark), 1 = fully trained (bright red).
 */
function heatColor(intensity: number, active: boolean): string {
  if (!active || intensity === 0) return '#1c1c1c';
  // interpolate from dim red (#7a1a1a) → bright red (#FF4D4D)
  const r = Math.round(0x7a + (0xff - 0x7a) * intensity);
  const g = Math.round(0x1a + (0x4d - 0x1a) * intensity);
  const b = Math.round(0x1a + (0x4d - 0x1a) * intensity);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function BodyHeatmap({ muscleIntensity }: { muscleIntensity: Map<MuscleGroup, number> }) {
  function c(m: MuscleGroup) {
    const v = muscleIntensity.get(m) ?? 0;
    return heatColor(v, true);
  }
  const allBody = muscleIntensity.get('full_body') ?? 0;
  // If full_body is trained, blend it into all muscles
  function cb(m: MuscleGroup) {
    const v = Math.max(muscleIntensity.get(m) ?? 0, allBody * 0.6);
    return heatColor(v, true);
  }

  return (
    <div className="flex gap-3 justify-center items-end">
      {/* FRONT */}
      <svg viewBox="0 0 100 220" width="120" height="264" xmlns="http://www.w3.org/2000/svg">
        {/* Head */}
        <ellipse cx="50" cy="14" rx="11" ry="13" fill="#222" stroke="#333" strokeWidth="0.8" />
        {/* Neck */}
        <rect x="45" y="25" width="10" height="8" rx="3" fill="#1e1e1e" />
        {/* Torso */}
        <rect x="31" y="32" width="38" height="46" rx="6" fill="#1c1c1c" />
        {/* Chest — two pecs */}
        <ellipse cx="42" cy="44" rx="9" ry="8" fill={cb('chest')} />
        <ellipse cx="58" cy="44" rx="9" ry="8" fill={cb('chest')} />
        {/* Abs — 3 rows */}
        <rect x="42" y="54" width="7" height="5" rx="2" fill={cb('abs')} />
        <rect x="51" y="54" width="7" height="5" rx="2" fill={cb('abs')} />
        <rect x="42" y="61" width="7" height="5" rx="2" fill={cb('abs')} />
        <rect x="51" y="61" width="7" height="5" rx="2" fill={cb('abs')} />
        <rect x="42" y="68" width="7" height="5" rx="2" fill={cb('abs')} />
        <rect x="51" y="68" width="7" height="5" rx="2" fill={cb('abs')} />
        {/* Shoulders */}
        <ellipse cx="27" cy="40" rx="7" ry="7" fill={cb('shoulders')} />
        <ellipse cx="73" cy="40" rx="7" ry="7" fill={cb('shoulders')} />
        {/* Upper arms — biceps */}
        <rect x="18" y="44" width="10" height="22" rx="5" fill={cb('biceps')} />
        <rect x="72" y="44" width="10" height="22" rx="5" fill={cb('biceps')} />
        {/* Forearms */}
        <rect x="15" y="68" width="9" height="20" rx="4" fill={cb('forearms')} />
        <rect x="76" y="68" width="9" height="20" rx="4" fill={cb('forearms')} />
        {/* Hands */}
        <ellipse cx="20" cy="91" rx="5" ry="4" fill="#1e1e1e" />
        <ellipse cx="80" cy="91" rx="5" ry="4" fill="#1e1e1e" />
        {/* Hips */}
        <rect x="31" y="77" width="38" height="14" rx="5" fill="#1c1c1c" />
        {/* Quads */}
        <rect x="32" y="90" width="16" height="36" rx="7" fill={cb('quads')} />
        <rect x="52" y="90" width="16" height="36" rx="7" fill={cb('quads')} />
        {/* Knees */}
        <ellipse cx="40" cy="129" rx="8" ry="5" fill="#1e1e1e" />
        <ellipse cx="60" cy="129" rx="8" ry="5" fill="#1e1e1e" />
        {/* Calves front */}
        <rect x="33" y="133" width="13" height="30" rx="6" fill={cb('calves')} />
        <rect x="53" y="133" width="13" height="30" rx="6" fill={cb('calves')} />
        {/* Feet */}
        <ellipse cx="40" cy="166" rx="7" ry="4" fill="#1e1e1e" />
        <ellipse cx="60" cy="166" rx="7" ry="4" fill="#1e1e1e" />
      </svg>

      {/* BACK */}
      <svg viewBox="0 0 100 220" width="120" height="264" xmlns="http://www.w3.org/2000/svg">
        {/* Head */}
        <ellipse cx="50" cy="14" rx="11" ry="13" fill="#222" stroke="#333" strokeWidth="0.8" />
        {/* Neck */}
        <rect x="45" y="25" width="10" height="8" rx="3" fill="#1e1e1e" />
        {/* Torso back */}
        <rect x="31" y="32" width="38" height="46" rx="6" fill="#1c1c1c" />
        {/* Traps */}
        <ellipse cx="40" cy="36" rx="8" ry="5" fill={cb('back')} />
        <ellipse cx="60" cy="36" rx="8" ry="5" fill={cb('back')} />
        {/* Lats */}
        <ellipse cx="36" cy="54" rx="6" ry="14" fill={cb('back')} />
        <ellipse cx="64" cy="54" rx="6" ry="14" fill={cb('back')} />
        {/* Lower back */}
        <rect x="39" y="64" width="22" height="12" rx="4" fill={cb('back')} />
        {/* Shoulders back */}
        <ellipse cx="27" cy="40" rx="7" ry="7" fill={cb('shoulders')} />
        <ellipse cx="73" cy="40" rx="7" ry="7" fill={cb('shoulders')} />
        {/* Upper arms — triceps */}
        <rect x="18" y="44" width="10" height="22" rx="5" fill={cb('triceps')} />
        <rect x="72" y="44" width="10" height="22" rx="5" fill={cb('triceps')} />
        {/* Forearms back */}
        <rect x="15" y="68" width="9" height="20" rx="4" fill={cb('forearms')} />
        <rect x="76" y="68" width="9" height="20" rx="4" fill={cb('forearms')} />
        {/* Hands */}
        <ellipse cx="20" cy="91" rx="5" ry="4" fill="#1e1e1e" />
        <ellipse cx="80" cy="91" rx="5" ry="4" fill="#1e1e1e" />
        {/* Hips / glutes */}
        <rect x="31" y="77" width="38" height="16" rx="5" fill={cb('glutes')} />
        {/* Glute detail */}
        <ellipse cx="41" cy="88" rx="9" ry="7" fill={cb('glutes')} />
        <ellipse cx="59" cy="88" rx="9" ry="7" fill={cb('glutes')} />
        {/* Hamstrings */}
        <rect x="32" y="90" width="16" height="36" rx="7" fill={cb('hamstrings')} />
        <rect x="52" y="90" width="16" height="36" rx="7" fill={cb('hamstrings')} />
        {/* Knees back */}
        <ellipse cx="40" cy="129" rx="8" ry="5" fill="#1e1e1e" />
        <ellipse cx="60" cy="129" rx="8" ry="5" fill="#1e1e1e" />
        {/* Calves back */}
        <rect x="33" y="133" width="13" height="30" rx="6" fill={cb('calves')} />
        <rect x="53" y="133" width="13" height="30" rx="6" fill={cb('calves')} />
        {/* Feet */}
        <ellipse cx="40" cy="166" rx="7" ry="4" fill="#1e1e1e" />
        <ellipse cx="60" cy="166" rx="7" ry="4" fill="#1e1e1e" />
      </svg>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function WorkoutInsights() {
  const user = useAuthStore(s => s.user);
  const [workouts, setWorkouts] = useState<WorkoutRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('workouts')
      .select(`id, started_at, duration_seconds, total_volume, best_estimate_calories, effort_rating,
        workout_exercises ( id, exercise_slug, exercise_name, tracking_type,
          workout_sets ( weight, repetitions, set_type, completed ) )`)
      .eq('user_id', user.id)
      .order('started_at', { ascending: false })
      .then(({ data }) => {
        if (data) setWorkouts(data as WorkoutRow[]);
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-4 h-4 rounded-full border-2 border-white/15 border-t-white/50 animate-spin" />
      </div>
    );
  }

  if (!workouts.length) {
    return (
      <div className="flex flex-col items-center py-16 gap-3">
        <p className="text-white/30 text-sm">No workouts logged yet.</p>
        <p className="text-white/20 text-xs text-center">Complete a workout to see insights.</p>
      </div>
    );
  }

  // ── Date ranges ────────────────────────────────────────────────────────────
  const now = new Date();
  const d30 = new Date(now); d30.setDate(d30.getDate() - 30);
  const d90 = new Date(now); d90.setDate(d90.getDate() - 90);
  const recent = workouts.filter(w => new Date(w.started_at) >= d30);

  // ── Overview stats (last 30 days) ──────────────────────────────────────────
  const totalWorkouts = recent.length;
  const totalVolume = recent.reduce((s, w) => s + (w.total_volume ?? 0), 0);
  const totalDuration = recent.reduce((s, w) => s + (w.duration_seconds ?? 0), 0);
  const totalCals = recent.reduce((s, w) => s + (w.best_estimate_calories ?? 0), 0);
  const avgEffort = recent.filter(w => w.effort_rating).length
    ? recent.reduce((s, w) => s + (w.effort_rating ?? 0), 0) / recent.filter(w => w.effort_rating).length
    : 0;

  // ── Muscle breakdown (last 30 days) ────────────────────────────────────────
  const muscleSetCounts = new Map<MuscleGroup, number>();
  const muscleVolume = new Map<MuscleGroup, number>();

  for (const w of recent) {
    for (const ex of w.workout_exercises) {
      const muscle = (ex.exercise_slug ? slugToMuscle.get(ex.exercise_slug) : null) ?? null;
      if (!muscle) continue;
      const completedSets = ex.workout_sets.filter(s => s.completed && s.set_type !== 'warmup');
      const vol = completedSets.reduce((s, st) => s + (st.weight ?? 0) * (st.repetitions ?? 0), 0);
      muscleSetCounts.set(muscle, (muscleSetCounts.get(muscle) ?? 0) + completedSets.length);
      muscleVolume.set(muscle, (muscleVolume.get(muscle) ?? 0) + vol);
    }
  }

  const muscleEntries = [...muscleSetCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .filter(([, sets]) => sets > 0);
  const maxMuscleSets = muscleEntries[0]?.[1] ?? 1;

  // Normalized 0–1 intensity per muscle for heatmap
  const muscleIntensity = new Map<MuscleGroup, number>(
    [...muscleSetCounts.entries()].map(([m, sets]) => [m, sets / maxMuscleSets])
  );

  // ── Personal records (all time) ────────────────────────────────────────────
  // Best 1RM per exercise slug (weight_reps only)
  const prMap = new Map<string, { name: string; weight: number; reps: number; oneRM: number; date: string }>();

  for (const w of workouts) {
    for (const ex of w.workout_exercises) {
      if (ex.tracking_type !== 'weight_reps') continue;
      const key = ex.exercise_slug ?? ex.exercise_name;
      for (const s of ex.workout_sets) {
        if (!s.completed || !s.weight || !s.repetitions || s.set_type === 'warmup') continue;
        const oneRM = epley1RM(s.weight, s.repetitions);
        const existing = prMap.get(key);
        if (!existing || oneRM > existing.oneRM) {
          prMap.set(key, { name: ex.exercise_name, weight: s.weight, reps: s.repetitions, oneRM, date: w.started_at });
        }
      }
    }
  }

  const prs = [...prMap.values()].sort((a, b) => b.oneRM - a.oneRM).slice(0, 8);

  // ── Weekly frequency (last 8 weeks) ───────────────────────────────────────
  const weeks = last8Weeks();
  const weekCounts = new Map(weeks.map(w => [w, 0]));
  for (const w of workouts) {
    const wk = weekKey(w.started_at);
    if (weekCounts.has(wk)) weekCounts.set(wk, (weekCounts.get(wk) ?? 0) + 1);
  }
  const weekValues = weeks.map(w => weekCounts.get(w) ?? 0);
  const maxWeekVal = Math.max(...weekValues, 1);
  const { current: currentStreak, best: bestStreak } = workoutStreak(workouts.map(w => w.started_at));

  // ── Top exercises by total sets (90 days) ─────────────────────────────────
  const exStats = new Map<string, { name: string; sessions: number; sets: number; maxWeight: number }>();
  const w90 = workouts.filter(w => new Date(w.started_at) >= d90);
  for (const w of w90) {
    for (const ex of w.workout_exercises) {
      const key = ex.exercise_slug ?? ex.exercise_name;
      const completedSets = ex.workout_sets.filter(s => s.completed);
      const maxW = Math.max(0, ...completedSets.map(s => s.weight ?? 0));
      const prev = exStats.get(key);
      if (prev) {
        prev.sessions++;
        prev.sets += completedSets.length;
        prev.maxWeight = Math.max(prev.maxWeight, maxW);
      } else {
        exStats.set(key, { name: ex.exercise_name, sessions: 1, sets: completedSets.length, maxWeight: maxW });
      }
    }
  }
  const topExercises = [...exStats.values()].sort((a, b) => b.sets - a.sets).slice(0, 6);

  // ── Render ─────────────────────────────────────────────────────────────────

  const card = { background: '#141414', border: '1px solid #242424', borderRadius: 20 };

  return (
    <div className="space-y-5">

      {/* ── Overview ── */}
      <div>
        <p className="text-white/30 text-[10px] uppercase tracking-widest mb-3">Last 30 days</p>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: 'Workouts',  value: totalWorkouts.toString() },
            { label: 'Volume',    value: totalVolume > 0 ? fmtVol(totalVolume) : '—' },
            { label: 'Time',      value: totalDuration > 0 ? fmtDuration(totalDuration) : '—' },
            { label: 'Calories',  value: totalCals > 0 ? `${Math.round(totalCals).toLocaleString()} kcal` : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="px-4 py-3" style={card}>
              <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">{label}</p>
              <p className="text-white text-xl font-semibold" style={{ letterSpacing: '-0.03em' }}>{value}</p>
            </div>
          ))}
        </div>
        {avgEffort > 0 && (
          <div className="mt-2.5 px-4 py-3 flex items-center gap-3" style={card}>
            <div>
              <p className="text-white/30 text-[10px] uppercase tracking-widest mb-0.5">Avg Effort</p>
              <p className="text-white text-lg font-semibold">{avgEffort.toFixed(1)} <span className="text-white/30 text-xs font-normal">/ 10</span></p>
            </div>
            <div className="flex-1 h-2 rounded-full overflow-hidden ml-2" style={{ background: '#242424' }}>
              <div className="h-full rounded-full" style={{ width: `${(avgEffort / 10) * 100}%`, background: '#FF4D4D' }} />
            </div>
          </div>
        )}
      </div>

      {/* ── Body heatmap ── */}
      {muscleEntries.length > 0 && (
        <div>
          <p className="text-white/30 text-[10px] uppercase tracking-widest mb-3">Muscle Heatmap · 30 days</p>
          <div className="px-4 py-5" style={card}>
            <BodyHeatmap muscleIntensity={muscleIntensity} />
            {/* Legend */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ background: '#1c1c1c', border: '1px solid #2a2a2a' }} />
                <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Untrained</span>
              </div>
              <div className="flex items-center gap-0.5">
                {[0.2, 0.4, 0.6, 0.8, 1].map(v => (
                  <div key={v} className="w-4 h-3 rounded-sm" style={{ background: heatColor(v, true) }} />
                ))}
              </div>
              <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>High</span>
            </div>
            <p className="text-white/20 text-[10px] text-center mt-2">Front · Back</p>
          </div>
        </div>
      )}

      {/* ── Muscle groups ── */}
      {muscleEntries.length > 0 && (
        <div>
          <p className="text-white/30 text-[10px] uppercase tracking-widest mb-3">Muscle Groups · 30 days</p>
          <div className="px-4 py-4 space-y-3" style={card}>
            {muscleEntries.map(([muscle, sets]) => {
              const meta = MUSCLE_META[muscle];
              const vol = muscleVolume.get(muscle) ?? 0;
              return (
                <div key={muscle}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/70 text-xs font-medium">{meta.label}</span>
                    <span className="text-white/35 text-[11px] tabular-nums">
                      {sets} sets{vol > 0 ? `  ·  ${fmtVol(vol)}` : ''}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#242424' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(sets / maxMuscleSets) * 100}%`, background: meta.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Weekly frequency ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-white/30 text-[10px] uppercase tracking-widest">Weekly Frequency</p>
          <div className="flex gap-3 text-[10px]">
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>Best <span className="text-white/60 font-semibold">{bestStreak}d</span></span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>Streak <span className="text-white/60 font-semibold">{currentStreak}d</span></span>
          </div>
        </div>
        <div className="px-4 pt-4 pb-3" style={card}>
          <div className="flex items-end gap-1.5 h-16">
            {weekValues.map((count, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1">
                <div
                  className="w-full rounded-md transition-all"
                  style={{
                    height: count > 0 ? `${Math.max(16, (count / maxWeekVal) * 56)}px` : 4,
                    background: count > 0 ? '#FF4D4D' : '#242424',
                    opacity: i === weekValues.length - 1 ? 1 : 0.5 + (i / weekValues.length) * 0.5,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-1.5 mt-1.5">
            {weekValues.map((count, i) => (
              <div key={i} className="flex-1 text-center">
                <span className="text-[9px] tabular-nums" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  {count > 0 ? count : ''}
                </span>
              </div>
            ))}
          </div>
          <p className="text-white/20 text-[10px] text-right mt-1">← 8 weeks</p>
        </div>
      </div>

      {/* ── Personal records ── */}
      {prs.length > 0 && (
        <div>
          <p className="text-white/30 text-[10px] uppercase tracking-widest mb-3">Personal Records</p>
          <div className="space-y-2">
            {prs.map((pr, i) => (
              <div key={i} className="px-4 py-3 flex items-center gap-3" style={card}>
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold"
                  style={{ background: i === 0 ? '#7C3AED' : i === 1 ? '#0891B2' : '#374151', color: 'white' }}
                >
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-sm font-medium truncate">{pr.name}</p>
                  <p className="text-white/35 text-[11px]">
                    {pr.weight} kg × {pr.reps} reps
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-white/70 text-sm font-semibold tabular-nums">{Math.round(pr.oneRM)} kg</p>
                  <p className="text-white/25 text-[10px]">est. 1RM</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Top exercises ── */}
      {topExercises.length > 0 && (
        <div>
          <p className="text-white/30 text-[10px] uppercase tracking-widest mb-3">Top Exercises · 90 days</p>
          <div className="px-4 py-2" style={card}>
            {topExercises.map((ex, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-2.5"
                style={{ borderBottom: i < topExercises.length - 1 ? '1px solid #242424' : 'none' }}
              >
                <span className="text-white/20 text-xs tabular-nums w-4 text-right shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white/75 text-sm font-medium truncate">{ex.name}</p>
                  <p className="text-white/30 text-[11px]">
                    {ex.sessions} session{ex.sessions !== 1 ? 's' : ''} · {ex.sets} sets
                  </p>
                </div>
                {ex.maxWeight > 0 && (
                  <p className="text-white/50 text-sm font-semibold tabular-nums shrink-0">{ex.maxWeight} kg</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="h-4" />
    </div>
  );
}
