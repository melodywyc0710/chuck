import { useEffect, useState } from 'react';
import { Clock, Dumbbell, Flame, ChevronRight, ChevronDown, RefreshCw, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import type { WorkoutWithDetails } from '../lib/workoutTypes';
import { formatDuration, formatVolume } from '../lib/workoutCalc';
import { useWorkoutStore } from '../store/workoutStore';
import { BUILT_IN_EXERCISES } from '../lib/exerciseData';

interface Props {
  onRepeat?: () => void;
}

// Monday of the week containing `date`
function weekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  return d.toISOString().slice(0, 10);
}

// "YYYY-MM" month key
function monthKey(date: Date): string {
  return date.toISOString().slice(0, 7);
}

function shortLabel(key: string, mode: 'week' | 'month'): string {
  if (mode === 'month') {
    const [y, m] = key.split('-');
    return new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleDateString('en-US', { month: 'short' });
  }
  // key is YYYY-MM-DD (Monday)
  const d = new Date(key + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function buildBuckets(workouts: WorkoutWithDetails[], mode: 'week' | 'month') {
  const count = mode === 'week' ? 8 : 6;
  const now = new Date();
  const keys: string[] = [];

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now);
    if (mode === 'week') {
      d.setDate(d.getDate() - i * 7);
      keys.push(weekStart(d));
    } else {
      d.setMonth(d.getMonth() - i);
      keys.push(monthKey(d));
    }
  }

  const volumeMap: Record<string, number> = {};
  for (const k of keys) volumeMap[k] = 0;

  for (const w of workouts) {
    const d = new Date(w.started_at);
    const k = mode === 'week' ? weekStart(d) : monthKey(d);
    if (k in volumeMap) volumeMap[k] += w.total_volume ?? 0;
  }

  const currentKey = mode === 'week' ? weekStart(now) : monthKey(now);
  return keys.map(k => ({ key: k, volume: volumeMap[k], isCurrent: k === currentKey }));
}

// Returns Set of "workoutId:exerciseSlug" strings that are PRs
function buildPRSet(workouts: WorkoutWithDetails[]): Set<string> {
  const prs = new Set<string>();
  const best: Record<string, number> = {};
  // Process oldest first
  const sorted = [...workouts].sort((a, b) =>
    new Date(a.started_at).getTime() - new Date(b.started_at).getTime()
  );
  for (const w of sorted) {
    for (const we of w.workout_exercises) {
      const slug = we.exercise_slug;
      if (!slug) continue;
      const completedSets = we.workout_sets.filter(s => s.completed && s.weight != null);
      if (completedSets.length === 0) continue;
      const maxW = Math.max(...completedSets.map(s => s.weight ?? 0));
      if (maxW > 0 && maxW > (best[slug] ?? 0)) {
        best[slug] = maxW;
        prs.add(`${w.id}:${slug}`);
      }
    }
  }
  return prs;
}

function VolumeChart({ workouts }: { workouts: WorkoutWithDetails[] }) {
  const [mode, setMode] = useState<'week' | 'month'>('week');
  const buckets = buildBuckets(workouts, mode);
  const maxVol = Math.max(...buckets.map(b => b.volume), 1);

  const W = 300, H = 72, barW = mode === 'week' ? 26 : 32, gap = mode === 'week' ? 8 : 10;
  const totalW = buckets.length * (barW + gap) - gap;
  const offsetX = (W - totalW) / 2;

  return (
    <div className="rounded-[20px] px-4 py-4" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-white/40 text-[10px] uppercase tracking-widest">Training Volume</p>
        <div className="flex gap-1">
          {(['week', 'month'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors"
              style={mode === m
                ? { background: '#FF4D4D', color: '#fff' }
                : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' }}
            >
              {m === 'week' ? '8W' : '6M'}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H + 20}`} width="100%" style={{ overflow: 'visible' }}>
        {buckets.map((b, i) => {
          const x = offsetX + i * (barW + gap);
          const barH = b.volume > 0 ? Math.max(4, (b.volume / maxVol) * H) : 2;
          const y = H - barH;
          return (
            <g key={b.key}>
              {/* Background track */}
              <rect x={x} y={0} width={barW} height={H} rx={6}
                fill="rgba(255,255,255,0.04)" />
              {/* Volume bar */}
              <rect x={x} y={y} width={barW} height={barH} rx={6}
                fill={b.isCurrent ? '#FF4D4D' : b.volume > 0 ? 'rgba(255,255,255,0.2)' : 'transparent'} />
              {/* Label */}
              <text
                x={x + barW / 2} y={H + 14}
                textAnchor="middle"
                fontSize={8}
                fill={b.isCurrent ? 'rgba(255,77,77,0.8)' : 'rgba(255,255,255,0.2)'}
                fontFamily="-apple-system, sans-serif"
              >
                {shortLabel(b.key, mode)}
              </text>
            </g>
          );
        })}
      </svg>

      <p className="text-white/20 text-[10px] mt-1">
        {mode === 'week' ? 'Last 8 weeks' : 'Last 6 months'} · {formatVolume(buckets.reduce((s, b) => s + b.volume, 0))} total
      </p>
    </div>
  );
}

export default function WorkoutHistory({ onRepeat }: Props) {
  const user = useAuthStore(s => s.user);
  const addExercise = useWorkoutStore(s => s.addExercise);
  const startWorkout = useWorkoutStore(s => s.startWorkout);
  const [workouts, setWorkouts] = useState<WorkoutWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('workouts')
      .select(`*, workout_exercises(*, workout_sets(*))`)
      .eq('user_id', user.id)
      .eq('is_template', false)
      .order('created_at', { ascending: false })
      .limit(50);
    if (data) setWorkouts(data as WorkoutWithDetails[]);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    await supabase.from('workouts').delete().eq('id', id);
    setWorkouts(prev => prev.filter(w => w.id !== id));
    setConfirmDelete(null);
  }

  function handleRepeat(w: WorkoutWithDetails) {
    if (!onRepeat) return;
    startWorkout(w.name);
    for (const we of w.workout_exercises.sort((a, b) => a.exercise_order - b.exercise_order)) {
      const ex = we.exercise_slug ? BUILT_IN_EXERCISES.find(e => e.slug === we.exercise_slug) : null;
      if (ex) addExercise(ex);
    }
    onRepeat();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="text-center py-16 px-6">
        <p className="text-white/25 text-sm">No workouts yet</p>
        <p className="text-white/15 text-xs mt-1">Completed workouts will appear here</p>
      </div>
    );
  }

  const prSet = buildPRSet(workouts);

  return (
    <div className="space-y-3">
      <VolumeChart workouts={workouts} />

      {workouts.map(w => {
        const isExpanded = expanded === w.id;
        const exCount = w.workout_exercises.length;
        const durationSecs = w.duration_seconds ?? 0;

        return (
          <div
            key={w.id}
            className="rounded-[20px] overflow-hidden"
            style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <button
              className="w-full flex items-center gap-3 px-4 py-4 text-left"
              onClick={() => { setExpanded(isExpanded ? null : w.id); setConfirmDelete(null); }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-white/85 text-sm font-semibold truncate">{w.name}</p>
                <p className="text-white/30 text-[10px] mt-0.5">
                  {new Date(w.started_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {durationSecs > 0 && (
                  <span className="flex items-center gap-1 text-white/35 text-xs">
                    <Clock size={10} />
                    {formatDuration(durationSecs)}
                  </span>
                )}
                {exCount > 0 && (
                  <span className="flex items-center gap-1 text-white/35 text-xs">
                    <Dumbbell size={10} />
                    {exCount}
                  </span>
                )}
                {w.best_estimate_calories && (
                  <span className="flex items-center gap-1 text-white/35 text-xs">
                    <Flame size={10} />
                    {w.best_estimate_calories}
                  </span>
                )}
                {isExpanded ? <ChevronDown size={14} className="text-white/25" /> : <ChevronRight size={14} className="text-white/25" />}
              </div>
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 space-y-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex gap-3 pt-3">
                  {w.total_volume != null && w.total_volume > 0 && (
                    <Stat label="Volume" value={formatVolume(w.total_volume)} />
                  )}
                  {w.effort_rating && <Stat label="Effort" value={`${w.effort_rating}/10`} />}
                  {w.best_estimate_calories && <Stat label="~Calories" value={`${w.best_estimate_calories} kcal`} />}
                </div>

                <div className="space-y-1.5">
                  {w.workout_exercises
                    .sort((a, b) => a.exercise_order - b.exercise_order)
                    .map(we => {
                      const completedSets = we.workout_sets.filter(s => s.completed);
                      const totalReps = completedSets.reduce((s, set) => s + (set.repetitions ?? 0), 0);
                      const maxWeight = Math.max(0, ...completedSets.map(s => s.weight ?? 0));
                      const isPR = we.exercise_slug ? prSet.has(`${w.id}:${we.exercise_slug}`) : false;
                      return (
                        <div key={we.id} className="flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                          <p className="text-white/70 text-xs">{we.exercise_name}</p>
                          <div className="flex items-center gap-1.5">
                            {isPR && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(255,77,77,0.15)', color: '#FF4D4D' }}>
                                PB
                              </span>
                            )}
                            <p className="text-white/30 text-[10px]">
                              {completedSets.length > 0 && `${completedSets.length} sets`}
                              {totalReps > 0 && ` · ${totalReps} reps`}
                              {maxWeight > 0 && ` · ${maxWeight}${we.workout_sets[0]?.weight_unit ?? 'kg'} max`}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>

                <div className="flex gap-2">
                  {onRepeat && (
                    <button
                      onClick={() => handleRepeat(w)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm text-white/50 hover:text-white/80 transition-colors"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <RefreshCw size={13} />
                      Repeat
                    </button>
                  )}
                  <button
                    onClick={() => setConfirmDelete(confirmDelete === w.id ? null : w.id)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl text-xs text-white/30 hover:text-red-400 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                {confirmDelete === w.id && (
                  <div className="px-3 py-2.5 rounded-xl flex items-center justify-between gap-3" style={{ background: 'rgba(255,77,77,0.08)', border: '1px solid rgba(255,77,77,0.2)' }}>
                    <p className="text-white/50 text-xs">Delete this workout?</p>
                    <div className="flex gap-2">
                      <button onClick={() => setConfirmDelete(null)} className="text-white/35 text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        Cancel
                      </button>
                      <button onClick={() => handleDelete(w.id)} className="text-white text-xs px-2 py-1 rounded-lg font-semibold" style={{ background: '#FF4D4D' }}>
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1">
      <p className="text-white/25 text-[9px] uppercase tracking-widest">{label}</p>
      <p className="text-white/70 text-xs font-semibold mt-0.5">{value}</p>
    </div>
  );
}
