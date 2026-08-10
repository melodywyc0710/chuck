import { create } from 'zustand';
import type { ActiveExercise, ActiveSet, ActiveWorkoutSession, BuiltInExercise, CustomExercise, SetType } from '../lib/workoutTypes';

function uuid(): string {
  return crypto.randomUUID();
}

function makeDefaultSet(setNumber: number, prevSet?: ActiveSet): ActiveSet {
  return {
    id: uuid(),
    set_number: setNumber,
    set_type: prevSet?.set_type ?? 'working',
    weight: prevSet?.weight ?? '',
    repetitions: prevSet?.repetitions ?? '',
    duration_seconds: prevSet?.duration_seconds ?? '',
    distance: prevSet?.distance ?? '',
    rpe: null,
    rir: null,
    rest_seconds: null,
    completed: false,
    notes: '',
  };
}

function makeExercise(ex: BuiltInExercise | CustomExercise, order: number): ActiveExercise {
  return {
    id: uuid(),
    exercise: ex,
    exercise_order: order,
    sets: [makeDefaultSet(1)],
    notes: '',
    duration_seconds: '',
    distance: '',
    distance_unit: 'km',
    speed: '',
    incline: '',
    resistance_level: '',
    average_heart_rate: '',
    maximum_heart_rate: '',
    machine_calories: '',
  };
}

interface RestTimer {
  total: number;
  remaining: number;
  running: boolean;
  intervalId: ReturnType<typeof setInterval> | null;
}

interface WorkoutState {
  active: ActiveWorkoutSession | null;
  restTimer: RestTimer | null;
}

interface WorkoutActions {
  startWorkout: (name?: string) => void;
  addExercise: (exercise: BuiltInExercise | CustomExercise) => void;
  removeExercise: (exerciseId: string) => void;
  reorderExercises: (fromIndex: number, toIndex: number) => void;
  updateExerciseNotes: (exerciseId: string, notes: string) => void;
  updateCardioField: (exerciseId: string, field: keyof ActiveExercise, value: string) => void;
  addSet: (exerciseId: string) => void;
  duplicateLastSet: (exerciseId: string) => void;
  updateSet: (exerciseId: string, setId: string, updates: Partial<ActiveSet>) => void;
  removeSet: (exerciseId: string, setId: string) => void;
  toggleSetComplete: (exerciseId: string, setId: string) => void;
  updateWorkoutName: (name: string) => void;
  updateWorkoutNotes: (notes: string) => void;
  setEffortRating: (rating: number) => void;
  setLinkedPromise: (id: string | null) => void;
  discardWorkout: () => void;
  getSnapshot: () => ActiveWorkoutSession | null;

  startRestTimer: (seconds: number) => void;
  pauseResumeRestTimer: () => void;
  stopRestTimer: () => void;
  addRestTime: (seconds: number) => void;
}

export const useWorkoutStore = create<WorkoutState & WorkoutActions>((set, get) => ({
  active: null,
  restTimer: null,

  startWorkout: (name = 'Workout') => {
    set({
      active: {
        id: uuid(),
        name,
        started_at: new Date(),
        exercises: [],
        notes: '',
        effort_rating: null,
        linked_promise_id: null,
      },
    });
  },

  addExercise: (exercise) => {
    const { active } = get();
    if (!active) return;
    const order = active.exercises.length;
    set({
      active: {
        ...active,
        exercises: [...active.exercises, makeExercise(exercise, order)],
      },
    });
  },

  removeExercise: (exerciseId) => {
    const { active } = get();
    if (!active) return;
    set({
      active: {
        ...active,
        exercises: active.exercises
          .filter(e => e.id !== exerciseId)
          .map((e, i) => ({ ...e, exercise_order: i })),
      },
    });
  },

  reorderExercises: (fromIndex, toIndex) => {
    const { active } = get();
    if (!active) return;
    const exs = [...active.exercises];
    const [moved] = exs.splice(fromIndex, 1);
    exs.splice(toIndex, 0, moved);
    set({ active: { ...active, exercises: exs.map((e, i) => ({ ...e, exercise_order: i })) } });
  },

  updateExerciseNotes: (exerciseId, notes) => {
    const { active } = get();
    if (!active) return;
    set({
      active: {
        ...active,
        exercises: active.exercises.map(e => e.id === exerciseId ? { ...e, notes } : e),
      },
    });
  },

  updateCardioField: (exerciseId, field, value) => {
    const { active } = get();
    if (!active) return;
    set({
      active: {
        ...active,
        exercises: active.exercises.map(e =>
          e.id === exerciseId ? { ...e, [field]: value } : e,
        ),
      },
    });
  },

  addSet: (exerciseId) => {
    const { active } = get();
    if (!active) return;
    set({
      active: {
        ...active,
        exercises: active.exercises.map(e => {
          if (e.id !== exerciseId) return e;
          const prev = e.sets[e.sets.length - 1];
          return { ...e, sets: [...e.sets, makeDefaultSet(e.sets.length + 1, prev)] };
        }),
      },
    });
  },

  duplicateLastSet: (exerciseId) => {
    const { active } = get();
    if (!active) return;
    set({
      active: {
        ...active,
        exercises: active.exercises.map(e => {
          if (e.id !== exerciseId) return e;
          const prev = e.sets[e.sets.length - 1];
          if (!prev) return e;
          return {
            ...e,
            sets: [...e.sets, { ...prev, id: uuid(), set_number: e.sets.length + 1, completed: false }],
          };
        }),
      },
    });
  },

  updateSet: (exerciseId, setId, updates) => {
    const { active } = get();
    if (!active) return;
    set({
      active: {
        ...active,
        exercises: active.exercises.map(e =>
          e.id !== exerciseId ? e : {
            ...e,
            sets: e.sets.map(s => s.id === setId ? { ...s, ...updates } : s),
          },
        ),
      },
    });
  },

  removeSet: (exerciseId, setId) => {
    const { active } = get();
    if (!active) return;
    set({
      active: {
        ...active,
        exercises: active.exercises.map(e =>
          e.id !== exerciseId ? e : {
            ...e,
            sets: e.sets
              .filter(s => s.id !== setId)
              .map((s, i) => ({ ...s, set_number: i + 1 })),
          },
        ),
      },
    });
  },

  toggleSetComplete: (exerciseId, setId) => {
    const { active } = get();
    if (!active) return;
    set({
      active: {
        ...active,
        exercises: active.exercises.map(e =>
          e.id !== exerciseId ? e : {
            ...e,
            sets: e.sets.map(s => s.id === setId ? { ...s, completed: !s.completed } : s),
          },
        ),
      },
    });
  },

  updateWorkoutName: (name) => {
    const { active } = get();
    if (!active) return;
    set({ active: { ...active, name } });
  },

  updateWorkoutNotes: (notes) => {
    const { active } = get();
    if (!active) return;
    set({ active: { ...active, notes } });
  },

  setEffortRating: (rating) => {
    const { active } = get();
    if (!active) return;
    set({ active: { ...active, effort_rating: rating } });
  },

  setLinkedPromise: (id) => {
    const { active } = get();
    if (!active) return;
    set({ active: { ...active, linked_promise_id: id } });
  },

  discardWorkout: () => {
    const { restTimer } = get();
    if (restTimer?.intervalId) clearInterval(restTimer.intervalId);
    set({ active: null, restTimer: null });
  },

  getSnapshot: () => get().active,

  startRestTimer: (seconds) => {
    const { restTimer } = get();
    if (restTimer?.intervalId) clearInterval(restTimer.intervalId);
    const intervalId = setInterval(() => {
      const { restTimer: rt } = get();
      if (!rt || !rt.running) return;
      const next = rt.remaining - 1;
      if (next <= 0) {
        clearInterval(rt.intervalId!);
        set({ restTimer: { ...rt, remaining: 0, running: false, intervalId: null } });
      } else {
        set({ restTimer: { ...rt, remaining: next } });
      }
    }, 1000);
    set({ restTimer: { total: seconds, remaining: seconds, running: true, intervalId } });
  },

  pauseResumeRestTimer: () => {
    const { restTimer } = get();
    if (!restTimer) return;
    if (restTimer.running) {
      if (restTimer.intervalId) clearInterval(restTimer.intervalId);
      set({ restTimer: { ...restTimer, running: false, intervalId: null } });
    } else {
      const intervalId = setInterval(() => {
        const { restTimer: rt } = get();
        if (!rt || !rt.running) return;
        const next = rt.remaining - 1;
        if (next <= 0) {
          clearInterval(rt.intervalId!);
          set({ restTimer: { ...rt, remaining: 0, running: false, intervalId: null } });
        } else {
          set({ restTimer: { ...rt, remaining: next } });
        }
      }, 1000);
      set({ restTimer: { ...restTimer, running: true, intervalId } });
    }
  },

  stopRestTimer: () => {
    const { restTimer } = get();
    if (restTimer?.intervalId) clearInterval(restTimer.intervalId);
    set({ restTimer: null });
  },

  addRestTime: (seconds) => {
    const { restTimer } = get();
    if (!restTimer) return;
    set({ restTimer: { ...restTimer, remaining: restTimer.remaining + seconds, total: restTimer.total + seconds } });
  },
}));

export type { SetType };
