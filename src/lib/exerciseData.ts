import type { BuiltInExercise } from './workoutTypes';

export const BUILT_IN_EXERCISES: BuiltInExercise[] = [
  // ─── FREE WEIGHTS — CHEST ───────────────────────────────────
  { slug: 'barbell-bench-press', name: 'Barbell Bench Press', category: 'free_weights', equipment: 'barbell', primary_muscle: 'chest', secondary_muscles: ['triceps', 'shoulders'], tracking_type: 'weight_reps', default_met: 5.0, aliases: ['bench press', 'bench'] },
  { slug: 'incline-barbell-bench-press', name: 'Incline Barbell Bench Press', category: 'free_weights', equipment: 'barbell', primary_muscle: 'chest', secondary_muscles: ['triceps', 'shoulders'], tracking_type: 'weight_reps', default_met: 5.0, aliases: ['incline bench'] },
  { slug: 'dumbbell-bench-press', name: 'Dumbbell Bench Press', category: 'free_weights', equipment: 'dumbbell', primary_muscle: 'chest', secondary_muscles: ['triceps', 'shoulders'], tracking_type: 'weight_reps', default_met: 4.5, aliases: ['db bench'] },
  { slug: 'dumbbell-fly', name: 'Dumbbell Fly', category: 'free_weights', equipment: 'dumbbell', primary_muscle: 'chest', secondary_muscles: ['shoulders'], tracking_type: 'weight_reps', default_met: 4.0, aliases: ['db fly', 'chest fly'] },

  // ─── FREE WEIGHTS — SHOULDERS ───────────────────────────────
  { slug: 'dumbbell-shoulder-press', name: 'Dumbbell Shoulder Press', category: 'free_weights', equipment: 'dumbbell', primary_muscle: 'shoulders', secondary_muscles: ['triceps'], tracking_type: 'weight_reps', default_met: 4.5, aliases: ['db shoulder press', 'db ohp'] },
  { slug: 'barbell-overhead-press', name: 'Barbell Overhead Press', category: 'free_weights', equipment: 'barbell', primary_muscle: 'shoulders', secondary_muscles: ['triceps', 'abs'], tracking_type: 'weight_reps', default_met: 5.0, aliases: ['ohp', 'overhead press', 'military press', 'press'] },
  { slug: 'lateral-raise', name: 'Lateral Raise', category: 'free_weights', equipment: 'dumbbell', primary_muscle: 'shoulders', secondary_muscles: [], tracking_type: 'weight_reps', default_met: 3.5, aliases: ['side raise', 'side lateral raise'] },
  { slug: 'front-raise', name: 'Front Raise', category: 'free_weights', equipment: 'dumbbell', primary_muscle: 'shoulders', secondary_muscles: [], tracking_type: 'weight_reps', default_met: 3.5 },

  // ─── FREE WEIGHTS — BACK ────────────────────────────────────
  { slug: 'barbell-row', name: 'Barbell Row', category: 'free_weights', equipment: 'barbell', primary_muscle: 'back', secondary_muscles: ['biceps', 'forearms'], tracking_type: 'weight_reps', default_met: 5.0, aliases: ['bent over row', 'bent-over row', 'barbell bent over row'] },
  { slug: 'dumbbell-row', name: 'Dumbbell Row', category: 'free_weights', equipment: 'dumbbell', primary_muscle: 'back', secondary_muscles: ['biceps'], tracking_type: 'weight_reps', default_met: 4.5, aliases: ['one arm row', 'single arm row', 'db row'] },

  // ─── FREE WEIGHTS — LEGS ────────────────────────────────────
  { slug: 'barbell-squat', name: 'Barbell Squat', category: 'free_weights', equipment: 'barbell', primary_muscle: 'quads', secondary_muscles: ['glutes', 'hamstrings', 'abs'], tracking_type: 'weight_reps', default_met: 6.0, aliases: ['squat', 'back squat', 'barbell back squat'] },
  { slug: 'front-squat', name: 'Front Squat', category: 'free_weights', equipment: 'barbell', primary_muscle: 'quads', secondary_muscles: ['glutes', 'abs'], tracking_type: 'weight_reps', default_met: 6.0 },
  { slug: 'romanian-deadlift', name: 'Romanian Deadlift', category: 'free_weights', equipment: 'barbell', primary_muscle: 'hamstrings', secondary_muscles: ['glutes', 'back'], tracking_type: 'weight_reps', default_met: 5.5, aliases: ['rdl', 'RDL', 'romanian dl'] },
  { slug: 'conventional-deadlift', name: 'Conventional Deadlift', category: 'free_weights', equipment: 'barbell', primary_muscle: 'back', secondary_muscles: ['hamstrings', 'glutes', 'quads'], tracking_type: 'weight_reps', default_met: 6.0, aliases: ['deadlift', 'dl'] },
  { slug: 'sumo-deadlift', name: 'Sumo Deadlift', category: 'free_weights', equipment: 'barbell', primary_muscle: 'glutes', secondary_muscles: ['hamstrings', 'back', 'quads'], tracking_type: 'weight_reps', default_met: 6.0, aliases: ['sumo dl'] },
  { slug: 'lunges', name: 'Lunges', category: 'free_weights', equipment: 'dumbbell', primary_muscle: 'quads', secondary_muscles: ['glutes', 'hamstrings'], tracking_type: 'weight_reps', default_met: 4.5, aliases: ['dumbbell lunge', 'db lunge'] },
  { slug: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', category: 'free_weights', equipment: 'dumbbell', primary_muscle: 'quads', secondary_muscles: ['glutes'], tracking_type: 'weight_reps', default_met: 5.0, aliases: ['bss', 'split squat'] },
  { slug: 'hip-thrust', name: 'Hip Thrust', category: 'free_weights', equipment: 'barbell', primary_muscle: 'glutes', secondary_muscles: ['hamstrings'], tracking_type: 'weight_reps', default_met: 4.5, aliases: ['barbell hip thrust', 'glute bridge'] },
  { slug: 'calf-raise', name: 'Calf Raise', category: 'free_weights', equipment: 'dumbbell', primary_muscle: 'calves', secondary_muscles: [], tracking_type: 'weight_reps', default_met: 3.5, aliases: ['standing calf raise'] },

  // ─── FREE WEIGHTS — ARMS ────────────────────────────────────
  { slug: 'barbell-curl', name: 'Barbell Curl', category: 'free_weights', equipment: 'barbell', primary_muscle: 'biceps', secondary_muscles: ['forearms'], tracking_type: 'weight_reps', default_met: 3.5, aliases: ['biceps curl', 'barbell bicep curl', 'curl'] },
  { slug: 'dumbbell-biceps-curl', name: 'Dumbbell Biceps Curl', category: 'free_weights', equipment: 'dumbbell', primary_muscle: 'biceps', secondary_muscles: ['forearms'], tracking_type: 'weight_reps', default_met: 3.5, aliases: ['dumbbell curl', 'db curl'] },
  { slug: 'hammer-curl', name: 'Hammer Curl', category: 'free_weights', equipment: 'dumbbell', primary_muscle: 'biceps', secondary_muscles: ['forearms'], tracking_type: 'weight_reps', default_met: 3.5 },
  { slug: 'skull-crusher', name: 'Skull Crusher', category: 'free_weights', equipment: 'barbell', primary_muscle: 'triceps', secondary_muscles: [], tracking_type: 'weight_reps', default_met: 3.5, aliases: ['lying triceps extension', 'EZ bar skull crusher'] },

  // ─── FREE WEIGHTS — FUNCTIONAL ──────────────────────────────
  { slug: 'farmers-carry', name: "Farmer's Carry", category: 'free_weights', equipment: 'dumbbell', primary_muscle: 'forearms', secondary_muscles: ['full_body'], tracking_type: 'distance_weight_time', default_met: 5.0, aliases: ['farmers walk', "farmer's walk"] },
  { slug: 'kettlebell-swing', name: 'Kettlebell Swing', category: 'free_weights', equipment: 'kettlebell', primary_muscle: 'glutes', secondary_muscles: ['hamstrings', 'back', 'abs'], tracking_type: 'weight_reps', default_met: 7.0, aliases: ['kb swing'] },
  { slug: 'goblet-squat', name: 'Goblet Squat', category: 'free_weights', equipment: 'kettlebell', primary_muscle: 'quads', secondary_muscles: ['glutes', 'abs'], tracking_type: 'weight_reps', default_met: 5.0, aliases: ['kettlebell squat'] },

  // ─── MACHINES — CHEST ───────────────────────────────────────
  { slug: 'chest-press-machine', name: 'Chest Press Machine', category: 'machines', equipment: 'machine', primary_muscle: 'chest', secondary_muscles: ['triceps', 'shoulders'], tracking_type: 'weight_reps', default_met: 4.0 },
  { slug: 'pec-deck', name: 'Pec Deck', category: 'machines', equipment: 'machine', primary_muscle: 'chest', secondary_muscles: [], tracking_type: 'weight_reps', default_met: 3.5, aliases: ['pec fly', 'chest fly machine', 'butterfly machine'] },
  { slug: 'cable-fly', name: 'Cable Fly', category: 'machines', equipment: 'cable', primary_muscle: 'chest', secondary_muscles: [], tracking_type: 'weight_reps', default_met: 3.5, aliases: ['cable crossover', 'cable chest fly'] },
  { slug: 'smith-machine-bench-press', name: 'Smith Machine Bench Press', category: 'machines', equipment: 'machine', primary_muscle: 'chest', secondary_muscles: ['triceps'], tracking_type: 'weight_reps', default_met: 4.5 },

  // ─── MACHINES — SHOULDERS ───────────────────────────────────
  { slug: 'shoulder-press-machine', name: 'Shoulder Press Machine', category: 'machines', equipment: 'machine', primary_muscle: 'shoulders', secondary_muscles: ['triceps'], tracking_type: 'weight_reps', default_met: 4.0 },
  { slug: 'cable-lateral-raise', name: 'Cable Lateral Raise', category: 'machines', equipment: 'cable', primary_muscle: 'shoulders', secondary_muscles: [], tracking_type: 'weight_reps', default_met: 3.5 },

  // ─── MACHINES — BACK ────────────────────────────────────────
  { slug: 'lat-pulldown', name: 'Lat Pulldown', category: 'machines', equipment: 'cable', primary_muscle: 'back', secondary_muscles: ['biceps'], tracking_type: 'weight_reps', default_met: 4.5, aliases: ['pulldown', 'lat pull down', 'lat pull-down'] },
  { slug: 'seated-cable-row', name: 'Seated Cable Row', category: 'machines', equipment: 'cable', primary_muscle: 'back', secondary_muscles: ['biceps'], tracking_type: 'weight_reps', default_met: 4.0, aliases: ['cable row', 'cable seated row'] },
  { slug: 'assisted-pull-up', name: 'Assisted Pull-Up', category: 'machines', equipment: 'machine', primary_muscle: 'back', secondary_muscles: ['biceps'], tracking_type: 'bodyweight_reps', default_met: 4.5 },
  { slug: 'back-extension-machine', name: 'Back Extension Machine', category: 'machines', equipment: 'machine', primary_muscle: 'back', secondary_muscles: ['glutes', 'hamstrings'], tracking_type: 'weight_reps', default_met: 3.5, aliases: ['hyperextension', 'lower back machine'] },

  // ─── MACHINES — ARMS ────────────────────────────────────────
  { slug: 'cable-curl', name: 'Cable Curl', category: 'machines', equipment: 'cable', primary_muscle: 'biceps', secondary_muscles: [], tracking_type: 'weight_reps', default_met: 3.5, aliases: ['cable bicep curl'] },
  { slug: 'cable-triceps-pushdown', name: 'Cable Triceps Pushdown', category: 'machines', equipment: 'cable', primary_muscle: 'triceps', secondary_muscles: [], tracking_type: 'weight_reps', default_met: 3.5, aliases: ['tricep pushdown', 'triceps pushdown', 'tricep push down', 'cable pushdown'] },

  // ─── MACHINES — LEGS ────────────────────────────────────────
  { slug: 'leg-press', name: 'Leg Press', category: 'machines', equipment: 'machine', primary_muscle: 'quads', secondary_muscles: ['glutes', 'hamstrings'], tracking_type: 'weight_reps', default_met: 5.0 },
  { slug: 'hack-squat', name: 'Hack Squat', category: 'machines', equipment: 'machine', primary_muscle: 'quads', secondary_muscles: ['glutes'], tracking_type: 'weight_reps', default_met: 5.5 },
  { slug: 'leg-extension', name: 'Leg Extension', category: 'machines', equipment: 'machine', primary_muscle: 'quads', secondary_muscles: [], tracking_type: 'weight_reps', default_met: 4.0 },
  { slug: 'seated-leg-curl', name: 'Seated Leg Curl', category: 'machines', equipment: 'machine', primary_muscle: 'hamstrings', secondary_muscles: [], tracking_type: 'weight_reps', default_met: 4.0 },
  { slug: 'lying-leg-curl', name: 'Lying Leg Curl', category: 'machines', equipment: 'machine', primary_muscle: 'hamstrings', secondary_muscles: [], tracking_type: 'weight_reps', default_met: 4.0 },
  { slug: 'hip-abductor', name: 'Hip Abductor', category: 'machines', equipment: 'machine', primary_muscle: 'glutes', secondary_muscles: [], tracking_type: 'weight_reps', default_met: 3.5, aliases: ['hip abduction'] },
  { slug: 'hip-adductor', name: 'Hip Adductor', category: 'machines', equipment: 'machine', primary_muscle: 'glutes', secondary_muscles: [], tracking_type: 'weight_reps', default_met: 3.5, aliases: ['hip adduction', 'inner thigh machine'] },
  { slug: 'glute-kickback', name: 'Glute Kickback', category: 'machines', equipment: 'machine', primary_muscle: 'glutes', secondary_muscles: [], tracking_type: 'weight_reps', default_met: 3.5, aliases: ['cable kickback', 'donkey kick'] },
  { slug: 'smith-machine-squat', name: 'Smith Machine Squat', category: 'machines', equipment: 'machine', primary_muscle: 'quads', secondary_muscles: ['glutes'], tracking_type: 'weight_reps', default_met: 5.0 },
  { slug: 'calf-raise-machine', name: 'Calf Raise Machine', category: 'machines', equipment: 'machine', primary_muscle: 'calves', secondary_muscles: [], tracking_type: 'weight_reps', default_met: 3.5, aliases: ['seated calf raise', 'standing calf raise machine'] },

  // ─── MACHINES — CORE ────────────────────────────────────────
  { slug: 'abdominal-crunch-machine', name: 'Abdominal Crunch Machine', category: 'machines', equipment: 'machine', primary_muscle: 'abs', secondary_muscles: [], tracking_type: 'weight_reps', default_met: 3.5, aliases: ['ab crunch machine'] },

  // ─── BODYWEIGHT — UPPER ─────────────────────────────────────
  { slug: 'push-up', name: 'Push-Up', category: 'bodyweight', equipment: 'bodyweight', primary_muscle: 'chest', secondary_muscles: ['triceps', 'shoulders'], tracking_type: 'bodyweight_reps', default_met: 5.0, aliases: ['pushup', 'press-up'] },
  { slug: 'pull-up', name: 'Pull-Up', category: 'bodyweight', equipment: 'bodyweight', primary_muscle: 'back', secondary_muscles: ['biceps'], tracking_type: 'bodyweight_reps', default_met: 5.5, aliases: ['pullup'] },
  { slug: 'chin-up', name: 'Chin-Up', category: 'bodyweight', equipment: 'bodyweight', primary_muscle: 'back', secondary_muscles: ['biceps'], tracking_type: 'bodyweight_reps', default_met: 5.5, aliases: ['chinup'] },
  { slug: 'dip', name: 'Dip', category: 'bodyweight', equipment: 'bodyweight', primary_muscle: 'triceps', secondary_muscles: ['chest', 'shoulders'], tracking_type: 'bodyweight_reps', default_met: 5.0, aliases: ['tricep dip', 'parallel bar dip'] },

  // ─── BODYWEIGHT — LOWER ─────────────────────────────────────
  { slug: 'bodyweight-squat', name: 'Bodyweight Squat', category: 'bodyweight', equipment: 'bodyweight', primary_muscle: 'quads', secondary_muscles: ['glutes'], tracking_type: 'bodyweight_reps', default_met: 4.0, aliases: ['air squat', 'bw squat'] },
  { slug: 'walking-lunge', name: 'Walking Lunge', category: 'bodyweight', equipment: 'bodyweight', primary_muscle: 'quads', secondary_muscles: ['glutes', 'hamstrings'], tracking_type: 'bodyweight_reps', default_met: 4.0 },
  { slug: 'box-jump', name: 'Box Jump', category: 'bodyweight', equipment: 'other', primary_muscle: 'quads', secondary_muscles: ['glutes', 'calves'], tracking_type: 'bodyweight_reps', default_met: 7.0 },
  { slug: 'step-up', name: 'Step-Up', category: 'bodyweight', equipment: 'bodyweight', primary_muscle: 'quads', secondary_muscles: ['glutes'], tracking_type: 'bodyweight_reps', default_met: 4.5 },

  // ─── BODYWEIGHT — CORE ──────────────────────────────────────
  { slug: 'plank', name: 'Plank', category: 'bodyweight', equipment: 'bodyweight', primary_muscle: 'abs', secondary_muscles: ['full_body'], tracking_type: 'timed', default_met: 4.0 },
  { slug: 'side-plank', name: 'Side Plank', category: 'bodyweight', equipment: 'bodyweight', primary_muscle: 'abs', secondary_muscles: [], tracking_type: 'timed', default_met: 3.5 },
  { slug: 'burpee', name: 'Burpee', category: 'bodyweight', equipment: 'bodyweight', primary_muscle: 'full_body', secondary_muscles: [], tracking_type: 'bodyweight_reps', default_met: 8.0 },
  { slug: 'mountain-climber', name: 'Mountain Climber', category: 'bodyweight', equipment: 'bodyweight', primary_muscle: 'abs', secondary_muscles: ['full_body'], tracking_type: 'timed', default_met: 7.0 },
  { slug: 'sit-up', name: 'Sit-Up', category: 'bodyweight', equipment: 'bodyweight', primary_muscle: 'abs', secondary_muscles: [], tracking_type: 'bodyweight_reps', default_met: 3.5 },
  { slug: 'crunch', name: 'Crunch', category: 'bodyweight', equipment: 'bodyweight', primary_muscle: 'abs', secondary_muscles: [], tracking_type: 'bodyweight_reps', default_met: 3.5 },
  { slug: 'hanging-leg-raise', name: 'Hanging Leg Raise', category: 'bodyweight', equipment: 'bodyweight', primary_muscle: 'abs', secondary_muscles: [], tracking_type: 'bodyweight_reps', default_met: 4.0 },

  // ─── CARDIO — TREADMILL ─────────────────────────────────────
  { slug: 'treadmill-walking', name: 'Treadmill Walking', category: 'cardio', equipment: 'cardio_machine', primary_muscle: 'cardio', secondary_muscles: [], tracking_type: 'cardio_distance', default_met: 3.0, aliases: ['treadmill walk'] },
  { slug: 'treadmill-brisk-walking', name: 'Treadmill Brisk Walking', category: 'cardio', equipment: 'cardio_machine', primary_muscle: 'cardio', secondary_muscles: [], tracking_type: 'cardio_distance', default_met: 4.5, aliases: ['treadmill fast walk', 'brisk walking'] },
  { slug: 'treadmill-incline-walking', name: 'Treadmill Incline Walking', category: 'cardio', equipment: 'cardio_machine', primary_muscle: 'cardio', secondary_muscles: ['glutes', 'calves'], tracking_type: 'cardio_distance', default_met: 6.5, aliases: ['incline treadmill', 'incline walk'] },
  { slug: 'treadmill-jogging', name: 'Treadmill Jogging', category: 'cardio', equipment: 'cardio_machine', primary_muscle: 'cardio', secondary_muscles: [], tracking_type: 'cardio_distance', default_met: 7.0, aliases: ['treadmill jog', 'jogging'] },
  { slug: 'treadmill-running', name: 'Treadmill Running', category: 'cardio', equipment: 'cardio_machine', primary_muscle: 'cardio', secondary_muscles: [], tracking_type: 'cardio_distance', default_met: 10.0, aliases: ['treadmill run', 'treadmill', 'running'] },

  // ─── CARDIO — BIKE ──────────────────────────────────────────
  { slug: 'stationary-bike', name: 'Stationary Bike', category: 'cardio', equipment: 'cardio_machine', primary_muscle: 'cardio', secondary_muscles: ['quads', 'calves'], tracking_type: 'cardio_duration', default_met: 6.0, aliases: ['exercise bike', 'cycling', 'bike'] },
  { slug: 'recumbent-bike', name: 'Recumbent Bike', category: 'cardio', equipment: 'cardio_machine', primary_muscle: 'cardio', secondary_muscles: ['quads'], tracking_type: 'cardio_duration', default_met: 5.5 },
  { slug: 'spin-bike', name: 'Spin Bike', category: 'cardio', equipment: 'cardio_machine', primary_muscle: 'cardio', secondary_muscles: ['quads', 'glutes'], tracking_type: 'cardio_duration', default_met: 8.5, aliases: ['indoor cycling', 'peloton'] },

  // ─── CARDIO — OTHER MACHINES ────────────────────────────────
  { slug: 'rowing-machine', name: 'Rowing Machine', category: 'cardio', equipment: 'cardio_machine', primary_muscle: 'cardio', secondary_muscles: ['back', 'biceps', 'quads'], tracking_type: 'cardio_distance', default_met: 7.0, aliases: ['erg', 'rower', 'concept2', 'concept 2', 'row'] },
  { slug: 'elliptical', name: 'Elliptical', category: 'cardio', equipment: 'cardio_machine', primary_muscle: 'cardio', secondary_muscles: ['full_body'], tracking_type: 'cardio_duration', default_met: 6.0, aliases: ['cross trainer', 'elliptical trainer'] },
  { slug: 'stair-climber', name: 'Stair Climber', category: 'cardio', equipment: 'cardio_machine', primary_muscle: 'cardio', secondary_muscles: ['glutes', 'quads', 'calves'], tracking_type: 'cardio_duration', default_met: 9.0, aliases: ['stepmill', 'stairmaster', 'step climber'] },
  { slug: 'ski-erg', name: 'Ski Erg', category: 'cardio', equipment: 'cardio_machine', primary_muscle: 'cardio', secondary_muscles: ['back', 'abs'], tracking_type: 'cardio_distance', default_met: 8.0, aliases: ['skierg'] },
  { slug: 'assault-bike', name: 'Assault Bike', category: 'cardio', equipment: 'cardio_machine', primary_muscle: 'cardio', secondary_muscles: ['full_body'], tracking_type: 'cardio_duration', default_met: 10.0, aliases: ['air bike', 'airdyne', 'fan bike'] },
  { slug: 'step-machine', name: 'Step Machine', category: 'cardio', equipment: 'cardio_machine', primary_muscle: 'cardio', secondary_muscles: ['quads', 'calves'], tracking_type: 'cardio_duration', default_met: 8.0 },

  // ─── FUNCTIONAL ─────────────────────────────────────────────
  { slug: 'battle-ropes', name: 'Battle Ropes', category: 'functional', equipment: 'other', primary_muscle: 'full_body', secondary_muscles: ['shoulders', 'abs'], tracking_type: 'timed', default_met: 10.0, aliases: ['battle rope'] },
  { slug: 'sled-push', name: 'Sled Push', category: 'functional', equipment: 'other', primary_muscle: 'full_body', secondary_muscles: ['quads', 'glutes'], tracking_type: 'distance_weight_time', default_met: 9.0 },
  { slug: 'sled-pull', name: 'Sled Pull', category: 'functional', equipment: 'other', primary_muscle: 'full_body', secondary_muscles: ['back', 'hamstrings'], tracking_type: 'distance_weight_time', default_met: 8.0 },
  { slug: 'medicine-ball-slam', name: 'Medicine Ball Slam', category: 'functional', equipment: 'other', primary_muscle: 'full_body', secondary_muscles: ['abs', 'shoulders'], tracking_type: 'weight_reps', default_met: 8.0, aliases: ['ball slam', 'med ball slam'] },
  { slug: 'sandbag-carry', name: 'Sandbag Carry', category: 'functional', equipment: 'other', primary_muscle: 'full_body', secondary_muscles: [], tracking_type: 'distance_weight_time', default_met: 6.0 },
  { slug: 'tire-flip', name: 'Tire Flip', category: 'functional', equipment: 'other', primary_muscle: 'full_body', secondary_muscles: [], tracking_type: 'bodyweight_reps', default_met: 8.0 },
  { slug: 'jump-rope', name: 'Jump Rope', category: 'functional', equipment: 'other', primary_muscle: 'cardio', secondary_muscles: ['calves'], tracking_type: 'timed', default_met: 10.0, aliases: ['skipping rope', 'skipping', 'skip rope'] },
  { slug: 'circuit-training', name: 'Circuit Training', category: 'functional', equipment: 'other', primary_muscle: 'full_body', secondary_muscles: [], tracking_type: 'rounds', default_met: 7.0, aliases: ['circuit', 'circuits'] },
  { slug: 'hiit', name: 'HIIT', category: 'functional', equipment: 'other', primary_muscle: 'full_body', secondary_muscles: [], tracking_type: 'rounds', default_met: 10.0, aliases: ['high intensity interval training', 'interval training'] },
  { slug: 'kettlebell-circuit', name: 'Kettlebell Circuit', category: 'functional', equipment: 'kettlebell', primary_muscle: 'full_body', secondary_muscles: [], tracking_type: 'rounds', default_met: 8.0, aliases: ['kb circuit'] },
  { slug: 'agility-drills', name: 'Agility Drills', category: 'functional', equipment: 'other', primary_muscle: 'full_body', secondary_muscles: [], tracking_type: 'timed', default_met: 7.0 },

  // ─── MOBILITY ───────────────────────────────────────────────
  { slug: 'dynamic-stretching', name: 'Dynamic Stretching', category: 'mobility', equipment: 'bodyweight', primary_muscle: 'full_body', secondary_muscles: [], tracking_type: 'timed', default_met: 2.5 },
  { slug: 'static-stretching', name: 'Static Stretching', category: 'mobility', equipment: 'bodyweight', primary_muscle: 'full_body', secondary_muscles: [], tracking_type: 'timed', default_met: 2.3, aliases: ['stretching'] },
  { slug: 'foam-rolling', name: 'Foam Rolling', category: 'mobility', equipment: 'other', primary_muscle: 'full_body', secondary_muscles: [], tracking_type: 'timed', default_met: 2.5, aliases: ['foam roll', 'rolling'] },
  { slug: 'mobility-routine', name: 'Mobility Routine', category: 'mobility', equipment: 'bodyweight', primary_muscle: 'full_body', secondary_muscles: [], tracking_type: 'timed', default_met: 2.8 },
  { slug: 'yoga', name: 'Yoga', category: 'mobility', equipment: 'bodyweight', primary_muscle: 'full_body', secondary_muscles: [], tracking_type: 'timed', default_met: 3.0 },
  { slug: 'warm-up', name: 'Warm-Up', category: 'mobility', equipment: 'bodyweight', primary_muscle: 'full_body', secondary_muscles: [], tracking_type: 'timed', default_met: 3.0 },
  { slug: 'cool-down', name: 'Cool-Down', category: 'mobility', equipment: 'bodyweight', primary_muscle: 'full_body', secondary_muscles: [], tracking_type: 'timed', default_met: 2.3 },

  // ─── CLASSES & GENERAL ──────────────────────────────────────
  { slug: 'boxing-class', name: 'Boxing Class', category: 'class', equipment: 'other', primary_muscle: 'full_body', secondary_muscles: [], tracking_type: 'timed', default_met: 9.0, aliases: ['boxing', 'kickboxing'] },
  { slug: 'pilates', name: 'Pilates', category: 'class', equipment: 'bodyweight', primary_muscle: 'abs', secondary_muscles: ['full_body'], tracking_type: 'timed', default_met: 3.5 },
  { slug: 'yoga-class', name: 'Yoga Class', category: 'class', equipment: 'bodyweight', primary_muscle: 'full_body', secondary_muscles: [], tracking_type: 'timed', default_met: 3.0 },
  { slug: 'spin-class', name: 'Spin Class', category: 'class', equipment: 'cardio_machine', primary_muscle: 'cardio', secondary_muscles: [], tracking_type: 'timed', default_met: 8.5, aliases: ['cycling class', 'indoor cycling class'] },
  { slug: 'functional-fitness-class', name: 'Functional Fitness Class', category: 'class', equipment: 'other', primary_muscle: 'full_body', secondary_muscles: [], tracking_type: 'timed', default_met: 8.0, aliases: ['crossfit', 'functional class'] },
  { slug: 'dance-fitness', name: 'Dance Fitness', category: 'class', equipment: 'bodyweight', primary_muscle: 'full_body', secondary_muscles: [], tracking_type: 'timed', default_met: 7.0, aliases: ['zumba', 'dance class'] },
  { slug: 'swimming', name: 'Swimming', category: 'class', equipment: 'other', primary_muscle: 'full_body', secondary_muscles: [], tracking_type: 'cardio_distance', default_met: 8.0 },
  { slug: 'indoor-climbing', name: 'Indoor Climbing', category: 'class', equipment: 'other', primary_muscle: 'back', secondary_muscles: ['forearms', 'biceps', 'full_body'], tracking_type: 'timed', default_met: 7.5, aliases: ['rock climbing', 'bouldering', 'climbing'] },
  { slug: 'martial-arts', name: 'Martial Arts', category: 'class', equipment: 'bodyweight', primary_muscle: 'full_body', secondary_muscles: [], tracking_type: 'timed', default_met: 7.0, aliases: ['mma', 'jiu jitsu', 'bjj', 'karate', 'muay thai'] },
  { slug: 'general-gym-workout', name: 'General Gym Workout', category: 'class', equipment: 'other', primary_muscle: 'full_body', secondary_muscles: [], tracking_type: 'timed', default_met: 4.5, aliases: ['gym session', 'general workout'] },
];

export function searchExercises(query: string, extras: import('./workoutTypes').CustomExercise[] = []): (BuiltInExercise | import('./workoutTypes').CustomExercise)[] {
  const q = query.toLowerCase().trim();
  if (!q) return [...BUILT_IN_EXERCISES, ...extras];

  const score = (ex: BuiltInExercise | import('./workoutTypes').CustomExercise): number => {
    const name = ex.name.toLowerCase();
    if (name === q) return 100;
    if (name.startsWith(q)) return 80;
    if (name.includes(q)) return 60;
    const slug = 'slug' in ex ? (ex.slug ?? '') : '';
    if (slug.includes(q)) return 50;
    const aliases = 'aliases' in ex ? (ex.aliases ?? []) : [];
    if (aliases.some((a: string) => a.toLowerCase().includes(q))) return 40;
    return 0;
  };

  return [...BUILT_IN_EXERCISES, ...extras]
    .map(ex => ({ ex, s: score(ex) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s)
    .map(({ ex }) => ex);
}

export const CATEGORY_LABELS: Record<string, string> = {
  free_weights: 'Free Weights',
  machines: 'Machines',
  bodyweight: 'Bodyweight',
  cardio: 'Cardio',
  functional: 'Functional',
  mobility: 'Mobility',
  class: 'Classes',
};

export const MUSCLE_LABELS: Record<string, string> = {
  chest: 'Chest',
  back: 'Back',
  shoulders: 'Shoulders',
  biceps: 'Biceps',
  triceps: 'Triceps',
  forearms: 'Forearms',
  quads: 'Quads',
  hamstrings: 'Hamstrings',
  glutes: 'Glutes',
  calves: 'Calves',
  abs: 'Abs',
  full_body: 'Full Body',
  cardio: 'Cardio',
};

export const EQUIPMENT_LABELS: Record<string, string> = {
  barbell: 'Barbell',
  dumbbell: 'Dumbbell',
  kettlebell: 'Kettlebell',
  machine: 'Machine',
  cable: 'Cable',
  bodyweight: 'Bodyweight',
  cardio_machine: 'Cardio Machine',
  band: 'Band',
  other: 'Other',
};
