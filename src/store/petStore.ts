import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MBTIType } from '../data/creatures';

export interface CustomGoal {
  id: string;
  label: string;
  emoji: string;
  xpReward: number; // 20 | 40 | 80
}

export interface PetState {
  mbtiType: MBTIType | null;
  petName: string;
  level: number;
  xp: number;
  xpToNext: number;
  happiness: number;
  goals: CustomGoal[];
  completedGoals: Record<string, string[]>; // dateKey -> goalIds
  feedCooldown: number;
  playCooldown: number;
  restCooldown: number;
  isLevelingUp: boolean;
}

export interface PetActions {
  selectMBTI: (type: MBTIType, name: string) => void;
  feed: () => void;
  play: () => void;
  rest: () => void;
  addGoal: (goal: Omit<CustomGoal, 'id'>) => void;
  removeGoal: (id: string) => void;
  completeGoal: (dateKey: string, goalId: string, xp: number) => void;
  gainXP: (amount: number) => void;
  resetPet: () => void;
}

const XP_BASE = 100;
const xpForLevel = (level: number) => Math.floor(XP_BASE * Math.pow(1.4, level - 1));
const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

const DEFAULT_GOALS: CustomGoal[] = [
  { id: 'default-1', label: 'Drink enough water today', emoji: '💧', xpReward: 20 },
  { id: 'default-2', label: 'Move my body for 20 min', emoji: '🏃', xpReward: 40 },
  { id: 'default-3', label: 'Read or learn something new', emoji: '📚', xpReward: 40 },
];

const initialState: PetState = {
  mbtiType: null,
  petName: '',
  level: 1,
  xp: 0,
  xpToNext: XP_BASE,
  happiness: 80,
  goals: DEFAULT_GOALS,
  completedGoals: {},
  feedCooldown: 0,
  playCooldown: 0,
  restCooldown: 0,
  isLevelingUp: false,
};

export const usePetStore = create<PetState & PetActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      selectMBTI: (type, name) => set({
        ...initialState,
        mbtiType: type,
        petName: name || 'My Pet',
      }),

      gainXP: (amount) => {
        const state = get();
        let { xp, level, xpToNext } = state;
        xp += amount;
        let leveled = false;
        while (xp >= xpToNext) {
          xp -= xpToNext;
          level += 1;
          xpToNext = xpForLevel(level);
          leveled = true;
        }
        set({ xp, level, xpToNext, isLevelingUp: leveled });
        if (leveled) setTimeout(() => set({ isLevelingUp: false }), 2500);
      },

      feed: () => {
        const now = Date.now();
        const state = get();
        if (now < state.feedCooldown) return;
        set({
          happiness: clamp(state.happiness + 8, 0, 100),
          feedCooldown: now + 30_000,
        });
        get().gainXP(15);
      },

      play: () => {
        const now = Date.now();
        const state = get();
        if (now < state.playCooldown) return;
        set({
          happiness: clamp(state.happiness + 20, 0, 100),
          playCooldown: now + 45_000,
        });
        get().gainXP(30);
      },

      rest: () => {
        const now = Date.now();
        const state = get();
        if (now < state.restCooldown) return;
        set({
          happiness: clamp(state.happiness + 12, 0, 100),
          restCooldown: now + 60_000,
        });
        get().gainXP(10);
      },

      addGoal: (goal) => {
        const id = `goal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        set(state => ({ goals: [...state.goals, { ...goal, id }] }));
      },

      removeGoal: (id) => {
        set(state => ({ goals: state.goals.filter(g => g.id !== id) }));
      },

      completeGoal: (dateKey, goalId, xp) => {
        const state = get();
        const done = state.completedGoals[dateKey] ?? [];
        if (done.includes(goalId)) return;
        set({
          completedGoals: {
            ...state.completedGoals,
            [dateKey]: [...done, goalId],
          },
          happiness: clamp(state.happiness + 15, 0, 100),
        });
        get().gainXP(xp);
      },

      resetPet: () => set({ ...initialState }),
    }),
    { name: 'mystic-companions-v2' }
  )
);
