import { useEffect, useState } from 'react';
import {
  X, Plus, Check, Trash2, ChevronDown, ChevronUp, Timer, Pause, Play,
  Copy, MoreHorizontal, Dumbbell
} from 'lucide-react';
import { useWorkoutStore } from '../store/workoutStore';
import ExercisePicker from './ExercisePicker';
import CreateExerciseModal from './CreateExerciseModal';
import type { ActiveExercise, ActiveSet, SetType, CustomExercise } from '../lib/workoutTypes';
import { formatDuration } from '../lib/workoutCalc';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

const SET_TYPE_LABELS: Record<SetType, string> = {
  warmup: 'WU',
  working: 'W',
  dropset: 'D',
  failure: 'F',
  backoff: 'B',
  assisted: 'A',
};
const SET_TYPES: SetType[] = ['warmup', 'working', 'dropset', 'failure', 'backoff', 'assisted'];

function ElapsedTimer({ startedAt }: { startedAt: Date }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const update = () => setElapsed(Math.floor((Date.now() - startedAt.getTime()) / 1000));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  return <span className="tabular-nums">{formatDuration(elapsed)}</span>;
}

function RestTimerBar() {
  const restTimer = useWorkoutStore(s => s.restTimer);
  const pauseResume = useWorkoutStore(s => s.pauseResumeRestTimer);
  const stop = useWorkoutStore(s => s.stopRestTimer);
  const addTime = useWorkoutStore(s => s.addRestTime);

  if (!restTimer) return null;

  const pct = restTimer.total > 0 ? restTimer.remaining / restTimer.total : 0;
  const done = restTimer.remaining <= 0;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto"
      style={{ background: '#141414', borderTop: '1px solid rgba(255,255,255,0.08)' }}
    >
      {/* Progress bar */}
      <div className="h-0.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full transition-all duration-1000"
          style={{ width: `${pct * 100}%`, background: done ? '#10B981' : '#FF4D4D' }}
        />
      </div>
      <div className="flex items-center gap-3 px-5 py-3">
        <div className="flex-1">
          <p className="text-white/40 text-[10px] uppercase tracking-widest">
            {done ? 'Rest done!' : 'Rest timer'}
          </p>
          <p className="text-white font-semibold text-lg tabular-nums" style={{ letterSpacing: '-0.04em' }}>
            {formatDuration(restTimer.remaining)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!done && (
            <>
              <button
                onClick={() => addTime(30)}
                className="px-2.5 py-1 rounded-xl text-xs text-white/50 hover:text-white/80 transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                +30s
              </button>
              <button onClick={pauseResume} className="w-8 h-8 flex items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                {restTimer.running ? <Pause size={14} className="text-white/70" /> : <Play size={14} className="text-white/70" />}
              </button>
            </>
          )}
          <button onClick={stop} className="w-8 h-8 flex items-center justify-center rounded-full text-white/30 hover:text-white/60 transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function SetRow({
  set,
  trackingType,
  weightUnit,
  exerciseId: _exerciseId,
  onToggleComplete,
  onUpdate,
  onRemove,
  onStartRest,
}: {
  set: ActiveSet;
  trackingType: string;
  weightUnit: string;
  exerciseId?: string;
  onToggleComplete: () => void;
  onUpdate: (updates: Partial<ActiveSet>) => void;
  onRemove: () => void;
  onStartRest: () => void;
}) {
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  const showWeight = trackingType === 'weight_reps' || trackingType === 'bodyweight_reps';
  const showReps = trackingType === 'weight_reps' || trackingType === 'bodyweight_reps';
  const showDuration = trackingType === 'timed';
  const isBodyweight = trackingType === 'bodyweight_reps';

  return (
    <div
      className="flex items-center gap-2 py-2 px-3 rounded-xl"
      style={{
        background: set.completed ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${set.completed ? 'rgba(16,185,129,0.2)' : 'transparent'}`,
      }}
    >
      {/* Set type chip */}
      <div className="relative shrink-0">
        <button
          onClick={() => setShowTypeMenu(v => !v)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold"
          style={{ background: set.set_type === 'warmup' ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)', color: set.set_type === 'warmup' ? '#F59E0B' : 'rgba(255,255,255,0.5)' }}
        >
          {SET_TYPE_LABELS[set.set_type]}
        </button>
        {showTypeMenu && (
          <div
            className="absolute left-0 top-8 z-30 rounded-xl overflow-hidden shadow-xl"
            style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)', minWidth: 110 }}
          >
            {SET_TYPES.map(t => (
              <button
                key={t}
                onClick={() => { onUpdate({ set_type: t }); setShowTypeMenu(false); }}
                className="w-full text-left px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              >
                {SET_TYPE_LABELS[t]} · {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Set number */}
      <span className="text-white/25 text-xs w-4 shrink-0 text-center">{set.set_number}</span>

      {/* Weight */}
      {showWeight && !isBodyweight && (
        <input
          type="number"
          inputMode="decimal"
          placeholder="—"
          value={set.weight}
          onChange={e => onUpdate({ weight: e.target.value })}
          className="w-16 bg-transparent text-white text-sm font-medium text-center outline-none rounded-lg py-1"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        />
      )}
      {isBodyweight && (
        <span className="w-16 text-white/25 text-xs text-center shrink-0">BW</span>
      )}
      {showWeight && !isBodyweight && (
        <span className="text-white/25 text-[10px] shrink-0">{weightUnit}</span>
      )}

      {/* Reps */}
      {showReps && (
        <input
          type="number"
          inputMode="numeric"
          placeholder="—"
          value={set.repetitions}
          onChange={e => onUpdate({ repetitions: e.target.value })}
          className="w-14 bg-transparent text-white text-sm font-medium text-center outline-none rounded-lg py-1 flex-1"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        />
      )}
      {showReps && <span className="text-white/25 text-[10px] shrink-0">reps</span>}

      {/* Duration (timed exercises) */}
      {showDuration && (
        <>
          <input
            type="number"
            inputMode="numeric"
            placeholder="—"
            value={set.duration_seconds}
            onChange={e => onUpdate({ duration_seconds: e.target.value })}
            className="flex-1 bg-transparent text-white text-sm font-medium text-center outline-none rounded-lg py-1"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          />
          <span className="text-white/25 text-[10px] shrink-0">sec</span>
        </>
      )}

      {/* RPE */}
      <select
        value={set.rpe ?? ''}
        onChange={e => onUpdate({ rpe: e.target.value ? parseInt(e.target.value) : null })}
        className="bg-transparent text-white/40 text-[10px] outline-none shrink-0 w-12"
        style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '2px 4px' }}
      >
        <option value="">RPE</option>
        {[6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map(r => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>

      {/* Complete button */}
      <button
        onClick={() => {
          onToggleComplete();
          if (!set.completed) onStartRest();
        }}
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90"
        style={{
          background: set.completed ? '#10B981' : 'rgba(255,255,255,0.06)',
          border: `1.5px solid ${set.completed ? '#10B981' : 'rgba(255,255,255,0.12)'}`,
        }}
      >
        <Check size={13} color={set.completed ? '#fff' : 'rgba(255,255,255,0.3)'} strokeWidth={2.5} />
      </button>

      {/* Delete */}
      <button onClick={onRemove} className="text-white/15 hover:text-red-400 transition-colors shrink-0">
        <Trash2 size={12} />
      </button>
    </div>
  );
}

function ExerciseCard({
  ex,
  weightUnit,
  previousData,
  onRemove,
}: {
  ex: ActiveExercise;
  weightUnit: string;
  previousData: string | null;
  onRemove: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const addSet = useWorkoutStore(s => s.addSet);
  const duplicateLastSet = useWorkoutStore(s => s.duplicateLastSet);
  const updateSet = useWorkoutStore(s => s.updateSet);
  const removeSet = useWorkoutStore(s => s.removeSet);
  const toggleSetComplete = useWorkoutStore(s => s.toggleSetComplete);
  const updateExerciseNotes = useWorkoutStore(s => s.updateExerciseNotes);
  const updateCardioField = useWorkoutStore(s => s.updateCardioField);
  const startRestTimer = useWorkoutStore(s => s.startRestTimer);

  const tt = ex.exercise.tracking_type;
  const isCardio = tt === 'cardio_distance' || tt === 'cardio_duration';
  const isTimed = tt === 'timed';
  const isRounds = tt === 'rounds';
  const isStrength = tt === 'weight_reps' || tt === 'bodyweight_reps';
  const isDistanceWeight = tt === 'distance_weight_time';

  const completedSets = ex.sets.filter(s => s.completed).length;

  return (
    <div className="rounded-[20px] overflow-hidden" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)' }}>
      {/* Exercise header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-white font-semibold text-sm truncate">{ex.exercise.name}</p>
            {completedSets > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold shrink-0"
                style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>
                {completedSets}/{ex.sets.length}
              </span>
            )}
          </div>
          {previousData && (
            <p className="text-white/25 text-[10px] mt-0.5 truncate">Last: {previousData}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setShowNotes(v => !v)} className="text-white/20 hover:text-white/50 transition-colors">
            <MoreHorizontal size={16} />
          </button>
          <button onClick={() => setCollapsed(v => !v)} className="text-white/20 hover:text-white/50 transition-colors">
            {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
          <button onClick={onRemove} className="text-white/15 hover:text-red-400 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="px-4 pb-4 space-y-3">
          {/* Notes */}
          {showNotes && (
            <input
              value={ex.notes}
              onChange={e => updateExerciseNotes(ex.id, e.target.value)}
              placeholder="Exercise notes…"
              className="w-full bg-transparent text-white/60 text-xs outline-none px-3 py-2 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            />
          )}

          {/* Cardio fields */}
          {isCardio && (
            <div className="grid grid-cols-2 gap-2">
              {[
                { field: 'duration_seconds', label: 'Duration (min)', hint: 'min' },
                { field: 'distance', label: 'Distance', hint: ex.distance_unit },
                { field: 'speed', label: 'Speed (km/h)', hint: 'km/h' },
                { field: 'incline', label: 'Incline (%)', hint: '%' },
                { field: 'resistance_level', label: 'Resistance', hint: 'level' },
                { field: 'average_heart_rate', label: 'Avg HR', hint: 'bpm' },
              ].map(({ field, label, hint }) => (
                <div key={field}>
                  <p className="text-white/30 text-[9px] uppercase tracking-widest mb-1">{label}</p>
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <input
                      type="number"
                      inputMode="decimal"
                      placeholder="—"
                      value={ex[field as keyof ActiveExercise] as string}
                      onChange={e => updateCardioField(ex.id, field as keyof ActiveExercise, e.target.value)}
                      className="flex-1 bg-transparent text-white text-sm outline-none w-0"
                    />
                    <span className="text-white/25 text-[10px]">{hint}</span>
                  </div>
                </div>
              ))}
              {tt === 'cardio_distance' && (
                <div className="flex items-end gap-2">
                  <p className="text-white/30 text-[9px] uppercase tracking-widest mb-1.5">Machine kcal</p>
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder="—"
                      value={ex.machine_calories}
                      onChange={e => updateCardioField(ex.id, 'machine_calories', e.target.value)}
                      className="flex-1 bg-transparent text-white text-sm outline-none w-0"
                    />
                    <span className="text-white/25 text-[10px]">kcal</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Distance + weight (farmer's carry etc) */}
          {isDistanceWeight && (
            <div className="grid grid-cols-3 gap-2">
              {[
                { field: 'distance', label: 'Distance (m)' },
                { field: 'duration_seconds', label: 'Duration (s)' },
              ].map(({ field, label }) => (
                <div key={field} className="col-span-1">
                  <p className="text-white/30 text-[9px] uppercase tracking-widest mb-1">{label}</p>
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="—"
                    value={ex[field as keyof ActiveExercise] as string}
                    onChange={e => updateCardioField(ex.id, field as keyof ActiveExercise, e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-white text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Strength / bodyweight / timed sets */}
          {(isStrength || isTimed || isRounds) && (
            <>
              {/* Column headers */}
              <div className="flex items-center gap-2 px-3">
                <span className="w-7 shrink-0" />
                <span className="w-4 shrink-0" />
                {isStrength && tt !== 'bodyweight_reps' && <span className="w-16 text-white/25 text-[9px] uppercase text-center">Weight</span>}
                {tt === 'bodyweight_reps' && <span className="w-16 text-white/25 text-[9px] uppercase text-center">Load</span>}
                {isStrength && <span className="flex-1 text-white/25 text-[9px] uppercase text-center">Reps</span>}
                {isTimed && <span className="flex-1 text-white/25 text-[9px] uppercase text-center">Seconds</span>}
                <span className="w-12 shrink-0" />
                <span className="w-8 shrink-0" />
                <span className="w-3 shrink-0" />
              </div>

              {ex.sets.map(set => (
                <SetRow
                  key={set.id}
                  set={set}
                  trackingType={tt}
                  weightUnit={weightUnit}
                  exerciseId={ex.id}
                  onToggleComplete={() => toggleSetComplete(ex.id, set.id)}
                  onUpdate={updates => updateSet(ex.id, set.id, updates)}
                  onRemove={() => removeSet(ex.id, set.id)}
                  onStartRest={() => startRestTimer(90)}
                />
              ))}

              <div className="flex gap-2">
                <button
                  onClick={() => addSet(ex.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm text-white/50 hover:text-white/80 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.08)' }}
                >
                  <Plus size={13} />
                  Add set
                </button>
                <button
                  onClick={() => duplicateLastSet(ex.id)}
                  className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-xs text-white/30 hover:text-white/60 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                  title="Duplicate last set"
                >
                  <Copy size={12} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface Props {
  onFinish: () => void;
  onDiscard: () => void;
}

export default function ActiveWorkout({ onFinish, onDiscard }: Props) {
  const active = useWorkoutStore(s => s.active);
  const addExercise = useWorkoutStore(s => s.addExercise);
  const removeExercise = useWorkoutStore(s => s.removeExercise);
  const [showPicker, setShowPicker] = useState(active?.exercises.length === 0);
  const [showCreateExercise, setShowCreateExercise] = useState(false);
  const [customExercises, setCustomExercises] = useState<CustomExercise[]>([]);
  const [previousMap, setPreviousMap] = useState<Record<string, string>>({});
  const user = useAuthStore(s => s.user);
  const profile = useAuthStore(s => s.profile);

  const weightUnit = profile?.weight_unit ?? 'kg';

  useEffect(() => {
    loadCustomExercises();
    loadPreviousPerformance();
  }, []);

  async function loadCustomExercises() {
    if (!user) return;
    const { data } = await supabase.from('custom_exercises').select('*').eq('user_id', user.id).eq('active', true);
    if (data) setCustomExercises(data as CustomExercise[]);
  }

  async function loadPreviousPerformance() {
    if (!user) return;
    // Load last workout for each slug
    const { data: workouts } = await supabase
      .from('workouts')
      .select('id, workout_exercises(exercise_slug, exercise_name, workout_sets(weight, repetitions, completed, weight_unit))')
      .eq('user_id', user.id)
      .eq('is_template', false)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!workouts) return;
    const map: Record<string, string> = {};
    for (const w of workouts as any[]) {
      for (const we of (w.workout_exercises ?? [])) {
        const slug = we.exercise_slug;
        if (!slug || map[slug]) continue;
        const completedSets = (we.workout_sets ?? []).filter((s: any) => s.completed && s.weight && s.repetitions);
        if (completedSets.length === 0) continue;
        const parts = completedSets.slice(0, 3).map((s: any) => {
          const u = s.weight_unit ?? 'kg';
          return `${s.weight}${u}×${s.repetitions}`;
        });
        map[slug] = parts.join(', ');
      }
    }
    setPreviousMap(map);
  }

  if (!active) return null;

  const totalSets = active.exercises.flatMap(e => e.sets).length;
  const completedSets = active.exercises.flatMap(e => e.sets).filter(s => s.completed).length;

  return (
    <>
      <div className="scene-bg" />
      <div className="scene-overlay" />

      <div className="relative z-10 flex flex-col min-h-screen max-w-md mx-auto">
        {/* Header */}
        <div
          className="sticky top-0 z-20 flex items-center gap-3 px-4 pt-safe pt-4 pb-3"
          style={{ background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">{active.name}</p>
            <div className="flex items-center gap-3 mt-0.5">
              <div className="flex items-center gap-1 text-white/35 text-xs">
                <Timer size={10} />
                <ElapsedTimer startedAt={active.started_at} />
              </div>
              <span className="text-white/20 text-xs">{completedSets}/{totalSets} sets</span>
              {active.exercises.length > 0 && (
                <span className="text-white/20 text-xs">{active.exercises.length} exercises</span>
              )}
            </div>
          </div>
          <button
            onClick={onFinish}
            className="px-4 py-2 rounded-2xl text-sm font-semibold text-white transition-all active:scale-95"
            style={{ background: '#FF4D4D' }}
          >
            Finish
          </button>
          <button onClick={onDiscard} className="text-white/25 hover:text-white/60 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 pb-32 space-y-3">
          {active.exercises.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,77,77,0.1)' }}>
                <Dumbbell size={28} style={{ color: '#FF4D4D', opacity: 0.7 }} strokeWidth={1.5} />
              </div>
              <p className="text-white/40 text-sm">Add your first exercise to get started</p>
            </div>
          )}

          {active.exercises.map(ex => {
            const slug = 'slug' in ex.exercise ? (ex.exercise as any).slug : null;
            return (
              <ExerciseCard
                key={ex.id}
                ex={ex}
                weightUnit={weightUnit}
                previousData={slug ? (previousMap[slug] ?? null) : null}
                onRemove={() => removeExercise(ex.id)}
              />
            );
          })}

          <button
            onClick={() => setShowPicker(true)}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-[20px] text-sm font-medium text-white/50 hover:text-white/80 transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.1)' }}
          >
            <Plus size={16} />
            Add exercise
          </button>
        </div>

        {/* Rest timer */}
        <RestTimerBar />
      </div>

      {/* Presets rest timer quick buttons (floating above rest timer when it shows) */}

      {showPicker && (
        <ExercisePicker
          customExercises={customExercises}
          onSelect={ex => { addExercise(ex); setShowPicker(false); }}
          onCreateCustom={() => { setShowPicker(false); setShowCreateExercise(true); }}
          onClose={() => setShowPicker(false)}
        />
      )}

      {showCreateExercise && (
        <CreateExerciseModal
          onCreated={ex => {
            setCustomExercises(prev => [ex, ...prev]);
            addExercise(ex);
            setShowCreateExercise(false);
          }}
          onClose={() => setShowCreateExercise(false)}
        />
      )}
    </>
  );
}
