import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BADGES } from '../data/badges';

export type Subject = 'english' | 'maths' | 'science' | 'hass';
export type Mascot = 'owl' | 'fox' | 'panda';
export type Density = 'younger' | 'older';
export type View = 'home' | 'lesson' | 'rewards' | 'teacher' | 'summary' | 'setup' | 'feedback' | 'revision' | 'games' | 'homework';

export interface StudentProfile {
  name: string;
  mascot: Mascot;
  density: Density;
  colorTheme: 'purple' | 'blue' | 'green' | 'orange';
}

export interface SessionResult {
  sessionId: string;
  subject: Subject;
  completedAt: string;
  score: number;           // correct answers
  total: number;           // total questions
  starsEarned: number;
  freeResponses: Record<string, string>;   // stepId -> answer
  homeworkSet: boolean;
  timeSpentMinutes: number;
}

export interface RoomItem {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  category: 'furniture' | 'pet' | 'decoration' | 'window';
  unlocked: boolean;
  placed: boolean;
}

export interface FarmPlot {
  id: string;          // 'plot-0' .. 'plot-5'
  animalId: string | null;
  placedAt: string;    // ISO datetime when animal was placed
}

export interface AppState {
  view: View;
  profile: StudentProfile | null;
  activeSubject: Subject;
  activeYearLevel: 4 | 5 | 6;
  activeSessionId: string | null;
  currentStepIndex: number;
  sessionStartTime: number;
  totalStars: number;
  completedSessions: string[];
  sessionResults: SessionResult[];
  ownedItems: string[];
  placedItems: string[];
  currentAnswers: Record<string, string | string[]>;
  currentScore: { correct: number; total: number };
  currentStreak: number;
  lastActiveDate: string; // ISO date string YYYY-MM-DD
  itemPositions: Record<string, { x: number; y: number }>;
  itemQuantities: Record<string, number>;
  farmPlots: FarmPlot[];
  lastFarmCollect: string; // ISO datetime
  farmStarsPending: number;
  unlockedBadges: string[];
}

export interface AppActions {
  setView: (v: View) => void;
  setupProfile: (p: StudentProfile) => void;
  setActiveSubject: (s: Subject) => void;
  setActiveYearLevel: (y: 4 | 5 | 6) => void;
  setActiveSessionId: (id: string) => void;
  startSession: (sessionId: string) => void;
  goToStep: (index: number) => void;
  recordAnswer: (stepId: string, answer: string | string[]) => void;
  recordScore: (correct: boolean) => void;
  finishSession: (result: Omit<SessionResult, 'completedAt'>) => void;
  updateStreak: () => void;
  buyItem: (itemId: string, cost: number) => void;
  togglePlaced: (itemId: string) => void;
  reset: () => void;
  setItemPosition: (itemId: string, pos: { x: number; y: number }) => void;
  placeFarmAnimal: (plotId: string, animalId: string) => void;
  removeFarmAnimal: (plotId: string) => void;
  collectFarmStars: () => void;
  unlockBadge: (id: string) => void;
  previewFeedback: (sessionId: string, score: number, total: number) => void;
}

function isoWeek(date: Date): string {
  const d = new Date(date);
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  return `${d.getFullYear()}-W${String(1 + Math.round(((d.getTime()-week1.getTime())/86400000 - 3 + ((week1.getDay()+6)%7)) / 7)).padStart(2,'0')}`;
}

const defaultState: AppState = {
  view: 'setup',
  profile: null,
  activeSubject: 'english',
  activeYearLevel: 4,
  activeSessionId: null,
  currentStepIndex: 0,
  sessionStartTime: 0,
  totalStars: 5, // start with a few so room isn't empty
  completedSessions: [],
  sessionResults: [],
  ownedItems: ['bed', 'rug'],
  placedItems: ['bed', 'rug'],
  currentAnswers: {},
  currentScore: { correct: 0, total: 0 },
  currentStreak: 0,
  lastActiveDate: '',
  itemPositions: {},
  itemQuantities: {},
  farmPlots: [
    { id: 'plot-0', animalId: null, placedAt: '' },
    { id: 'plot-1', animalId: null, placedAt: '' },
    { id: 'plot-2', animalId: null, placedAt: '' },
    { id: 'plot-3', animalId: null, placedAt: '' },
    { id: 'plot-4', animalId: null, placedAt: '' },
    { id: 'plot-5', animalId: null, placedAt: '' },
  ],
  lastFarmCollect: '',
  farmStarsPending: 0,
  unlockedBadges: [],
};

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      ...defaultState,

      setView: (v) => set({ view: v }),

      setupProfile: (p) => set({ profile: p, view: 'home' }),

      setActiveSubject: (s) => set({ activeSubject: s }),

      setActiveYearLevel: (y) => set({ activeYearLevel: y, activeSubject: 'english' }),

      setActiveSessionId: (id) => set({ activeSessionId: id }),

      startSession: (sessionId) => set({
        activeSessionId: sessionId,
        currentStepIndex: 0,
        currentAnswers: {},
        currentScore: { correct: 0, total: 0 },
        sessionStartTime: Date.now(),
        view: 'lesson',
      }),

      goToStep: (index) => set({ currentStepIndex: index }),

      recordAnswer: (stepId, answer) =>
        set(s => ({ currentAnswers: { ...s.currentAnswers, [stepId]: answer } })),

      recordScore: (correct) =>
        set(s => ({
          currentScore: {
            correct: s.currentScore.correct + (correct ? 1 : 0),
            total: s.currentScore.total + 1,
          },
        })),

      updateStreak: () => {
        const state = get();
        const today = new Date();
        const todayStr = today.toISOString().slice(0, 10);
        if (state.lastActiveDate === todayStr) return;
        const todayWeek = isoWeek(today);
        const lastWeek = state.lastActiveDate ? isoWeek(new Date(state.lastActiveDate)) : '';
        const prevWeek = isoWeek(new Date(Date.now() - 7 * 86400000));
        if (lastWeek === todayWeek) {
          // same week, just update date
          set({ lastActiveDate: todayStr });
        } else if (lastWeek === prevWeek) {
          set({ currentStreak: state.currentStreak + 1, lastActiveDate: todayStr });
        } else {
          set({ currentStreak: 1, lastActiveDate: todayStr });
        }
      },

      finishSession: (result) => {
        get().updateStreak();
        const state = get();
        const minutes = Math.round((Date.now() - state.sessionStartTime) / 60000);
        const full: SessionResult = {
          ...result,
          completedAt: new Date().toISOString(),
          timeSpentMinutes: minutes,
        };
        const starsEarned = result.starsEarned;
        set(s => ({
          totalStars: s.totalStars + starsEarned,
          completedSessions: [...new Set([...s.completedSessions, result.sessionId])],
          sessionResults: [...s.sessionResults, full],
          view: 'feedback',
        }));
        const newState = get();
        BADGES.forEach(badge => {
          if (!newState.unlockedBadges.includes(badge.id) && badge.check(newState)) {
            get().unlockBadge(badge.id);
          }
        });
      },

      buyItem: (itemId, cost) => {
        const state = get();
        if (state.totalStars < cost) return;
        set(s => ({
          totalStars: s.totalStars - cost,
          ownedItems: s.ownedItems.includes(itemId) ? s.ownedItems : [...s.ownedItems, itemId],
          itemQuantities: { ...s.itemQuantities, [itemId]: (s.itemQuantities[itemId] ?? 0) + 1 },
        }));
      },

      togglePlaced: (itemId) =>
        set(s => ({
          placedItems: s.placedItems.includes(itemId)
            ? s.placedItems.filter(i => i !== itemId)
            : [...s.placedItems, itemId],
        })),

      reset: () => set(defaultState),

      setItemPosition: (itemId, pos) =>
        set(s => ({ itemPositions: { ...s.itemPositions, [itemId]: pos } })),

      placeFarmAnimal: (plotId, animalId) =>
        set(s => ({
          farmPlots: s.farmPlots.map(p =>
            p.id === plotId ? { ...p, animalId, placedAt: new Date().toISOString() } : p
          ),
        })),

      removeFarmAnimal: (plotId) =>
        set(s => ({
          farmPlots: s.farmPlots.map(p =>
            p.id === plotId ? { ...p, animalId: null, placedAt: '' } : p
          ),
        })),

      unlockBadge: (id) => set(s => ({ unlockedBadges: [...new Set([...s.unlockedBadges, id])] })),

      collectFarmStars: () => {
        const state = get();
        const RATES: Record<string, number> = { chicken: 2, sheep: 5, cow: 10, horse: 20 };
        const now = Date.now();
        let earned = 0;
        state.farmPlots.forEach(plot => {
          if (!plot.animalId || !plot.placedAt) return;
          const hoursElapsed = (now - new Date(plot.placedAt).getTime()) / 3600000;
          earned += Math.floor(hoursElapsed * (RATES[plot.animalId] ?? 2));
        });
        if (earned > 0) {
          set(s => ({
            totalStars: s.totalStars + earned,
            farmPlots: s.farmPlots.map(p => ({ ...p, placedAt: p.animalId ? new Date().toISOString() : '' })),
            lastFarmCollect: new Date().toISOString(),
          }));
        }
      },

      previewFeedback: (sessionId, score, total) =>
        set({ activeSessionId: sessionId, currentScore: { correct: score, total }, view: 'feedback' }),
    }),
    { name: 'learn4-app-v1' }
  )
);
