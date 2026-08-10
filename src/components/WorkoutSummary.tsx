import { useState } from 'react';
import { X, Loader, Dumbbell, Clock, Flame, BarChart2, Link } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useWorkoutStore } from '../store/workoutStore';
import type { Promise_ } from '../lib/supabase';
import type { ActiveWorkoutSession, CalorieEstimate, ActiveSet, ActiveExercise } from '../lib/workoutTypes';
import { calcWorkoutCalories, calcTotalVolume, formatDuration, formatVolume } from '../lib/workoutCalc';

interface Props {
  workout: ActiveWorkoutSession;
  fitnessPromises: Promise_[];
  onSaved: (caloriesLogged: number) => void;
  onDiscard: () => void;
}

export default function WorkoutSummary({ workout, fitnessPromises, onSaved, onDiscard }: Props) {
  const user = useAuthStore(s => s.user);
  const profile = useAuthStore(s => s.profile);
  const setEffortRating = useWorkoutStore(s => s.setEffortRating);
  const setLinkedPromise = useWorkoutStore(s => s.setLinkedPromise);
  const discardWorkout = useWorkoutStore(s => s.discardWorkout);

  const [saving, setSaving] = useState(false);
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState(workout.name);
  const [workoutName, setWorkoutName] = useState(workout.name || 'Workout');
  const [savedCalorieEdit, setSavedCalorieEdit] = useState<string>('');
  const [showCalorieEdit, setShowCalorieEdit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const endedAt = new Date();
  const durationSeconds = Math.floor((endedAt.getTime() - workout.started_at.getTime()) / 1000);
  const durationMinutes = durationSeconds / 60;
  const bodyWeightKg = profile?.body_weight_kg ?? null;
  const weightUnit = profile?.weight_unit ?? 'kg';

  const calorieEstimate: CalorieEstimate = calcWorkoutCalories(
    workout.exercises,
    durationMinutes,
    bodyWeightKg,
  );
  const finalCalories = savedCalorieEdit !== '' ? (parseInt(savedCalorieEdit) || 0) : calorieEstimate.best;

  const totalVolume = calcTotalVolume(workout.exercises);
  const completedSets = workout.exercises.flatMap((e: ActiveExercise) => e.sets).filter((s: ActiveSet) => s.completed).length;
  workout.exercises
    .flatMap((e: ActiveExercise) => e.sets)
    .filter((s: ActiveSet) => s.completed && s.repetitions)
    .reduce((sum: number, s: ActiveSet) => sum + (parseInt(s.repetitions) || 0), 0);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      const caloriesVal = savedCalorieEdit !== '' ? (parseInt(savedCalorieEdit) || 0) : calorieEstimate.best;

      // 1. Insert workout row
      const { data: wData, error: wErr } = await supabase.from('workouts').insert({
        user_id: user.id,
        name: workoutName,
        started_at: workout.started_at.toISOString(),
        ended_at: endedAt.toISOString(),
        duration_seconds: durationSeconds,
        total_volume: totalVolume > 0 ? totalVolume : null,
        estimated_calories_low: calorieEstimate.low || null,
        estimated_calories_high: calorieEstimate.high || null,
        best_estimate_calories: caloriesVal || null,
        calorie_confidence: calorieEstimate.confidence,
        calorie_method: calorieEstimate.method,
        effort_rating: workout.effort_rating,
        notes: workout.notes || null,
        linked_promise_id: workout.linked_promise_id || null,
        is_template: false,
      }).select().single();
      if (wErr) throw new Error(wErr.message);

      // 2. Insert workout exercises and sets
      for (const ex of workout.exercises) {
        const isBuiltIn = 'slug' in ex.exercise;
        const slug = isBuiltIn ? (ex.exercise as any).slug : null;
        const customId = !isBuiltIn ? (ex.exercise as any).id : null;

        const { data: weData, error: weErr } = await supabase.from('workout_exercises').insert({
          workout_id: wData.id,
          exercise_slug: slug,
          custom_exercise_id: customId,
          exercise_name: ex.exercise.name,
          tracking_type: ex.exercise.tracking_type,
          exercise_order: ex.exercise_order,
          notes: ex.notes || null,
          duration_seconds: ex.duration_seconds ? parseInt(ex.duration_seconds) * 60 : null,
          distance: ex.distance ? parseFloat(ex.distance) : null,
          distance_unit: ex.distance_unit,
          speed: ex.speed ? parseFloat(ex.speed) : null,
          incline: ex.incline ? parseFloat(ex.incline) : null,
          resistance_level: ex.resistance_level ? parseInt(ex.resistance_level) : null,
          average_heart_rate: ex.average_heart_rate ? parseInt(ex.average_heart_rate) : null,
          maximum_heart_rate: ex.maximum_heart_rate ? parseInt(ex.maximum_heart_rate) : null,
          machine_calories: ex.machine_calories ? parseInt(ex.machine_calories) : null,
        }).select().single();
        if (weErr) throw new Error(weErr.message);

        if (ex.sets.length > 0) {
          const setsPayload = ex.sets.map((s: ActiveSet) => ({
            workout_exercise_id: weData.id,
            set_number: s.set_number,
            set_type: s.set_type,
            weight: s.weight ? parseFloat(s.weight) : null,
            weight_unit: weightUnit,
            repetitions: s.repetitions ? parseInt(s.repetitions) : null,
            duration_seconds: s.duration_seconds ? parseInt(s.duration_seconds) : null,
            distance: s.distance ? parseFloat(s.distance) : null,
            rpe: s.rpe,
            rir: s.rir,
            rest_seconds: s.rest_seconds,
            completed: s.completed,
            notes: s.notes || null,
          }));
          const { error: sErr } = await supabase.from('workout_sets').insert(setsPayload);
          if (sErr) throw new Error(sErr.message);
        }
      }

      // 3. Save as template if requested
      if (saveAsTemplate) {
        const { data: tData } = await supabase.from('workout_templates').insert({
          user_id: user.id,
          name: templateName,
          notes: null,
        }).select().single();
        if (tData) {
          const templateExes = workout.exercises.map((ex: ActiveExercise, idx: number) => {
            const slug = 'slug' in ex.exercise ? (ex.exercise as any).slug : null;
            return {
              template_id: tData.id,
              exercise_slug: slug,
              exercise_name: ex.exercise.name,
              exercise_order: idx,
              default_sets: ex.sets.length || 3,
              target_reps: null,
              target_weight: null,
              rest_seconds: 90,
            };
          });
          if (templateExes.length > 0) {
            await supabase.from('template_exercises').insert(templateExes);
          }
        }
      }

      // 4. Log calories to fitness_logs
      if (caloriesVal > 0) {
        const dateKey = workout.started_at.toISOString().slice(0, 10);
        await supabase.from('fitness_logs').insert({
          user_id: user.id,
          metric: 'calories',
          value: caloriesVal,
          note: `Workout: ${workoutName}`,
          date_key: dateKey,
        });
      }

      discardWorkout();
      onSaved(caloriesVal);
    } catch (e) {
      setError((e as Error).message);
      setSaving(false);
    }
  }

  const CONFIDENCE_COLOR = { high: '#10B981', medium: '#F59E0B', low: '#EF4444' };
  const confColor = CONFIDENCE_COLOR[calorieEstimate.confidence];

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#0a0a0a', overflowY: 'auto' }}>
      <div className="max-w-md mx-auto w-full px-5 pt-safe pt-6 pb-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-semibold text-lg" style={{ letterSpacing: '-0.03em' }}>Workout Summary</h2>
          <button onClick={onDiscard} className="text-white/30 hover:text-white/60 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Name */}
        <input
          value={workoutName}
          onChange={e => setWorkoutName(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-2xl text-white text-sm font-medium outline-none"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
          placeholder="Workout name"
        />

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatCard icon={<Clock size={16} style={{ color: '#FF4D4D' }} />} label="Duration" value={formatDuration(durationSeconds)} />
          <StatCard icon={<Dumbbell size={16} style={{ color: '#3D8EFF' }} />} label="Exercises" value={`${workout.exercises.length}`} />
          <StatCard icon={<BarChart2 size={16} style={{ color: '#10B981' }} />} label="Sets done" value={`${completedSets}`} />
          {totalVolume > 0 && (
            <StatCard icon={<BarChart2 size={16} style={{ color: '#F59E0B' }} />} label="Volume" value={formatVolume(totalVolume)} />
          )}
        </div>

        {/* Calorie estimate */}
        <div className="mb-4 px-4 py-4 rounded-2xl" style={{ background: 'rgba(255,77,77,0.07)', border: '1px solid rgba(255,77,77,0.15)' }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Flame size={14} style={{ color: '#FF4D4D' }} />
                <p className="text-white/40 text-[10px] uppercase tracking-widest">Est. calories burned</p>
              </div>
              {calorieEstimate.best > 0 ? (
                <>
                  {showCalorieEdit ? (
                    <input
                      type="number"
                      inputMode="numeric"
                      value={savedCalorieEdit}
                      onChange={e => setSavedCalorieEdit(e.target.value)}
                      className="text-white text-2xl font-semibold bg-transparent outline-none w-32"
                      style={{ letterSpacing: '-0.04em', color: '#FF4D4D' }}
                      autoFocus
                      onBlur={() => setShowCalorieEdit(false)}
                    />
                  ) : (
                    <button onClick={() => { setSavedCalorieEdit(String(finalCalories)); setShowCalorieEdit(true); }}>
                      <span className="text-2xl font-semibold" style={{ color: '#FF4D4D', letterSpacing: '-0.04em' }}>
                        ~{finalCalories.toLocaleString()}
                      </span>
                      <span className="text-white/30 text-sm ml-1">kcal</span>
                    </button>
                  )}
                  <p className="text-white/25 text-[10px] mt-1">
                    Range: {calorieEstimate.low}–{calorieEstimate.high} kcal
                  </p>
                </>
              ) : (
                <p className="text-white/40 text-sm">Not enough data</p>
              )}
            </div>
            <div className="text-right">
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                style={{ background: `${confColor}22`, color: confColor }}>
                {calorieEstimate.confidence} confidence
              </span>
              <p className="text-white/20 text-[9px] mt-1 max-w-[120px]">{calorieEstimate.method}</p>
            </div>
          </div>
          {calorieEstimate.missing.length > 0 && (
            <p className="text-white/25 text-[10px] mt-2">
              Add {calorieEstimate.missing.join(', ')} for a better estimate.
            </p>
          )}
        </div>

        {/* Effort rating */}
        <div className="mb-4">
          <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">How hard was it?</p>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(r => (
              <button
                key={r}
                onClick={() => setEffortRating(r)}
                className="flex-1 h-8 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: workout.effort_rating === r ? '#FF4D4D' : 'rgba(255,255,255,0.05)',
                  color: workout.effort_rating === r ? '#fff' : 'rgba(255,255,255,0.3)',
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Link to habit */}
        {fitnessPromises.length > 0 && (
          <div className="mb-4">
            <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2 flex items-center gap-1">
              <Link size={10} /> Link to habit (optional)
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setLinkedPromise(null)}
                className="px-3 py-1.5 rounded-full text-xs transition-colors"
                style={!workout.linked_promise_id
                  ? { background: '#FF4D4D', color: '#fff' }
                  : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}
              >
                None
              </button>
              {fitnessPromises.map(p => (
                <button
                  key={p.id}
                  onClick={() => setLinkedPromise(p.id)}
                  className="px-3 py-1.5 rounded-full text-xs transition-colors"
                  style={workout.linked_promise_id === p.id
                    ? { background: '#FF4D4D', color: '#fff' }
                    : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Exercise breakdown */}
        <div className="mb-4">
          <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Exercises</p>
          <div className="space-y-2">
            {workout.exercises.map((ex: ActiveExercise) => {
              const done = ex.sets.filter((s: ActiveSet) => s.completed).length;
              const reps = ex.sets.filter((s: ActiveSet) => s.completed && s.repetitions).reduce((sum: number, set: ActiveSet) => sum + (parseInt(set.repetitions) || 0), 0);
              return (
                <div key={ex.id} className="flex items-center justify-between px-4 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <p className="text-white/70 text-sm">{ex.exercise.name}</p>
                  <p className="text-white/35 text-xs">
                    {done} set{done !== 1 ? 's' : ''}
                    {reps > 0 ? ` · ${reps} reps` : ''}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Save as template */}
        <div className="mb-6">
          <button
            onClick={() => setSaveAsTemplate(v => !v)}
            className="flex items-center gap-2 text-white/40 text-xs hover:text-white/60 transition-colors"
          >
            <div
              className="w-4 h-4 rounded flex items-center justify-center"
              style={{ background: saveAsTemplate ? '#FF4D4D' : 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              {saveAsTemplate && <X size={10} color="#fff" strokeWidth={3} />}
            </div>
            Save as reusable template
          </button>
          {saveAsTemplate && (
            <input
              value={templateName}
              onChange={e => setTemplateName(e.target.value)}
              className="mt-2 w-full px-4 py-2.5 rounded-2xl text-white text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
              placeholder="Template name"
            />
          )}
        </div>

        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 rounded-2xl text-sm font-semibold text-white transition-all active:scale-[0.97] disabled:opacity-60"
          style={{ background: '#FF4D4D' }}
        >
          {saving ? <Loader size={16} className="animate-spin mx-auto" /> : 'Save Workout'}
        </button>

        <button
          onClick={onDiscard}
          className="w-full mt-3 py-3 text-sm text-white/25 hover:text-white/50 transition-colors"
        >
          Discard workout
        </button>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="px-4 py-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <p className="text-white/35 text-[10px] uppercase tracking-widest">{label}</p>
      </div>
      <p className="text-white font-semibold text-xl" style={{ letterSpacing: '-0.03em' }}>{value}</p>
    </div>
  );
}
