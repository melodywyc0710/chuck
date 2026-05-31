import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Subject = 'english' | 'maths' | 'science' | 'hass';
export type Mascot = 'owl' | 'fox' | 'panda';
export type Density = 'younger' | 'older';
export type View = 'home' | 'lesson' | 'rewards' | 'teacher' | 'summary' | 'setup';

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
}

export interface AppActions {
  setView: (v: View) => void;
  setupProfile: (p: StudentProfile) => void;
  setActiveSubject: (s: Subject) => void;
  setActiveYearLevel: (y: 4 | 5 | 6) => void;
  startSession: (sessionId: string) => void;
  goToStep: (index: number) => void;
  recordAnswer: (stepId: string, answer: string | string[]) => void;
  recordScore: (correct: boolean) => void;
  finishSession: (result: Omit<SessionResult, 'completedAt'>) => void;
  buyItem: (itemId: string, cost: number) => void;
  togglePlaced: (itemId: string) => void;
  reset: () => void;
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
};

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      ...defaultState,

      setView: (v) => set({ view: v }),

      setupProfile: (p) => set({ profile: p, view: 'home' }),

      setActiveSubject: (s) => set({ activeSubject: s }),

      setActiveYearLevel: (y) => set({ activeYearLevel: y, activeSubject: 'english' }),

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

      finishSession: (result) => {
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
          view: 'summary',
        }));
      },

      buyItem: (itemId, cost) => {
        const state = get();
        if (state.totalStars < cost) return;
        set(s => ({
          totalStars: s.totalStars - cost,
          ownedItems: [...new Set([...s.ownedItems, itemId])],
        }));
      },

      togglePlaced: (itemId) =>
        set(s => ({
          placedItems: s.placedItems.includes(itemId)
            ? s.placedItems.filter(i => i !== itemId)
            : [...s.placedItems, itemId],
        })),

      reset: () => set(defaultState),
    }),
    { name: 'learn4-app-v1' }
  )
);
