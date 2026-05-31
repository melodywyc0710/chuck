import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MBTIType } from '../data/creatures';

export interface PetState {
  mbtiType: MBTIType | null;
  petName: string;
  level: number;
  xp: number;
  xpToNext: number;
  hp: number;
  maxHp: number;
  happiness: number;
  completedTasks: Record<string, string[]>; // dateKey -> taskIds
  lastInteraction: number;
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
  completeTask: (dateKey: string, taskId: string, xp: number, happiness: number) => void;
  gainXP: (amount: number) => void;
  tick: () => void;
  resetPet: () => void;
}

const XP_BASE = 100;
const xpForLevel = (level: number) => Math.floor(XP_BASE * Math.pow(1.4, level - 1));

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

const initialState: PetState = {
  mbtiType: null,
  petName: '',
  level: 1,
  xp: 0,
  xpToNext: XP_BASE,
  hp: 100,
  maxHp: 100,
  happiness: 80,
  completedTasks: {},
  lastInteraction: Date.now(),
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
        lastInteraction: Date.now(),
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
        if (leveled) setTimeout(() => set({ isLevelingUp: false }), 2000);
      },

      feed: () => {
        const now = Date.now();
        const state = get();
        if (now < state.feedCooldown) return;
        set({
          hp: clamp(state.hp + 20, 0, state.maxHp),
          happiness: clamp(state.happiness + 5, 0, 100),
          feedCooldown: now + 30_000,
          lastInteraction: now,
        });
        get().gainXP(15);
      },

      play: () => {
        const now = Date.now();
        const state = get();
        if (now < state.playCooldown) return;
        set({
          happiness: clamp(state.happiness + 25, 0, 100),
          hp: clamp(state.hp - 5, 0, state.maxHp),
          playCooldown: now + 45_000,
          lastInteraction: now,
        });
        get().gainXP(30);
      },

      rest: () => {
        const now = Date.now();
        const state = get();
        if (now < state.restCooldown) return;
        set({
          hp: clamp(state.hp + 30, 0, state.maxHp),
          happiness: clamp(state.happiness - 5, 0, 100),
          restCooldown: now + 60_000,
          lastInteraction: now,
        });
        get().gainXP(10);
      },

      completeTask: (dateKey, taskId, xpReward, happinessReward) => {
        const state = get();
        const todayTasks = state.completedTasks[dateKey] ?? [];
        if (todayTasks.includes(taskId)) return;
        set({
          completedTasks: {
            ...state.completedTasks,
            [dateKey]: [...todayTasks, taskId],
          },
          happiness: clamp(state.happiness + happinessReward, 0, 100),
        });
        get().gainXP(xpReward);
      },

      tick: () => {
        const state = get();
        const elapsed = (Date.now() - state.lastInteraction) / 1000 / 60; // minutes
        if (elapsed > 5) {
          set({
            happiness: clamp(state.happiness - 0.5, 0, 100),
            hp: clamp(state.hp - 0.2, 0, state.maxHp),
            lastInteraction: Date.now(),
          });
        }
      },

      resetPet: () => set({ ...initialState }),
    }),
    { name: 'fantasy-pet-store' }
  )
);
