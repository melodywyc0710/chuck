export interface DailyTask {
  id: string;
  label: string;
  emoji: string;
  xpReward: number;
  happinessReward: number;
}

export const DAILY_TASKS: DailyTask[] = [
  { id: 'hydrate', label: 'Drink 8 glasses of water', emoji: '💧', xpReward: 30, happinessReward: 10 },
  { id: 'exercise', label: 'Exercise for 30 minutes', emoji: '🏃', xpReward: 60, happinessReward: 20 },
  { id: 'read', label: 'Read for 20 minutes', emoji: '📚', xpReward: 40, happinessReward: 15 },
  { id: 'sleep', label: 'Sleep 7+ hours', emoji: '😴', xpReward: 50, happinessReward: 25 },
  { id: 'journal', label: 'Write in your journal', emoji: '📝', xpReward: 35, happinessReward: 15 },
  { id: 'meditate', label: 'Meditate for 10 minutes', emoji: '🧘', xpReward: 40, happinessReward: 20 },
  { id: 'healthy_meal', label: 'Eat a healthy meal', emoji: '🥗', xpReward: 30, happinessReward: 10 },
  { id: 'connect', label: 'Connect with a friend', emoji: '🤝', xpReward: 45, happinessReward: 25 },
];

export function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}
