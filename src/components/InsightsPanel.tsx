import { useMemo } from 'react';
import { TrendingUp, Lightbulb, Flame, AlertTriangle, Award } from 'lucide-react';
import type { Habit, HabitLog } from '../lib/habitTypes';

interface Props {
  categoryName: string;
  habits: Habit[];
  logs: HabitLog[];
  color: string;
}

interface Insight {
  type: 'streak' | 'pattern' | 'recommendation' | 'drop_off';
  title: string;
  body: string;
}

const ICON: Record<string, React.ElementType> = {
  pattern:        TrendingUp,
  recommendation: Lightbulb,
  streak:         Flame,
  drop_off:       AlertTriangle,
};
const COLOR: Record<string, string> = {
  pattern:        '#3D8EFF',
  recommendation: '#F59E0B',
  streak:         '#10B981',
  drop_off:       '#EF4444',
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function computeInsights(habits: Habit[], logs: HabitLog[]): { summary: string; insights: Insight[] } {
  if (habits.length === 0 || logs.length < 7) return { summary: '', insights: [] };

  // Build per-habit log sets (date_key strings)
  const habitDates = new Map<string, Set<string>>();
  for (const h of habits) habitDates.set(h.id, new Set());
  for (const l of logs) habitDates.get(l.habit_id)?.add(l.date_key);

  // Last 30 days of date keys
  const today = new Date();
  const last30: string[] = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    last30.push(d.toISOString().slice(0, 10));
  }
  const last7 = last30.slice(0, 7);

  const insights: Insight[] = [];

  // ── Per-habit streaks ──────────────────────────────────────────────────────
  let bestStreak = 0;
  let bestStreakHabit = '';
  let longestStreakOverall = 0;

  for (const h of habits) {
    const dates = habitDates.get(h.id)!;
    let streak = 0;
    for (const dk of last30) {
      if (dates.has(dk)) streak++;
      else break;
    }
    if (streak > bestStreak) { bestStreak = streak; bestStreakHabit = h.name; }
    // longest streak regardless of recency
    let run = 0, max = 0;
    for (const dk of last30) { if (dates.has(dk)) { run++; max = Math.max(max, run); } else run = 0; }
    if (max > longestStreakOverall) longestStreakOverall = max;
  }

  if (bestStreak >= 3) {
    insights.push({
      type: 'streak',
      title: `${bestStreak}-day streak on "${bestStreakHabit}"`,
      body: `You've completed "${bestStreakHabit}" ${bestStreak} days in a row. Keep the momentum going!`,
    });
  }

  // ── 7-day completion rate ──────────────────────────────────────────────────
  const completionsLast7 = logs.filter(l => last7.includes(l.date_key)).length;
  const possible7 = habits.length * 7;
  const rate7 = possible7 > 0 ? completionsLast7 / possible7 : 0;

  // ── Trend: compare week 1 vs week 2 ───────────────────────────────────────
  const week2 = last30.slice(7, 14);
  const cW1 = logs.filter(l => last7.includes(l.date_key)).length;
  const cW2 = logs.filter(l => week2.includes(l.date_key)).length;
  const trending = cW1 > cW2 ? 'up' : cW1 < cW2 ? 'down' : 'flat';

  if (trending === 'up' && cW2 > 0) {
    insights.push({
      type: 'pattern',
      title: 'Improving this week',
      body: `You completed ${cW1} habits this week vs ${cW2} last week — that's ${cW1 - cW2} more. Great momentum!`,
    });
  } else if (trending === 'down' && cW1 > 0) {
    insights.push({
      type: 'drop_off',
      title: 'Completion dipped this week',
      body: `${cW2} completions last week vs ${cW1} this week. A small recovery push can get you back on track.`,
    });
  }

  // ── Best day of week ───────────────────────────────────────────────────────
  const dayCount = Array(7).fill(0);
  for (const l of logs) {
    const dow = new Date(l.date_key + 'T00:00:00').getDay();
    dayCount[dow]++;
  }
  const bestDow = dayCount.indexOf(Math.max(...dayCount));
  if (dayCount[bestDow] > 0) {
    insights.push({
      type: 'pattern',
      title: `${DAY_NAMES[bestDow]}s are your strongest day`,
      body: `You complete the most habits on ${DAY_NAMES[bestDow]}s. Try to match that energy every day!`,
    });
  }

  // ── Most inconsistent habit ────────────────────────────────────────────────
  let minRate = Infinity, weakHabit = '';
  for (const h of habits) {
    const dates = habitDates.get(h.id)!;
    const c = last7.filter(dk => dates.has(dk)).length;
    if (c < minRate) { minRate = c; weakHabit = h.name; }
  }
  if (minRate <= 2 && weakHabit) {
    insights.push({
      type: 'recommendation',
      title: `"${weakHabit}" needs attention`,
      body: `Only ${minRate} completions in the last 7 days. Try scheduling it at a fixed time to build consistency.`,
    });
  }

  const pct = Math.round(rate7 * 100);
  const summary = `${pct}% completion rate over the last 7 days across ${habits.length} habit${habits.length !== 1 ? 's' : ''}.${longestStreakOverall >= 5 ? ` Your best streak this month is ${longestStreakOverall} days.` : ''}`;

  return { summary, insights: insights.slice(0, 4) };
}

export default function InsightsPanel({ categoryName: _categoryName, habits, logs, color }: Props) {
  const { summary, insights } = useMemo(() => computeInsights(habits, logs), [habits.length, logs.length]);

  if (logs.length < 7) return (
    <p className="text-white/20 text-xs text-center py-2">Complete at least 7 habits to unlock insights</p>
  );

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-1.5">
        <Award size={12} style={{ color }} />
        <span className="text-white/50 text-[10px] uppercase tracking-widest font-semibold">Insights</span>
      </div>

      {/* Summary */}
      {summary && <p className="text-white/35 text-xs px-1 leading-relaxed">{summary}</p>}

      {/* Cards */}
      {insights.map((ins, i) => {
        const Icon = ICON[ins.type] ?? Lightbulb;
        const c = COLOR[ins.type] ?? color;
        return (
          <div
            key={i}
            className="flex items-start gap-3 px-4 py-3.5 rounded-2xl"
            style={{ background: `${c}0F`, border: `1px solid ${c}22` }}
          >
            <Icon size={14} style={{ color: c }} className="shrink-0 mt-0.5" />
            <div>
              <p className="text-white/80 text-sm font-medium leading-tight">{ins.title}</p>
              <p className="text-white/40 text-xs mt-1 leading-relaxed">{ins.body}</p>
            </div>
          </div>
        );
      })}

      {insights.length === 0 && (
        <p className="text-white/25 text-xs text-center py-2">No notable patterns yet — keep going!</p>
      )}
    </div>
  );
}
