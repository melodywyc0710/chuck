import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft, Check, Play, Pause, Plus, Minus, Trash2,
  BookOpen, List, Timer as TimerIcon, Hash, Activity, TrendingDown, Dumbbell,
  ChevronUp, ChevronDown, Edit2,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { recordCompletion } from '../lib/petEngine';
import { MetricPanels } from './FitnessTracker';
import HabitCreator from './HabitCreator';
import type { Habit, HabitLog } from '../lib/habitTypes';

interface Props {
  isPro: boolean;
  categoryName: string;
  initialHabits: Habit[];
  allCategoryNames: string[];
  color: string;
  canCustomize: boolean;
  onBack: () => void;
  onWorkout: () => void;
  onJournal: () => void;
}

// ─── Color picker ─────────────────────────────────────────────────────────────

const COLOR_PALETTE = [
  '#FF4D4D', '#F97316', '#F59E0B', '#10B981',
  '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6',
  '#EC4899', '#888888',
];

function ColorPicker({ catName, current, onPick }: { catName: string; current: string; onPick: (c: string) => void }) {
  function pick(c: string) {
    localStorage.setItem(`cat-color-${catName}`, c);
    onPick(c);
  }
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => onPick(current)} />
      <div className="absolute top-8 right-0 z-50 p-2 rounded-2xl flex flex-wrap gap-1.5"
        style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)', width: 136 }}>
        {COLOR_PALETTE.map(c => (
          <button key={c} onClick={() => pick(c)}
            className="w-8 h-8 rounded-xl transition-all active:scale-90"
            style={{ background: c, border: current === c ? '2px solid white' : '2px solid transparent' }} />
        ))}
      </div>
    </>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────


// ─── Inline timer ─────────────────────────────────────────────────────────────

function InlineTimer({ habit, color, onLog }: { habit: Habit; color: string; onLog: (mins: number) => void }) {
  const targetSecs = (habit.target_value ?? 25) * 60;
  const [secsLeft, setSecsLeft] = useState(targetSecs);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  function startStop() {
    if (finished) return;
    if (running) {
      clearInterval(intervalRef.current!); intervalRef.current = null; setRunning(false);
    } else {
      setRunning(true);
      intervalRef.current = setInterval(() => {
        setSecsLeft(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current!); intervalRef.current = null;
            setRunning(false); setFinished(true); return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
  }

  function handleDone() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    onLog(Math.max(1, Math.round((targetSecs - secsLeft) / 60)));
  }

  const pct = secsLeft / targetSecs;
  const r = 56;
  const circ = 2 * Math.PI * r;
  const mm = String(Math.floor(secsLeft / 60)).padStart(2, '0');
  const ss = String(secsLeft % 60).padStart(2, '0');
  const strokeColor = finished ? '#10B981' : color;

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex items-center justify-center" style={{ width: 80, height: 80 }}>
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 128 128" width="80" height="80">
          <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
          <circle cx="64" cy="64" r={r} fill="none" stroke={strokeColor} strokeWidth="4"
            strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * pct}
            style={{ transition: 'stroke-dashoffset 1s linear' }} />
        </svg>
        <p className="text-white font-semibold tabular-nums text-sm">{mm}:{ss}</p>
      </div>
      <div className="flex gap-2">
        {!finished && (
          <button onClick={startStop}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
            style={{ background: color }}>
            {running ? <Pause size={15} fill="white" /> : <Play size={15} fill="white" style={{ marginLeft: 1 }} />}
          </button>
        )}
        {(running || secsLeft < targetSecs || finished) && (
          <button onClick={handleDone}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
            style={{ background: finished ? '#10B981' : 'rgba(255,255,255,0.08)' }}>
            {finished ? 'Done!' : 'Mark done'}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Per-habit tracker panel ──────────────────────────────────────────────────

const TYPE_ICONS: Record<string, React.ElementType> = {
  workout: Dumbbell, journal: BookOpen, checklist: List,
  complete: Check, timer: TimerIcon, counter: Hash,
  numeric: Activity, avoid: TrendingDown,
};

function HabitPanel({
  habit, todayLog, pet, user, color,
  editMode, isFirst, isLast, onMoveUp, onMoveDown, onDelete,
  onLogUpdated, onWorkout, onJournal,
}: {
  habit: Habit;
  todayLog: HabitLog | null;
  pet: ReturnType<typeof useAuthStore.getState>['pet'];
  user: ReturnType<typeof useAuthStore.getState>['user'];
  color: string;
  editMode: boolean;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onLogUpdated: (log: HabitLog) => void;
  onWorkout: () => void;
  onJournal: () => void;
}) {
  const setPet = useAuthStore(s => s.setPetLocal);
  const today = new Date().toISOString().slice(0, 10);
  const [counter, setCounter] = useState(todayLog?.value ?? 0);
  const [numInput, setNumInput] = useState(todayLog?.value != null ? String(todayLog.value) : '');
  const [checkedItems, setCheckedItems] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(todayLog?.notes ?? '[]') as number[]); } catch { return new Set(); }
  });
  const [journalDone, setJournalDone] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (habit.tracking_type === 'journal' && user) {
      supabase.from('diary_entries').select('id').eq('user_id', user.id).eq('date_key', today).limit(1)
        .then(({ data }) => { if (data && data.length > 0) setJournalDone(true); });
    }
  }, []);

  async function logHabit(value: number | null, notes?: string) {
    if (!user) return;
    const isFirst = !todayLog;
    let updated: HabitLog;
    if (todayLog) {
      const { data } = await supabase.from('habit_logs')
        .update({ value, notes: notes ?? null, logged_at: new Date().toISOString() })
        .eq('id', todayLog.id).select().single();
      if (!data) return;
      updated = data as HabitLog;
    } else {
      const { data } = await supabase.from('habit_logs')
        .insert({ user_id: user.id, habit_id: habit.id, date_key: today, value, notes: notes ?? null })
        .select().single();
      if (!data) return;
      updated = data as HabitLog;
    }
    onLogUpdated(updated);
    if (isFirst && pet) {
      const updatedPet = await recordCompletion(pet, user.id);
      if (updatedPet) setPet(updatedPet);
    }
  }

  const tt = habit.tracking_type;
  const TypeIcon = TYPE_ICONS[tt] ?? Check;

  const isDone = (() => {
    if (tt === 'journal') return journalDone;
    if (!todayLog) return false;
    if (tt === 'complete' || tt === 'avoid') return true;
    if ((tt === 'timer' || tt === 'counter') && habit.target_value != null)
      return (todayLog.value ?? 0) >= habit.target_value;
    if (tt === 'checklist')
      return habit.checklist_items.length > 0 && checkedItems.size >= habit.checklist_items.length;
    return !!todayLog;
  })();

  function handleCounter(delta: number) {
    const next = Math.max(0, counter + delta);
    setCounter(next);
    logHabit(next);
  }

  function toggleChecklistItem(idx: number) {
    const next = new Set(checkedItems);
    if (next.has(idx)) next.delete(idx); else next.add(idx);
    setCheckedItems(next);
    logHabit(next.size, JSON.stringify([...next]));
  }

  return (
    <div className="rounded-[20px] overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
      {/* Edit mode controls */}
      {editMode && (
        <div className="flex items-center justify-between px-4 py-2.5"
          style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex gap-1">
            <button onClick={onMoveUp} disabled={isFirst}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all disabled:opacity-20"
              style={{ background: 'rgba(255,255,255,0.08)' }}>
              <ChevronUp size={14} color="white" />
            </button>
            <button onClick={onMoveDown} disabled={isLast}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all disabled:opacity-20"
              style={{ background: 'rgba(255,255,255,0.08)' }}>
              <ChevronDown size={14} color="white" />
            </button>
          </div>
          {confirming ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">Delete?</span>
              <button onClick={onDelete} className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171' }}>Yes</button>
              <button onClick={() => setConfirming(false)} className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>No</button>
            </div>
          ) : (
            <button onClick={() => setConfirming(true)} className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(239,68,68,0.1)' }}>
              <Trash2 size={13} color="#f87171" />
            </button>
          )}
        </div>
      )}

      {/* Main card */}
      <div className="px-4 py-4" style={{ background: '#111111' }}>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: isDone ? 'rgba(16,185,129,0.15)' : `${color}18` }}>
            {isDone
              ? <Check size={13} style={{ color: '#10B981' }} strokeWidth={2.5} />
              : <TypeIcon size={13} style={{ color: color }} strokeWidth={1.5} />
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white/80 text-sm font-semibold truncate">{habit.name}</p>
            <p className="text-white/25 text-[10px] capitalize">{tt} · {habit.frequency}</p>
          </div>
          {isDone && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981' }}>Done</span>}
        </div>

        {tt === 'complete' && !isDone && (
          <button onClick={() => logHabit(1)}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.97]"
            style={{ background: `${color}20`, color: color }}>
            Mark done
          </button>
        )}

        {tt === 'avoid' && !isDone && (
          <button onClick={() => logHabit(1)}
            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.97]"
            style={{ background: `${color}20`, color: color }}>
            Stayed clean today
          </button>
        )}

        {tt === 'timer' && (
          isDone
            ? <p className="text-sm" style={{ color: '#10B981' }}>{todayLog?.value} min logged</p>
            : <InlineTimer habit={habit} color={color} onLog={mins => logHabit(mins)} />
        )}

        {tt === 'counter' && (
          <div>
            <div className="flex items-center gap-3">
              <button onClick={() => handleCounter(-1)} className="w-9 h-9 rounded-xl flex items-center justify-center text-white/60" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <Minus size={14} />
              </button>
              <p className="flex-1 text-center text-white font-semibold tabular-nums text-2xl" style={{ letterSpacing: '-0.02em' }}>
                {counter}
                {habit.target_value != null && <span className="text-white/30 text-base font-normal">/{habit.target_value}</span>}
              </p>
              <button onClick={() => handleCounter(1)} className="w-9 h-9 rounded-xl flex items-center justify-center text-white/60" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <Plus size={14} />
              </button>
            </div>
            {habit.target_value != null && (
              <div className="h-1 rounded-full overflow-hidden mt-3" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (counter / habit.target_value) * 100)}%`, background: isDone ? '#10B981' : color }} />
              </div>
            )}
          </div>
        )}

        {tt === 'numeric' && (
          isDone
            ? <p className="text-sm" style={{ color: '#10B981' }}>{todayLog?.value} {habit.target_unit ?? ''} logged</p>
            : (
              <div className="flex gap-2">
                <input type="number" inputMode="decimal"
                  placeholder={`Value${habit.target_unit ? ` (${habit.target_unit})` : ''}…`}
                  value={numInput} onChange={e => setNumInput(e.target.value)}
                  className="flex-1 px-3 py-2.5 rounded-xl text-white text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.06)' }} />
                <button onClick={() => { const v = parseFloat(numInput); if (!isNaN(v)) logHabit(v); }}
                  disabled={!numInput}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40"
                  style={{ background: color }}>
                  Log
                </button>
              </div>
            )
        )}

        {tt === 'journal' && (
          journalDone
            ? <p className="text-sm" style={{ color: '#10B981' }}>Entry written today</p>
            : (
              <button onClick={() => { logHabit(1); onJournal(); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: `${color}20`, color: color }}>
                <BookOpen size={13} /> Write today's entry
              </button>
            )
        )}

        {tt === 'checklist' && (
          <div className="space-y-1.5">
            {habit.checklist_items.map((item, idx) => (
              <button key={idx} onClick={() => toggleChecklistItem(idx)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-left transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all"
                  style={{ border: `1.5px solid ${checkedItems.has(idx) ? '#10B981' : 'rgba(255,255,255,0.2)'}`, background: checkedItems.has(idx) ? '#10B981' : 'transparent' }}>
                  {checkedItems.has(idx) && <Check size={8} color="white" strokeWidth={3} />}
                </div>
                <span className="text-sm" style={{ color: checkedItems.has(idx) ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.7)', textDecoration: checkedItems.has(idx) ? 'line-through' : 'none' }}>
                  {item}
                </span>
              </button>
            ))}
            {habit.checklist_items.length > 0 && (
              <div className="h-0.5 rounded-full overflow-hidden mt-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${(checkedItems.size / habit.checklist_items.length) * 100}%`, background: isDone ? '#10B981' : color }} />
              </div>
            )}
          </div>
        )}

        {tt === 'workout' && (
          isDone
            ? <p className="text-sm" style={{ color: '#10B981' }}>Workout logged today</p>
            : (
              <button onClick={() => { logHabit(1); onWorkout(); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: color }}>
                <Dumbbell size={13} strokeWidth={1.5} /> Log workout
              </button>
            )
        )}
      </div>
    </div>
  );
}

// ─── History chart (comprehensive) ───────────────────────────────────────────

type Timeframe = '7d' | '30d' | '90d' | 'all';

function shortDate(dateKey: string) {
  return new Date(dateKey + 'T00:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' });
}

function formatDate(dateKey: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (dateKey === today) return 'Today';
  if (dateKey === yesterday) return 'Yesterday';
  return new Date(dateKey + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatLogValue(habit: Habit, log: HabitLog): string {
  const tt = habit.tracking_type;
  if (tt === 'timer' && log.value != null) return `${log.value} min`;
  if (tt === 'counter' && log.value != null)
    return habit.target_value ? `${log.value}/${habit.target_value}` : `${log.value}`;
  if (tt === 'numeric' && log.value != null)
    return `${log.value}${habit.target_unit ? ' ' + habit.target_unit : ''}`;
  if (tt === 'checklist' && log.value != null) return `${log.value}/${habit.checklist_items.length} steps`;
  if (tt === 'complete' || tt === 'avoid') return 'Done';
  if (tt === 'journal') return 'Written';
  if (tt === 'workout') return 'Logged';
  return 'Done';
}

function getDays(n: number): string[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return d.toISOString().slice(0, 10);
  });
}

function HabitHistoryChart({ habit, logs, color, canExpand }: {
  habit: Habit; logs: HabitLog[]; color: string; canExpand: boolean;
}) {
  const TIMEFRAMES: { value: Timeframe; label: string; days: number; pro: boolean }[] = [
    { value: '7d',  label: '7d',   days: 7,   pro: false },
    { value: '30d', label: '30d',  days: 30,  pro: false },
    { value: '90d', label: '90d',  days: 90,  pro: true  },
    { value: 'all', label: 'All',  days: 999, pro: true  },
  ];

  const [timeframe, setTimeframe] = useState<Timeframe>('30d');
  const [showAll, setShowAll] = useState(false);

  const logMap = new Map(logs.map(l => [l.date_key, l]));

  const tf = TIMEFRAMES.find(t => t.value === timeframe)!;
  const days = timeframe === 'all'
    ? (logs.length > 0 ? (() => {
        const earliest = logs[logs.length - 1].date_key;
        const start = new Date(earliest + 'T00:00:00');
        const today = new Date();
        const n = Math.ceil((today.getTime() - start.getTime()) / 86400000) + 1;
        return getDays(Math.min(n, 365));
      })() : getDays(30))
    : getDays(tf.days);

  const isBinary = ['complete', 'avoid', 'journal', 'workout'].includes(habit.tracking_type);
  const values = days.map(day => {
    const log = logMap.get(day);
    if (!log) return 0;
    return isBinary ? 1 : (log.value ?? 0);
  });

  const maxVal = Math.max(...values, 1);
  const W = 320;
  const H = 80;
  const PAD = { left: 4, right: 4, top: 8, bottom: 4 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const points = values.map((v, i) => ({
    x: PAD.left + (days.length === 1 ? innerW / 2 : (i / (days.length - 1)) * innerW),
    y: PAD.top + innerH - (v / maxVal) * innerH,
    v, date: days[i],
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x.toFixed(1)},${(PAD.top + innerH).toFixed(1)} L${PAD.left},${(PAD.top + innerH).toFixed(1)} Z`;

  // Stats
  const thisWeekDone = getDays(7).filter(d => logMap.has(d)).length;
  const allTimeDone = logs.length;
  const activeDays = values.filter(v => v > 0).length;

  // Last 14 days dot grid
  const last14 = getDays(14);

  // Log list
  const shownLogs = showAll ? logs : logs.slice(0, 5);

  return (
    <div className="rounded-[20px] overflow-hidden" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white/70 text-sm font-semibold">{habit.name}</p>
          {/* Timeframe picker */}
          <div className="flex gap-1">
            {TIMEFRAMES.filter(t => canExpand || !t.pro).map(t => (
              <button key={t.value}
                onClick={() => setTimeframe(t.value)}
                className="px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all"
                style={{
                  background: timeframe === t.value ? color : 'rgba(255,255,255,0.06)',
                  color: timeframe === t.value ? 'white' : 'rgba(255,255,255,0.4)',
                }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary pills */}
        <div className="flex gap-2 mb-3">
          {[
            { label: 'This week', val: thisWeekDone },
            { label: 'All time',  val: allTimeDone },
            { label: 'Active days', val: activeDays },
          ].map(s => (
            <div key={s.label} className="flex-1 rounded-xl px-2 py-2 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <p className="text-white font-semibold tabular-nums text-base" style={{ letterSpacing: '-0.03em' }}>{s.val}</p>
              <p className="text-white/30 text-[10px] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Area chart */}
        <div className="rounded-xl px-3 pt-3 pb-2 mb-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <p className="text-white/30 text-[10px] mb-2">{isBinary ? 'completions' : habit.target_unit ?? 'value'} · last {timeframe === 'all' ? 'year' : timeframe}</p>
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ height: 72, display: 'block' }}>
            <defs>
              <linearGradient id={`grad-${habit.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.35" />
                <stop offset="100%" stopColor={color} stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75, 1].map(v => (
              <line key={v} x1={PAD.left} y1={PAD.top + innerH - v * innerH}
                x2={W - PAD.right} y2={PAD.top + innerH - v * innerH}
                stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            ))}
            <path d={areaPath} fill={`url(#grad-${habit.id})`} />
            <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
            {points.filter(p => p.v > 0).map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="2.5" fill={color} />
            ))}
          </svg>
          <div className="flex justify-between mt-1">
            <span className="text-white/20 text-[10px]">{shortDate(days[0])}</span>
            {days.length > 10 && <span className="text-white/20 text-[10px]">{shortDate(days[Math.floor(days.length / 2)])}</span>}
            <span className="text-white/20 text-[10px]">Today</span>
          </div>
        </div>

        {/* 14-day dot grid */}
        <div className="rounded-xl px-3 py-3 mb-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <p className="text-white/30 text-[10px] mb-2">last 14 days</p>
          <div className="flex gap-1.5">
            {last14.map(day => {
              const log = logMap.get(day);
              const hasLog = !!log;
              const val = log?.value ?? 0;
              const opacity = !hasLog ? 0 : isBinary ? 1 : Math.min(1, val / maxVal);
              return (
                <div key={day} className="flex flex-col items-center gap-1 flex-1">
                  <div className="w-full rounded-md transition-all"
                    style={{ height: 20, background: hasLog ? `${color}${Math.round(opacity * 0.8 * 255 + 50).toString(16).padStart(2, '0')}` : 'rgba(255,255,255,0.06)' }} />
                  <span className="text-white/15 text-[8px]">
                    {new Date(day + 'T00:00:00').getDate()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Log list */}
        {logs.length > 0 && (
          <div>
            <p className="text-white/30 text-[10px] mb-2">log</p>
            <div className="space-y-1">
              {shownLogs.map(log => (
                <div key={log.id} className="flex items-center justify-between px-3 py-2 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(16,185,129,0.15)' }}>
                      <Check size={9} style={{ color: '#10B981' }} strokeWidth={2.5} />
                    </div>
                    <p className="text-white/50 text-xs">{formatDate(log.date_key)}</p>
                  </div>
                  <p className="text-white/30 text-xs">{formatLogValue(habit, log)}</p>
                </div>
              ))}
            </div>
            {logs.length > 5 && canExpand && (
              <button onClick={() => setShowAll(v => !v)}
                className="w-full mt-2 py-2 text-xs transition-colors"
                style={{ color: color }}>
                {showAll ? 'Show less' : `Show all ${logs.length} entries`}
              </button>
            )}
            {logs.length > 5 && !canExpand && (
              <p className="w-full mt-2 py-2 text-xs text-center" style={{ color: 'rgba(255,255,255,0.2)' }}>
                Upgrade to Pro for unlimited history
              </p>
            )}
          </div>
        )}
        {logs.length === 0 && (
          <p className="text-white/20 text-xs text-center py-2">No history yet</p>
        )}
      </div>
    </div>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function CategoryHubScreen({
  categoryName, initialHabits, allCategoryNames, color: initialColor, canCustomize, isPro,
  onBack, onWorkout, onJournal,
}: Props) {
  const user = useAuthStore(s => s.user);
  const pet = useAuthStore(s => s.pet);

  const today = new Date().toISOString().slice(0, 10);
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [todayLogs, setTodayLogs] = useState<Record<string, HabitLog>>({});
  const [allLogs, setAllLogs] = useState<Record<string, HabitLog[]>>({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'today' | 'history'>('today');
  const [showCreator, setShowCreator] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [color, setColor] = useState(initialColor);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    if (!user) return;
    setLoading(true);
    try {
      const habitIds = initialHabits.map(h => h.id);
      if (habitIds.length === 0) { setLoading(false); return; }

      const [{ data: todayData }, { data: histData }] = await Promise.all([
        supabase.from('habit_logs').select('*').in('habit_id', habitIds).eq('date_key', today),
        supabase.from('habit_logs').select('*').in('habit_id', habitIds).order('date_key', { ascending: false }),
      ]);

      if (todayData) {
        const map: Record<string, HabitLog> = {};
        for (const l of todayData) map[l.habit_id] = l as HabitLog;
        setTodayLogs(map);
      }
      if (histData) {
        const byHabit: Record<string, HabitLog[]> = {};
        for (const l of histData) {
          if (!byHabit[l.habit_id]) byHabit[l.habit_id] = [];
          byHabit[l.habit_id].push(l as HabitLog);
        }
        setAllLogs(byHabit);
      }
    } catch (e) {
      console.error('CategoryHubScreen load error:', e);
    } finally {
      setLoading(false);
    }
  }

  function handleLogUpdated(habitId: string, log: HabitLog) {
    setTodayLogs(prev => ({ ...prev, [habitId]: log }));
    setAllLogs(prev => {
      const existing = (prev[habitId] ?? []).filter(l => l.date_key !== today);
      return { ...prev, [habitId]: [log, ...existing] };
    });
  }

  async function moveHabit(index: number, direction: 'up' | 'down') {
    const other = direction === 'up' ? index - 1 : index + 1;
    if (other < 0 || other >= habits.length) return;
    const updated = [...habits];
    const aOrder = updated[index].sort_order;
    const bOrder = updated[other].sort_order;
    updated[index] = { ...updated[index], sort_order: bOrder };
    updated[other] = { ...updated[other], sort_order: aOrder };
    [updated[index], updated[other]] = [updated[other], updated[index]];
    setHabits(updated);
    await Promise.all([
      supabase.from('habits').update({ sort_order: bOrder }).eq('id', habits[index].id),
      supabase.from('habits').update({ sort_order: aOrder }).eq('id', habits[other].id),
    ]);
  }

  async function deleteHabit(habitId: string) {
    if (!user) return;
    await supabase.from('habit_logs').delete().eq('habit_id', habitId).eq('user_id', user.id);
    await supabase.from('habits').delete().eq('id', habitId).eq('user_id', user.id);
    setHabits(prev => prev.filter(h => h.id !== habitId));
  }

  const hasWorkout = habits.some(h => h.tracking_type === 'workout');
  const doneCount = habits.filter(h => !!todayLogs[h.id]).length;

  return (
    <>
      <div className="scene-bg" />
      <div className="scene-overlay" />

      {/* Color bar */}
      <div className="fixed top-0 left-0 right-0 z-20" style={{ height: 4, background: color }} />

      <div className="relative z-10 min-h-screen flex flex-col max-w-md mx-auto">
        {/* Header */}
        <div className="px-5 pt-8 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center justify-between mb-4">
            <button onClick={onBack} className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors">
              <ArrowLeft size={18} />
              <span className="text-sm">Back</span>
            </button>
            <div className="flex items-center gap-2">
              {canCustomize && (
                <div className="relative">
                  <button
                    onClick={() => setShowColorPicker(v => !v)}
                    className="w-5 h-5 rounded-full border-2 border-white/30 transition-all active:scale-90"
                    style={{ background: color }}
                  />
                  {showColorPicker && (
                    <ColorPicker catName={categoryName} current={color} onPick={c => { setColor(c); setShowColorPicker(false); }} />
                  )}
                </div>
              )}
              <button
                onClick={() => setEditMode(v => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                style={{ background: editMode ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)', color: editMode ? 'white' : 'rgba(255,255,255,0.5)' }}>
                <Edit2 size={10} /> {editMode ? 'Done' : 'Edit'}
              </button>
              <button
                onClick={() => setShowCreator(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-white/50 hover:text-white/80 transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)' }}>
                <Plus size={12} /> Add
              </button>
            </div>
          </div>
          <div>
            <h1 className="text-white font-semibold text-xl" style={{ letterSpacing: '-0.03em' }}>{categoryName}</h1>
            <p className="text-white/25 text-xs mt-0.5">{doneCount}/{habits.length} done today</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-5 pt-4 gap-4 mb-4">
          {(['today', 'history'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="text-sm font-semibold capitalize pb-2 transition-colors"
              style={{ color: tab === t ? 'white' : 'rgba(255,255,255,0.25)', borderBottom: `2px solid ${tab === t ? color : 'transparent'}` }}>
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-12">
          {loading && (
            <div className="flex justify-center py-16">
              <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
            </div>
          )}

          {!loading && tab === 'today' && (
            <div className="space-y-3">
              {habits.map((habit, index) => (
                <HabitPanel
                  key={habit.id}
                  habit={habit}
                  todayLog={todayLogs[habit.id] ?? null}
                  pet={pet}
                  user={user}
                  color={color}
                  editMode={editMode}
                  isFirst={index === 0}
                  isLast={index === habits.length - 1}
                  onMoveUp={() => moveHabit(index, 'up')}
                  onMoveDown={() => moveHabit(index, 'down')}
                  onDelete={() => deleteHabit(habit.id)}
                  onLogUpdated={log => handleLogUpdated(habit.id, log)}
                  onWorkout={onWorkout}
                  onJournal={onJournal}
                />
              ))}

              {hasWorkout && user && (
                <div className="pt-2">
                  <p className="text-white/25 text-[10px] uppercase tracking-widest mb-3">Body Metrics</p>
                  <MetricPanels userId={user.id} color={color} />
                </div>
              )}

              {habits.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-white/20 text-sm">No habits in this category yet</p>
                </div>
              )}
            </div>
          )}

          {!loading && tab === 'history' && (
            <div className="space-y-3">
              {habits.map(habit => (
                <HabitHistoryChart
                  key={habit.id}
                  habit={habit}
                  logs={allLogs[habit.id] ?? []}
                  color={color}
                  canExpand={isPro}
                />
              ))}
              {habits.length === 0 && (
                <p className="text-center text-white/20 text-sm py-12">No habits yet</p>
              )}
            </div>
          )}
        </div>
      </div>

      {showCreator && (
        <HabitCreator
          defaultCategory={categoryName === 'General' ? '' : categoryName}
          existingCategories={allCategoryNames}
          onSaved={() => { setShowCreator(false); load(); }}
          onClose={() => setShowCreator(false)}
        />
      )}
    </>
  );
}
