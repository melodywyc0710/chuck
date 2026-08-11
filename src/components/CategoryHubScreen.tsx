import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft, Check, Play, Pause, Plus, Minus,
  BookOpen, List, Timer as TimerIcon, Hash, Activity, TrendingDown, Dumbbell,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { recordCompletion } from '../lib/petEngine';
import { MetricPanels } from './FitnessTracker';
import HabitCreator from './HabitCreator';
import type { Habit, HabitLog } from '../lib/habitTypes';

interface Props {
  categoryName: string;
  initialHabits: Habit[];
  allCategoryNames: string[];
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
    return habit.target_value ? `${log.value}/${habit.target_value}` : `${log.value}`;
  if (tt === 'numeric' && log.value != null)
    return `${log.value}${habit.target_unit ? ' ' + habit.target_unit : ''}`;
  if (tt === 'checklist' && log.value != null) return `${log.value}/${habit.checklist_items.length} steps`;
  if (tt === 'complete' || tt === 'avoid') return 'Done';
  if (tt === 'journal') return 'Written';
  if (tt === 'workout') {
    try {
      const d = JSON.parse(log.notes ?? '{}') as { workout_done?: boolean };
      return d.workout_done ? 'Workout logged' : 'Logged';
    } catch { return 'Logged'; }
  }
  return 'Done';
}

// ─── Inline timer ─────────────────────────────────────────────────────────────

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
    onLog(Math.max(1, Math.round((targetSecs - secsLeft) / 60)));
  }

  const pct = secsLeft / targetSecs;
  const r = 56;
  const circ = 2 * Math.PI * r;
  const mm = String(Math.floor(secsLeft / 60)).padStart(2, '0');
  const ss = String(secsLeft % 60).padStart(2, '0');

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex items-center justify-center" style={{ width: 80, height: 80 }}>
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 128 128" width="80" height="80">
          <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
          <circle cx="64" cy="64" r={r} fill="none" stroke={finished ? '#10B981' : '#FF4D4D'} strokeWidth="4"
            strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * pct}
            style={{ transition: 'stroke-dashoffset 1s linear' }} />
        </svg>
        <p className="text-white font-semibold tabular-nums text-sm">{mm}:{ss}</p>
      </div>
      <div className="flex gap-2">
        {!finished && (
          <button onClick={startStop}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
            style={{ background: '#FF4D4D' }}>
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
  habit, todayLog, pet, user,
  onLogUpdated, onWorkout, onJournal,
}: {
  habit: Habit;
  todayLog: HabitLog | null;
  pet: ReturnType<typeof useAuthStore.getState>['pet'];
  user: ReturnType<typeof useAuthStore.getState>['user'];
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
    <div className="rounded-[20px] px-4 py-4" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)' }}>
      {/* Habit header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: isDone ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.07)' }}>
          {isDone
            ? <Check size={13} style={{ color: '#10B981' }} strokeWidth={2.5} />
            : <TypeIcon size={13} style={{ color: 'rgba(255,255,255,0.5)' }} strokeWidth={1.5} />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white/80 text-sm font-semibold truncate">{habit.name}</p>
          <p className="text-white/25 text-[10px] capitalize">{tt} · {habit.frequency}</p>
        </div>
        {isDone && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981' }}>Done</span>}
      </div>

      {/* Tracking UI */}
      {tt === 'complete' && !isDone && (
        <button onClick={() => logHabit(1)}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.97]"
          style={{ background: 'rgba(255,255,255,0.08)' }}>
          Mark done
        </button>
      )}

      {tt === 'avoid' && !isDone && (
        <button onClick={() => logHabit(1)}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.97]"
          style={{ background: 'rgba(255,255,255,0.08)' }}>
          Stayed clean today
        </button>
      )}

      {tt === 'timer' && (
        isDone
          ? <p className="text-sm" style={{ color: '#10B981' }}>{todayLog?.value} min logged</p>
          : <InlineTimer habit={habit} onLog={mins => logHabit(mins)} />
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
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (counter / habit.target_value) * 100)}%`, background: isDone ? '#10B981' : '#FF4D4D' }} />
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
                style={{ background: '#FF4D4D' }}>
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
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'rgba(255,255,255,0.08)' }}>
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
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(checkedItems.size / habit.checklist_items.length) * 100}%`, background: isDone ? '#10B981' : '#FF4D4D' }} />
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
              style={{ background: '#FF4D4D' }}>
              <Dumbbell size={13} strokeWidth={1.5} /> Log workout
            </button>
          )
      )}
    </div>
  );
}

// ─── History section ──────────────────────────────────────────────────────────

function HistorySection({ habit, logs }: { habit: Habit; logs: HabitLog[] }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? logs : logs.slice(0, 3);

  if (logs.length === 0) return (
    <div className="rounded-[18px] px-4 py-3" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.06)' }}>
      <p className="text-white/50 text-sm font-medium mb-0.5">{habit.name}</p>
      <p className="text-white/20 text-xs">No history yet</p>
    </div>
  );

  return (
    <div className="rounded-[18px] overflow-hidden" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <p className="text-white/60 text-sm font-medium">{habit.name}</p>
      </div>
      {shown.map(log => (
        <div key={log.id} className="flex items-center justify-between px-4 py-2.5 border-b last:border-b-0" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
          <p className="text-white/50 text-sm">{formatDate(log.date_key)}</p>
          <p className="text-white/30 text-xs">{formatLogValue(habit, log)}</p>
        </div>
      ))}
      {logs.length > 3 && (
        <button onClick={() => setExpanded(v => !v)}
          className="w-full px-4 py-2.5 text-xs text-white/25 hover:text-white/50 transition-colors">
          {expanded ? 'Show less' : `Show all ${logs.length} entries`}
        </button>
      )}
    </div>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function CategoryHubScreen({
  categoryName, initialHabits, allCategoryNames, onBack, onWorkout, onJournal,
}: Props) {
  const user = useAuthStore(s => s.user);
  const pet = useAuthStore(s => s.pet);

  const today = new Date().toISOString().slice(0, 10);
  const [habits] = useState<Habit[]>(initialHabits);
  const [todayLogs, setTodayLogs] = useState<Record<string, HabitLog>>({});
  const [allLogs, setAllLogs] = useState<Record<string, HabitLog[]>>({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'today' | 'history'>('today');
  const [showCreator, setShowCreator] = useState(false);

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

  const hasWorkout = habits.some(h => h.tracking_type === 'workout');
  const doneCount = habits.filter(h => !!todayLogs[h.id]).length;

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
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-white font-semibold text-xl" style={{ letterSpacing: '-0.03em' }}>{categoryName}</h1>
              <p className="text-white/25 text-xs mt-0.5">{doneCount}/{habits.length} done today</p>
            </div>
            <button
              onClick={() => setShowCreator(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-white/50 hover:text-white/80 transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              <Plus size={12} /> Add habit
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-5 pt-4 gap-4 mb-4">
          {(['today', 'history'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="text-sm font-semibold capitalize pb-2 transition-colors"
              style={{ color: tab === t ? 'white' : 'rgba(255,255,255,0.25)', borderBottom: `2px solid ${tab === t ? '#FF4D4D' : 'transparent'}` }}>
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
              {habits.map(habit => (
                <HabitPanel
                  key={habit.id}
                  habit={habit}
                  todayLog={todayLogs[habit.id] ?? null}
                  pet={pet}
                  user={user}
                  onLogUpdated={log => handleLogUpdated(habit.id, log)}
                  onWorkout={onWorkout}
                  onJournal={onJournal}
                />
              ))}

              {/* Calorie / steps / weight tracker — shown when category has workout habits */}
              {hasWorkout && user && (
                <div className="pt-2">
                  <p className="text-white/25 text-[10px] uppercase tracking-widest mb-3">Body Metrics</p>
                  <MetricPanels userId={user.id} color="#FF4D4D" />
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
                <HistorySection
                  key={habit.id}
                  habit={habit}
                  logs={allLogs[habit.id] ?? []}
                />
              ))}
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
