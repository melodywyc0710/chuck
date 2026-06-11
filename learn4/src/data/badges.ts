export interface Badge {
  id: string; name: string; emoji: string; description: string;
  check: (state: { completedSessions: string[]; totalStars: number; currentStreak: number; sessionResults: any[] }) => boolean;
}
export const BADGES: Badge[] = [
  { id: 'first-lesson', name: 'First Step', emoji: '🎓', description: 'Complete your very first lesson', check: s => s.completedSessions.length >= 1 },
  { id: 'three-lessons', name: 'On a Roll', emoji: '🎯', description: 'Complete 3 lessons', check: s => s.completedSessions.length >= 3 },
  { id: 'ten-lessons', name: 'Dedicated Learner', emoji: '📚', description: 'Complete 10 lessons', check: s => s.completedSessions.length >= 10 },
  { id: 'fifty-stars', name: 'Star Collector', emoji: '⭐', description: 'Earn 50 stars total', check: s => s.totalStars >= 50 },
  { id: 'hundred-stars', name: 'Star Champion', emoji: '🌟', description: 'Earn 100 stars total', check: s => s.totalStars >= 100 },
  { id: 'week-streak', name: 'Consistent', emoji: '🔥', description: 'Keep a 2-week streak', check: s => s.currentStreak >= 2 },
  { id: 'perfect-score', name: 'Perfect!', emoji: '💯', description: 'Score 100% on any lesson', check: s => s.sessionResults.some((r: any) => r.total > 0 && r.score === r.total) },
  { id: 'maths-master', name: 'Maths Master', emoji: '🔢', description: 'Complete 5 maths lessons', check: s => s.sessionResults.filter((r: any) => r.subject === 'maths').length >= 5 },
  { id: 'english-expert', name: 'English Expert', emoji: '✍️', description: 'Complete 5 English lessons', check: s => s.sessionResults.filter((r: any) => r.subject === 'english').length >= 5 },
  { id: 'farm-friend', name: 'Farm Friend', emoji: '🐄', description: 'Place your first farm animal', check: _s => false }, // triggered manually
];
