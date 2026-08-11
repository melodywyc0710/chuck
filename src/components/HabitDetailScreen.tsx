import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft, Check, Play, Pause, Plus, Minus,
  Dumbbell, BookOpen, List, Timer as TimerIcon,
  Hash, Activity, TrendingDown, Scale, Flame,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { recordCompletion } from '../lib/petEngine';
import type { Habit, HabitLog } from '../lib/habitTypes';

interface Props {
  habit: Habit;
  onBack: () => void;
  onWorkout: () => void;
  onJournal: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
    return habit.target_value ? `${log.value} / ${habit.target_value}` : `${log.value}`;
  if (tt === 'numeric' && log.value != null)
    return `${log.value}${habit.target_unit ? ' ' + habit.target_unit : ''}`;
  if (tt === 'checklist' && log.value != null)
    return `${log.value} / ${habit.checklist_items.length} steps`;
  if (tt === 'complete' || tt === 'avoid') return 'Done';
  if (tt === 'journal') return 'Written';
  if (tt === 'workout') {
    try {
      const d = JSON.parse(log.notes ?? '{}') as WorkoutData;
      const parts = [];
      if (d.workout_done) parts.push('Workout logged');
      if (d.weight != null) parts.push(`${d.weight} kg`);
      if (d.calories != null) parts.push(`${d.calories} kcal`);
      return parts.join(' · ') || 'Logged';
    } catch { return 'Logged'; }
  }
  return 'Done';
}

interface WorkoutData {
  workout_done?: boolean;
  weight?: number;
  calories?: number;
}

// ─── Timer UI ─────────────────────────────────────────────────────────────────

function InlineTimer({ habit, onLog }: { habit: Habit; onLog: (mins: number) => void }) {
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
    const elapsed = targetSecs - secsLeft;
    onLog(Math.max(1, Math.round(elapsed / 60)));
  }

  const pct = secsLeft / targetSecs;
  const r = 72;
  const circ = 2 * Math.PI * r;
  const mm = String(Math.floor(secsLeft / 60)).padStart(2, '0');
  const ss = String(secsLeft % 60).padStart(2, '0');

  return (
    <div className="flex flex-col items-center py-6">
      <div className="relative flex items-center justify-center w-44 h-44 mb-6">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 160 160" width="176" height="176">
          <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
          <circle
            cx="80" cy="80" r={r} fill="none"
            stroke={finished ? '#10B981' : '#FF4D4D'} strokeWidth="5"
            strokeLinecap="round" strokeDasharray={circ}
            strokeDashoffset={circ * pct}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="text-center">
          <p className="text-white font-semibold tabular-nums" style={{ fontSize: 36, letterSpacing: '-0.04em' }}>{mm}:{ss}</p>
          {habit.target_value && <p className="text-white/25 text-xs mt-0.5">{habit.target_value} {habit.target_unit ?? 'min'}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {!finished && (
          <button
            onClick={startStop}
            className="w-14 h-14 rounded-full flex items-center justify-center text-white transition-all active:scale-95"
            style={{ background: '#FF4D4D' }}
          >
            {running ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" style={{ marginLeft: 2 }} />}
          </button>
        )}
        {(running || secsLeft < targetSecs || finished) && (
          <button
            onClick={handleDone}
            className="px-5 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-95"
            style={{ background: finished ? '#10B981' : 'rgba(255,255,255,0.08)', color: 'white' }}
          >
            {finished ? 'Done!' : 'Mark complete'}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Workout hub ──────────────────────────────────────────────────────────────

function WorkoutHub({
  todayLog, onLog, onWorkout,
}: {
  habit?: Habit;
  todayLog: HabitLog | null;
  onLog: (value: number | null, notes: string) => void;
  onWorkout: () => void;
}) {
  const data: WorkoutData = (() => {
    try { return JSON.parse(todayLog?.notes ?? '{}'); } catch { return {}; }
  })();

  const [weight, setWeight] = useState(data.weight != null ? String(data.weight) : '');
  const [calories, setCalories] = useState(data.calories != null ? String(data.calories) : '');

  function saveField(field: 'weight' | 'calories', val: string) {
    const num = parseFloat(val);
    if (isNaN(num)) return;
    const updated: WorkoutData = { ...data, [field]: num };
    onLog(null, JSON.stringify(updated));
  }

  async function handleLogWorkout() {
    const updated: WorkoutData = { ...data, workout_done: true };
    await onLog(1, JSON.stringify(updated));
    onWorkout();
  }

  return (
    <div className="space-y-3">
      {/* Log workout */}
      <div className="rounded-[20px] px-4 py-4" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="text-white/30 text-[10px] uppercase tracking-widest mb-3">Workout</p>
        {data.workout_done ? (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
              <Check size={14} style={{ color: '#10B981' }} strokeWidth={2.5} />
            </div>
            <p className="text-sm font-medium" style={{ color: '#10B981' }}>Workout logged today</p>
          </div>
        ) : (
          <button
            onClick={handleLogWorkout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.97]"
            style={{ background: '#FF4D4D' }}
          >
            <Dumbbell size={14} strokeWidth={1.5} /> Log workout
          </button>
        )}
      </div>

      {/* Body weight */}
      <div className="rounded-[20px] px-4 py-4" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Scale size={13} style={{ color: 'rgba(255,255,255,0.3)' }} strokeWidth={1.5} />
          <p className="text-white/30 text-[10px] uppercase tracking-widest">Body Weight</p>
        </div>
        <div className="flex gap-2">
          <input
            type="number" inputMode="decimal" placeholder="e.g. 75.5"
            value={weight} onChange={e => setWeight(e.target.value)}
            className="flex-1 px-3 py-2.5 rounded-xl text-white text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          />
          <span className="flex items-center text-white/30 text-sm px-2">kg</span>
          <button
            onClick={() => saveField('weight', weight)}
            disabled={!weight}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-30 transition-all"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            Log
          </button>
        </div>
        {data.weight != null && (
          <p className="text-[10px] mt-2" style={{ color: '#10B981' }}>Logged: {data.weight} kg</p>
        )}
      </div>

      {/* Calories */}
      <div className="rounded-[20px] px-4 py-4" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Flame size={13} style={{ color: 'rgba(255,255,255,0.3)' }} strokeWidth={1.5} />
          <p className="text-white/30 text-[10px] uppercase tracking-widest">Calories</p>
        </div>
        <div className="flex gap-2">
          <input
            type="number" inputMode="numeric" placeholder="e.g. 2100"
            value={calories} onChange={e => setCalories(e.target.value)}
            className="flex-1 px-3 py-2.5 rounded-xl text-white text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          />
          <span className="flex items-center text-white/30 text-sm px-1">kcal</span>
          <button
            onClick={() => saveField('calories', calories)}
            disabled={!calories}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-30 transition-all"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            Log
          </button>
        </div>
        {data.calories != null && (
          <p className="text-[10px] mt-2" style={{ color: '#10B981' }}>Logged: {data.calories} kcal</p>
        )}
      </div>
    </div>
  );
}

// ─── History list ─────────────────────────────────────────────────────────────

function HistoryList({ logs, habit }: { logs: HabitLog[]; habit: Habit }) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/20 text-sm">No history yet</p>
        <p className="text-white/12 text-xs mt-1">Complete this habit to start your record</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {logs.map(log => (
        <div
          key={log.id}
          className="flex items-center justify-between px-4 py-3 rounded-[16px]"
          style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
              <Check size={11} style={{ color: '#10B981' }} strokeWidth={2.5} />
            </div>
            <p className="text-white/60 text-sm">{formatDate(log.date_key)}</p>
          </div>
          <p className="text-white/35 text-xs">{formatLogValue(habit, log)}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function HabitDetailScreen({ habit, onBack, onWorkout, onJournal }: Props) {
  const user = useAuthStore(s => s.user);
  const pet = useAuthStore(s => s.pet);
  const setPet = useAuthStore(s => s.setPetLocal);

  const today = new Date().toISOString().slice(0, 10);
  const [tab, setTab] = useState<'today' | 'history'>('today');
  const [todayLog, setTodayLog] = useState<HabitLog | null>(null);
  const [allLogs, setAllLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(0);
  const [numInput, setNumInput] = useState('');
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [journalDone, setJournalDone] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    if (!user) return;
    setLoading(true);
    try {
      const [{ data: logs }, { data: jEntry }] = await Promise.all([
        supabase.from('habit_logs').select('*').eq('habit_id', habit.id).order('date_key', { ascending: false }),
        habit.tracking_type === 'journal'
          ? supabase.from('diary_entries').select('id').eq('user_id', user.id).eq('date_key', today).limit(1)
          : Promise.resolve({ data: null }),
      ]);

      if (logs) {
        setAllLogs(logs as HabitLog[]);
        const tl = (logs as HabitLog[]).find(l => l.date_key === today) ?? null;
        setTodayLog(tl);
        if (tl) {
          setCounter(tl.value ?? 0);
          setNumInput(tl.value != null ? String(tl.value) : '');
          try {
            const idxs = JSON.parse(tl.notes ?? '[]') as number[];
            setCheckedItems(new Set(idxs));
          } catch { /* not checklist */ }
        }
      }
      if (jEntry && (jEntry as { id: string }[]).length > 0) setJournalDone(true);
    } catch (e) {
      console.error('HabitDetailScreen load error:', e);
    } finally {
      setLoading(false);
    }
  }

  async function logHabit(value: number | null, notes?: string) {
    if (!user) return;
    const isFirst = !todayLog;
    let updated: HabitLog;

    if (todayLog) {
      const { data } = await supabase
        .from('habit_logs').update({ value, notes: notes ?? null, logged_at: new Date().toISOString() })
        .eq('id', todayLog.id).select().single();
      if (!data) return;
      updated = data as HabitLog;
    } else {
      const { data } = await supabase
        .from('habit_logs').insert({ user_id: user.id, habit_id: habit.id, date_key: today, value, notes: notes ?? null })
        .select().single();
      if (!data) return;
      updated = data as HabitLog;
    }

    setTodayLog(updated);
    setAllLogs(prev => {
      const without = prev.filter(l => l.date_key !== today);
      return [updated, ...without];
    });

    if (isFirst && pet) {
      const updatedPet = await recordCompletion(pet, user.id);
      if (updatedPet) setPet(updatedPet);
    }
  }

  function handleCounter(delta: number) {
    const next = Math.max(0, counter + delta);
    setCounter(next);
    logHabit(next);
  }

  function handleNumSave() {
    const v = parseFloat(numInput);
    if (!isNaN(v)) logHabit(v);
  }

  function toggleChecklistItem(idx: number) {
    const next = new Set(checkedItems);
    if (next.has(idx)) next.delete(idx); else next.add(idx);
    setCheckedItems(next);
    logHabit(next.size, JSON.stringify([...next]));
  }

  const tt = habit.tracking_type;
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

  const TYPE_ICONS: Record<string, React.ElementType> = {
    workout: Dumbbell, journal: BookOpen, checklist: List,
    complete: Check, timer: TimerIcon, counter: Hash,
    numeric: Activity, avoid: TrendingDown,
  };
  const TypeIcon = TYPE_ICONS[tt] ?? Check;

  return (
    <>
      <div className="scene-bg" />
      <div className="scene-overlay" />

      <div className="relative z-10 min-h-screen flex flex-col max-w-md mx-auto">
        {/* Header */}
        <div className="px-5 pt-safe pt-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={onBack} className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors mb-4">
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: isDone ? 'rgba(16,185,129,0.15)' : 'rgba(255,77,77,0.12)' }}
            >
              {isDone
                ? <Check size={18} style={{ color: '#10B981' }} strokeWidth={2} />
                : <TypeIcon size={18} style={{ color: '#FF4D4D' }} strokeWidth={1.5} />
              }
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg" style={{ letterSpacing: '-0.03em' }}>{habit.name}</h1>
              <p className="text-white/25 text-xs capitalize">{tt} · {habit.frequency}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-5 pt-4 gap-4 mb-4">
          {(['today', 'history'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="text-sm font-semibold capitalize pb-2 transition-colors"
              style={{
                color: tab === t ? 'white' : 'rgba(255,255,255,0.25)',
                borderBottom: `2px solid ${tab === t ? '#FF4D4D' : 'transparent'}`,
              }}
            >
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
              {/* Workout hub */}
              {tt === 'workout' && (
                <WorkoutHub todayLog={todayLog} onLog={logHabit} onWorkout={onWorkout} />
              )}

              {/* Complete */}
              {tt === 'complete' && (
                isDone ? (
                  <div className="flex items-center gap-2 px-4 py-4 rounded-[20px]" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <Check size={16} style={{ color: '#10B981' }} strokeWidth={2.5} />
                    <p className="text-sm font-medium" style={{ color: '#10B981' }}>Done for today</p>
                  </div>
                ) : (
                  <button
                    onClick={() => logHabit(1)}
                    className="w-full py-4 rounded-[20px] text-sm font-semibold text-white transition-all active:scale-[0.97]"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                  >
                    Mark done
                  </button>
                )
              )}

              {/* Avoid */}
              {tt === 'avoid' && (
                isDone ? (
                  <div className="flex items-center gap-2 px-4 py-4 rounded-[20px]" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <Check size={16} style={{ color: '#10B981' }} strokeWidth={2.5} />
                    <p className="text-sm font-medium" style={{ color: '#10B981' }}>Stayed clean today</p>
                  </div>
                ) : (
                  <button
                    onClick={() => logHabit(1)}
                    className="w-full py-4 rounded-[20px] text-sm font-semibold text-white transition-all active:scale-[0.97]"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                  >
                    Stayed clean today
                  </button>
                )
              )}

              {/* Timer */}
              {tt === 'timer' && (
                isDone ? (
                  <div className="flex items-center gap-2 px-4 py-4 rounded-[20px]" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <Check size={16} style={{ color: '#10B981' }} strokeWidth={2.5} />
                    <p className="text-sm font-medium" style={{ color: '#10B981' }}>{todayLog?.value} min logged</p>
                  </div>
                ) : (
                  <InlineTimer habit={habit} onLog={mins => logHabit(mins)} />
                )
              )}

              {/* Counter */}
              {tt === 'counter' && (
                <div className="px-4 py-4 rounded-[20px]" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleCounter(-1)} className="w-10 h-10 rounded-xl flex items-center justify-center text-white/60" style={{ background: 'rgba(255,255,255,0.07)' }}>
                      <Minus size={16} />
                    </button>
                    <p className="flex-1 text-center text-white font-semibold tabular-nums" style={{ fontSize: 28, letterSpacing: '-0.02em' }}>
                      {counter}
                      {habit.target_value != null && <span className="text-white/30 text-base font-normal">/{habit.target_value}</span>}
                    </p>
                    <button onClick={() => handleCounter(1)} className="w-10 h-10 rounded-xl flex items-center justify-center text-white/60" style={{ background: 'rgba(255,255,255,0.07)' }}>
                      <Plus size={16} />
                    </button>
                  </div>
                  {habit.target_value != null && (
                    <div className="h-1 rounded-full overflow-hidden mt-3" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (counter / habit.target_value) * 100)}%`, background: isDone ? '#10B981' : '#FF4D4D' }} />
                    </div>
                  )}
                </div>
              )}

              {/* Numeric */}
              {tt === 'numeric' && (
                isDone ? (
                  <div className="flex items-center gap-2 px-4 py-4 rounded-[20px]" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <Check size={16} style={{ color: '#10B981' }} strokeWidth={2.5} />
                    <p className="text-sm font-medium" style={{ color: '#10B981' }}>{todayLog?.value} {habit.target_unit ?? ''} logged</p>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="number" inputMode="decimal"
                      placeholder={`Value${habit.target_unit ? ` (${habit.target_unit})` : ''}…`}
                      value={numInput} onChange={e => setNumInput(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-[20px] text-white text-sm outline-none"
                      style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)' }}
                    />
                    <button
                      onClick={handleNumSave} disabled={!numInput}
                      className="px-5 py-3 rounded-[20px] text-sm font-semibold text-white disabled:opacity-40"
                      style={{ background: '#FF4D4D' }}
                    >
                      Log
                    </button>
                  </div>
                )
              )}

              {/* Journal */}
              {tt === 'journal' && (
                journalDone ? (
                  <div className="flex items-center gap-2 px-4 py-4 rounded-[20px]" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <Check size={16} style={{ color: '#10B981' }} strokeWidth={2.5} />
                    <p className="text-sm font-medium" style={{ color: '#10B981' }}>Entry written today</p>
                  </div>
                ) : (
                  <button
                    onClick={onJournal}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-[20px] text-sm font-semibold text-white transition-all active:scale-[0.97]"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                  >
                    <BookOpen size={14} /> Write today's entry
                  </button>
                )
              )}

              {/* Checklist */}
              {tt === 'checklist' && (
                <div className="space-y-2">
                  {habit.checklist_items.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => toggleChecklistItem(idx)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-[18px] text-left transition-all"
                      style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all"
                        style={{
                          border: `1.5px solid ${checkedItems.has(idx) ? '#10B981' : 'rgba(255,255,255,0.2)'}`,
                          background: checkedItems.has(idx) ? '#10B981' : 'transparent',
                        }}
                      >
                        {checkedItems.has(idx) && <Check size={10} color="white" strokeWidth={3} />}
                      </div>
                      <span className="text-sm" style={{ color: checkedItems.has(idx) ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)', textDecoration: checkedItems.has(idx) ? 'line-through' : 'none' }}>
                        {item}
                      </span>
                    </button>
                  ))}
                  {habit.checklist_items.length > 0 && (
                    <div className="h-1 rounded-full overflow-hidden mt-1" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(checkedItems.size / habit.checklist_items.length) * 100}%`, background: isDone ? '#10B981' : '#FF4D4D' }} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {!loading && tab === 'history' && (
            <HistoryList logs={allLogs} habit={habit} />
          )}
        </div>
      </div>
    </>
  );
}
