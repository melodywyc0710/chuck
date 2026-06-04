// Weekly lesson unlock system — baseline week 1 starts June 4, 2026
const BASELINE = new Date('2026-06-04T00:00:00+10:00').getTime();
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

export function currentWeekNumber(): number {
  const now = Date.now();
  if (now < BASELINE) return 0;
  return Math.floor((now - BASELINE) / MS_PER_WEEK) + 1;
}

export function isSessionUnlocked(weekNumber: number | undefined): boolean {
  if (weekNumber === undefined) return true;
  return weekNumber <= currentWeekNumber();
}

export function unlockDateForWeek(week: number): Date {
  return new Date(BASELINE + (week - 1) * MS_PER_WEEK);
}

export function formatUnlockDate(week: number): string {
  const d = unlockDateForWeek(week);
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}
