import type { ActiveExercise, ActiveSet, CalorieEstimate } from './workoutTypes';

export function calcMETCalories(met: number, bodyWeightKg: number, durationMinutes: number): number {
  // Standard MET formula: calories = MET × 3.5 × weight_kg / 200 × duration_min
  return Math.round(met * 3.5 * bodyWeightKg / 200 * durationMinutes);
}

interface StrengthIntensity {
  met: number;
  label: 'Light' | 'Moderate' | 'Vigorous';
}

function classifyStrengthIntensity(
  avgRpe: number | null,
  avgRestSeconds: number | null,
  completedSets: number,
  durationMinutes: number,
): StrengthIntensity {
  const density = completedSets / Math.max(1, durationMinutes);
  const rpe = avgRpe ?? 7;
  const rest = avgRestSeconds ?? 90;

  if (rpe >= 8.5 || (density > 0.4 && rpe >= 7) || rest < 60) {
    return { met: 6.0, label: 'Vigorous' };
  }
  if (rpe >= 6 || density > 0.2 || rest <= 120) {
    return { met: 4.5, label: 'Moderate' };
  }
  return { met: 3.0, label: 'Light' };
}

export function calcWorkoutCalories(
  exercises: ActiveExercise[],
  durationMinutes: number,
  bodyWeightKg: number | null,
): CalorieEstimate {
  const missing: string[] = [];
  if (!bodyWeightKg) missing.push('body weight');
  if (durationMinutes <= 0) missing.push('workout duration');

  if (!bodyWeightKg || durationMinutes <= 0) {
    return { low: 0, high: 0, best: 0, confidence: 'low', method: 'insufficient data', missing };
  }

  // Separate cardio vs strength exercises
  const cardioExercises = exercises.filter(e => {
    const tt = e.exercise.tracking_type;
    return tt === 'cardio_distance' || tt === 'cardio_duration';
  });
  const strengthExercises = exercises.filter(e => {
    const tt = e.exercise.tracking_type;
    return tt !== 'cardio_distance' && tt !== 'cardio_duration';
  });

  let totalBest = 0;
  let totalLow = 0;
  let totalHigh = 0;
  let hasCardioData = false;
  let method = '';

  // Cardio: use duration + MET per exercise
  for (const ex of cardioExercises) {
    const durMin = ex.duration_seconds ? parseFloat(ex.duration_seconds) / 60 : 0;
    if (durMin <= 0) continue;
    hasCardioData = true;
    const met = ex.exercise.default_met;
    const best = calcMETCalories(met, bodyWeightKg, durMin);
    totalBest += best;
    totalLow += Math.round(best * 0.85);
    totalHigh += Math.round(best * 1.15);
  }

  // Strength/other: classify intensity from completed sets + RPE
  if (strengthExercises.length > 0 || (exercises.length > 0 && cardioExercises.length === 0)) {
    const allSets = strengthExercises.flatMap(e => e.sets);
    const completedSets = allSets.filter(s => s.completed);
    const strengthDuration = hasCardioData
      ? Math.max(5, durationMinutes - cardioExercises.reduce((s, e) => s + (parseFloat(e.duration_seconds || '0') / 60), 0))
      : durationMinutes;

    const rpeSets = completedSets.filter(s => s.rpe !== null);
    const avgRpe = rpeSets.length > 0 ? rpeSets.reduce((s, set) => s + (set.rpe ?? 0), 0) / rpeSets.length : null;
    const restSets = completedSets.filter(s => s.rest_seconds !== null);
    const avgRest = restSets.length > 0 ? restSets.reduce((s, set) => s + (set.rest_seconds ?? 0), 0) / restSets.length : null;

    const intensity = classifyStrengthIntensity(avgRpe, avgRest, completedSets.length, strengthDuration);
    const best = calcMETCalories(intensity.met, bodyWeightKg, strengthDuration);
    totalBest += best;
    totalLow += calcMETCalories(intensity.met * 0.85, bodyWeightKg, strengthDuration);
    totalHigh += calcMETCalories(intensity.met * 1.2, bodyWeightKg, strengthDuration);
    method = `${intensity.label} strength training`;
  }

  if (hasCardioData) {
    method = method ? `${method} + cardio` : 'cardio (MET-based)';
  }
  if (!method) method = 'MET-based estimate';

  const confidence: 'high' | 'medium' | 'low' = missing.length === 0 && durationMinutes > 0 ? 'medium' : 'low';

  return { low: totalLow, high: totalHigh, best: totalBest, confidence, method, missing };
}

export function calcSetVolume(weight: string, reps: string, unit: string): number {
  const w = parseFloat(weight) || 0;
  const r = parseInt(reps) || 0;
  const kg = unit === 'lbs' ? w * 0.453592 : w;
  return kg * r;
}

export function calcExerciseVolume(sets: ActiveSet[], unit = 'kg'): number {
  return sets
    .filter(s => s.completed && s.weight && s.repetitions)
    .reduce((sum, s) => sum + calcSetVolume(s.weight, s.repetitions, unit), 0);
}

export function calcTotalVolume(exercises: ActiveExercise[]): number {
  return exercises
    .filter(e => e.exercise.tracking_type === 'weight_reps')
    .reduce((sum, e) => sum + calcExerciseVolume(e.sets), 0);
}

export function calcEstimated1RM(weightKg: number, reps: number): number | null {
  // Epley formula: 1RM = weight × (1 + reps / 30)
  if (reps <= 0 || reps > 30 || weightKg <= 0) return null;
  return Math.round(weightKg * (1 + reps / 30));
}

export function lbsToKg(lbs: number): number {
  return Math.round(lbs * 0.453592 * 10) / 10;
}

export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462 * 10) / 10;
}

export function kmToMi(km: number): number {
  return Math.round(km * 0.621371 * 100) / 100;
}

export function miToKm(mi: number): number {
  return Math.round(mi * 1.60934 * 100) / 100;
}

export function formatVolume(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)}t`;
  return `${Math.round(kg).toLocaleString()} kg`;
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s > 0 ? `${s}s` : ''}`.trim();
  return `${s}s`;
}
