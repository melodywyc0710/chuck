export type ExerciseCategory =
  | 'free_weights'
  | 'machines'
  | 'bodyweight'
  | 'cardio'
  | 'functional'
  | 'mobility'
  | 'class';

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'kettlebell'
  | 'machine'
  | 'cable'
  | 'bodyweight'
  | 'cardio_machine'
  | 'band'
  | 'other';

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'abs'
  | 'full_body'
  | 'cardio';

export type TrackingType =
  | 'weight_reps'
  | 'bodyweight_reps'
  | 'timed'
  | 'cardio_distance'
  | 'cardio_duration'
  | 'distance_weight_time'
  | 'rounds';

export type SetType = 'warmup' | 'working' | 'dropset' | 'failure' | 'backoff' | 'assisted';

export interface BuiltInExercise {
  slug: string;
  name: string;
  category: ExerciseCategory;
  equipment: Equipment;
  primary_muscle: MuscleGroup;
  secondary_muscles: MuscleGroup[];
  tracking_type: TrackingType;
  default_met: number;
  aliases?: string[];
  instructions?: string;
}

export interface CustomExercise {
  id: string;
  user_id: string;
  name: string;
  category: ExerciseCategory;
  equipment: Equipment;
  primary_muscle: MuscleGroup;
  secondary_muscles: MuscleGroup[];
  tracking_type: TrackingType;
  default_met: number;
  instructions: string | null;
  active: boolean;
  created_at: string;
}

export type AnyExercise =
  | (BuiltInExercise & { source: 'builtin' })
  | (CustomExercise & { source: 'custom'; slug?: undefined });

export type SetTypeLabel = 'warmup' | 'working' | 'dropset' | 'failure' | 'backoff' | 'assisted';

export interface ActiveSet {
  id: string;
  set_number: number;
  set_type: SetType;
  weight: string;
  repetitions: string;
  duration_seconds: string;
  distance: string;
  rpe: number | null;
  rir: number | null;
  rest_seconds: number | null;
  completed: boolean;
  notes: string;
}

export interface ActiveExercise {
  id: string;
  exercise: BuiltInExercise | CustomExercise;
  exercise_order: number;
  sets: ActiveSet[];
  notes: string;
  // cardio fields
  duration_seconds: string;
  distance: string;
  distance_unit: 'km' | 'mi';
  speed: string;
  incline: string;
  resistance_level: string;
  average_heart_rate: string;
  maximum_heart_rate: string;
  machine_calories: string;
}

export interface ActiveWorkoutSession {
  id: string;
  name: string;
  started_at: Date;
  exercises: ActiveExercise[];
  notes: string;
  effort_rating: number | null;
  linked_promise_id: string | null;
}

// DB row types
export interface Workout {
  id: string;
  user_id: string;
  name: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
  total_volume: number | null;
  estimated_calories_low: number | null;
  estimated_calories_high: number | null;
  best_estimate_calories: number | null;
  calorie_confidence: 'high' | 'medium' | 'low' | null;
  calorie_method: string | null;
  effort_rating: number | null;
  notes: string | null;
  linked_promise_id: string | null;
  is_template: boolean;
  created_at: string;
}

export interface WorkoutExerciseRow {
  id: string;
  workout_id: string;
  exercise_slug: string | null;
  custom_exercise_id: string | null;
  exercise_name: string;
  tracking_type: string;
  exercise_order: number;
  notes: string | null;
  duration_seconds: number | null;
  distance: number | null;
  distance_unit: string | null;
  speed: number | null;
  incline: number | null;
  resistance_level: number | null;
  average_heart_rate: number | null;
  maximum_heart_rate: number | null;
  machine_calories: number | null;
  estimated_calories: number | null;
  created_at: string;
}

export interface WorkoutSetRow {
  id: string;
  workout_exercise_id: string;
  set_number: number;
  set_type: string;
  weight: number | null;
  weight_unit: string | null;
  repetitions: number | null;
  duration_seconds: number | null;
  distance: number | null;
  rpe: number | null;
  rir: number | null;
  rest_seconds: number | null;
  completed: boolean;
  notes: string | null;
  created_at: string;
}

export interface WorkoutWithDetails extends Workout {
  workout_exercises: (WorkoutExerciseRow & {
    workout_sets: WorkoutSetRow[];
  })[];
}

export interface CalorieEstimate {
  low: number;
  high: number;
  best: number;
  confidence: 'high' | 'medium' | 'low';
  method: string;
  missing: string[];
}
