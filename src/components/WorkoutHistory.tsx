import { useEffect, useState } from 'react';
import { Clock, Dumbbell, Flame, ChevronRight, ChevronDown, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import type { WorkoutWithDetails } from '../lib/workoutTypes';
import { formatDuration, formatVolume } from '../lib/workoutCalc';
import { useWorkoutStore } from '../store/workoutStore';
import { BUILT_IN_EXERCISES } from '../lib/exerciseData';

interface Props {
  onRepeat?: () => void;
}

export default function WorkoutHistory({ onRepeat }: Props) {
  const user = useAuthStore(s => s.user);
  const addExercise = useWorkoutStore(s => s.addExercise);
  const startWorkout = useWorkoutStore(s => s.startWorkout);
  const [workouts, setWorkouts] = useState<WorkoutWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('workouts')
      .select(`
        *,
        workout_exercises (
          *,
          workout_sets (*)
        )
      `)
      .eq('user_id', user.id)
      .eq('is_template', false)
      .order('created_at', { ascending: false })
      .limit(50);
    if (data) setWorkouts(data as WorkoutWithDetails[]);
    setLoading(false);
  }

  function handleRepeat(w: WorkoutWithDetails) {
    if (!onRepeat) return;
    startWorkout(w.name);
    for (const we of w.workout_exercises.sort((a, b) => a.exercise_order - b.exercise_order)) {
      const ex = we.exercise_slug
        ? BUILT_IN_EXERCISES.find(e => e.slug === we.exercise_slug)
        : null;
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

  return (
    <div className="space-y-3">
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
              onClick={() => setExpanded(isExpanded ? null : w.id)}
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
                {/* Stats */}
                <div className="flex gap-3 pt-3">
                  {w.total_volume != null && w.total_volume > 0 && (
                    <Stat label="Volume" value={formatVolume(w.total_volume)} />
                  )}
                  {w.effort_rating && <Stat label="Effort" value={`${w.effort_rating}/10`} />}
                  {w.best_estimate_calories && <Stat label="~Calories" value={`${w.best_estimate_calories} kcal`} />}
                </div>

                {/* Exercise list */}
                <div className="space-y-1.5">
                  {w.workout_exercises
                    .sort((a, b) => a.exercise_order - b.exercise_order)
                    .map(we => {
                      const completedSets = we.workout_sets.filter(s => s.completed);
                      const totalReps = completedSets.reduce((s, set) => s + (set.repetitions ?? 0), 0);
                      const maxWeight = Math.max(0, ...completedSets.map(s => s.weight ?? 0));
                      return (
                        <div key={we.id} className="flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                          <p className="text-white/70 text-xs">{we.exercise_name}</p>
                          <p className="text-white/30 text-[10px]">
                            {completedSets.length > 0 && `${completedSets.length} sets`}
                            {totalReps > 0 && ` · ${totalReps} reps`}
                            {maxWeight > 0 && ` · ${maxWeight}${we.workout_sets[0]?.weight_unit ?? 'kg'} max`}
                          </p>
                        </div>
                      );
                    })}
                </div>

                {/* Repeat button */}
                {onRepeat && (
                  <button
                    onClick={() => handleRepeat(w)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm text-white/50 hover:text-white/80 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <RefreshCw size={13} />
                    Repeat this workout
                  </button>
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
