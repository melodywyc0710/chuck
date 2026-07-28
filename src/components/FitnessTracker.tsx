import { useEffect, useRef, useState } from 'react';
import { X, ChevronDown, ChevronUp, Plus, Target, Trash2, Search, Flame, Footprints, Scale } from 'lucide-react';
import { getLocalTimeZone, today as getToday, type DateValue } from '@internationalized/date';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { searchFoods, type FoodItem } from '../lib/foodDatabase';
import { DatePicker } from './DatePicker';

import type React from 'react';

type Metric = 'calories' | 'steps' | 'weight';
type AggMode = 'sum' | 'latest'; // how to aggregate multiple entries per day

interface LogEntry {
  id: string;
  user_id: string;
  metric: Metric;
  value: number;
  note: string | null;
  date_key: string;
  logged_at: string;
}

const METRIC_CONFIG: Record<Metric, {
  label: string; unit: string; Icon: React.ElementType; color: string;
  placeholder: string; defaultGoal: number; agg: AggMode;
  goalLabel: string; goalDesc: string;
}> = {
  calories: {
    label: 'Calories',  unit: 'kcal', Icon: Flame,      color: '#FF4D4D',
    placeholder: 'e.g. 350', defaultGoal: 2000, agg: 'sum',
    goalLabel: 'Daily calorie goal', goalDesc: 'e.g. 2000 kcal/day',
  },
  steps: {
    label: 'Steps',     unit: 'steps', Icon: Footprints, color: '#FF4D4D',
    placeholder: 'e.g. 3000', defaultGoal: 10000, agg: 'sum',
    goalLabel: 'Daily step goal', goalDesc: 'e.g. 10000 steps/day',
  },
  weight: {
    label: 'Weight',    unit: 'kg',    Icon: Scale,      color: '#FF4D4D',
    placeholder: 'e.g. 65.5', defaultGoal: 0, agg: 'latest',
    goalLabel: 'Target weight', goalDesc: 'e.g. 60 kg',
  },
};

const METRICS: Metric[] = ['calories', 'steps', 'weight'];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

/** Aggregate logs into daily values for chart */
function aggregateByDay(logs: LogEntry[], agg: AggMode): { date: string; value: number }[] {
  const byDay: Record<string, number[]> = {};
  for (const l of logs) {
    if (!byDay[l.date_key]) byDay[l.date_key] = [];
    byDay[l.date_key].push(Number(l.value));
  }
  return Object.entries(byDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, vals]) => ({
      date,
      value: agg === 'sum'
        ? vals.reduce((s, v) => s + v, 0)
        : vals[vals.length - 1],
    }));
}

function MiniLineChart({ data, color, goal, height = 90 }: {
  data: { date: string; value: number }[]; color: string; goal: number; height?: number;
}) {
  if (data.length < 2) {
    return (
      <div className="flex items-center justify-center text-white/20 text-xs" style={{ height }}>
        Log more days to see your trend
      </div>
    );
  }
  const values = data.map(d => d.value);
  const min = 0;
  const max = Math.max(...values, goal > 0 ? goal : 0) * 1.1 || 1;
  const W = 300; const H = height; const pad = 14;
  const toX = (i: number) => pad + (i / (data.length - 1)) * (W - pad * 2);
  const toY = (v: number) => H - pad - ((v - min) / (max - min)) * (H - pad * 2);
  const pts = data.map((d, i) => ({ x: toX(i), y: toY(d.value), ...d }));
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaD = `${pathD} L${pts[pts.length-1].x.toFixed(1)},${H} L${pts[0].x.toFixed(1)},${H} Z`;
  const last = pts[pts.length - 1];
  const goalY = goal > 0 ? toY(goal) : -1;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={`fg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Goal line */}
      {goalY > 0 && goalY < H && (
        <>
          <line x1={pad} y1={goalY} x2={W - pad} y2={goalY} stroke={color} strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.4" />
          <text x={W - pad - 2} y={goalY - 3} textAnchor="end" fill={color} fontSize="8" opacity="0.6">goal</text>
        </>
      )}
      <path d={areaD} fill={`url(#fg-${color.replace('#','')})`} />
      <path d={pathD} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last.x} cy={last.y} r="4" fill={color} />
      <text x={last.x} y={last.y - 8} textAnchor="middle" fill={color} fontSize="9" fontWeight="600">
        {last.value % 1 === 0 ? last.value.toLocaleString() : last.value.toFixed(1)}
      </text>
    </svg>
  );
}

function GoalEditor({ metric, goal, onSave, onClose }: { metric: Metric; goal: number; onSave: (v: number) => void; onClose: () => void }) {
  const cfg = METRIC_CONFIG[metric];
  const [val, setVal] = useState(goal > 0 ? String(goal) : '');
  return (
    <div className="liquid-glass rounded-2xl p-4 mt-2 space-y-3">
      <p className="text-white/60 text-xs font-medium">{cfg.goalLabel}</p>
      <p className="text-white/30 text-[10px]">{cfg.goalDesc}</p>
      <div className="flex gap-2">
        <input
          type="number"
          inputMode="decimal"
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { onSave(parseFloat(val) || 0); onClose(); } }}
          autoFocus
          className="app-input flex-1"
          placeholder={cfg.placeholder}
        />
        <button
          onClick={() => { onSave(parseFloat(val) || 0); onClose(); }}
          className="px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ background: cfg.color }}
        >
          Save
        </button>
        <button onClick={onClose} className="px-3 py-2 rounded-xl text-white/40 text-sm liquid-glass">✕</button>
      </div>
    </div>
  );
}

function MetricPanel({ metric, userId }: { metric: Metric; userId: string }) {
  const cfg = METRIC_CONFIG[metric];
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [inputNote, setInputNote] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [showGoalEditor, setShowGoalEditor] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [logDate, setLogDate] = useState<DateValue>(getToday(getLocalTimeZone()));
  // Food search (calories only)
  const [foodQuery, setFoodQuery] = useState('');
  const [foodResults, setFoodResults] = useState<FoodItem[]>([]);
  const [searchMode, setSearchMode] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const today = todayKey();

  // Goal stored in localStorage per metric
  const goalKey = `nagi_fitness_goal_${metric}`;
  const [goal, setGoal] = useState<number>(() => {
    const stored = localStorage.getItem(goalKey);
    return stored ? parseFloat(stored) : cfg.defaultGoal;
  });

  function saveGoal(v: number) {
    setGoal(v);
    localStorage.setItem(goalKey, String(v));
  }

  useEffect(() => { loadLogs(); }, []);

  async function loadLogs() {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 29);
    const { data } = await supabase
      .from('fitness_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('metric', metric)
      .gte('date_key', cutoff.toISOString().slice(0, 10))
      .order('logged_at', { ascending: true });
    if (data) setLogs(data.map(l => ({ ...l, value: Number(l.value) })));
  }

  async function addEntry() {
    const num = parseFloat(inputVal);
    if (isNaN(num) || num <= 0) return;
    setSaving(true);
    setDbError(null);

    const dateKey = `${logDate.year}-${String(logDate.month).padStart(2, '0')}-${String(logDate.day).padStart(2, '0')}`;

    // Optimistic update — show immediately in UI
    const tempEntry: LogEntry = {
      id: `temp-${Date.now()}`,
      user_id: userId,
      metric,
      value: num,
      note: inputNote.trim() || null,
      date_key: dateKey,
      logged_at: new Date().toISOString(),
    };
    setLogs(prev => [...prev, tempEntry]);
    setInputVal('');
    setInputNote('');
    setFoodQuery('');
    setFoodResults([]);
    setSearchMode(false);
    setShowAddForm(false);
    setSaving(false);

    // Persist to DB
    const { data, error } = await supabase
      .from('fitness_logs')
      .insert({ user_id: userId, metric, value: num, note: tempEntry.note, date_key: dateKey })
      .select()
      .single();
    if (error) {
      setDbError(error.message);
      // Remove the optimistic entry on failure
      setLogs(prev => prev.filter(l => l.id !== tempEntry.id));
    } else if (data) {
      // Replace temp entry with real DB row
      setLogs(prev => prev.map(l => l.id === tempEntry.id ? { ...data, value: Number(data.value) } : l));
    }
  }

  function onFoodQueryChange(q: string) {
    setFoodQuery(q);
    setFoodResults(searchFoods(q));
  }

  function selectFood(food: FoodItem) {
    setInputVal(String(food.cal));
    setInputNote(food.name + ' (' + food.serving + ')');
    setFoodQuery('');
    setFoodResults([]);
    setSearchMode(false);
  }

  async function deleteEntry(id: string) {
    await supabase.from('fitness_logs').delete().eq('id', id);
    setLogs(prev => prev.filter(l => l.id !== id));
  }

  const dailyData = aggregateByDay(logs, cfg.agg);
  const todayLogs = logs.filter(l => l.date_key === today);
  const todayTotal = cfg.agg === 'sum'
    ? todayLogs.length > 0 ? todayLogs.reduce((s, l) => s + l.value, 0) : null
    : (todayLogs[todayLogs.length - 1]?.value ?? null);

  const progressPct = goal > 0 && todayTotal !== null ? Math.min(100, (todayTotal / goal) * 100) : 0;
  const recent7 = dailyData.slice(-7);
  const avg7 = recent7.length ? recent7.reduce((s, d) => s + d.value, 0) / recent7.length : null;

  return (
    <div className="liquid-glass rounded-[28px] p-5">
      {/* Header row */}
      <button className="w-full flex items-center justify-between" onClick={() => setExpanded(v => !v)}>
        <div className="flex items-center gap-3">
          <cfg.Icon size={20} strokeWidth={1.5} style={{ color: cfg.color }} />
          <div className="text-left">
            <p className="text-white/40 text-xs">{cfg.unit}</p>
            <p className="text-white font-medium text-base leading-tight" style={{ letterSpacing: '-0.02em' }}>{cfg.label}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {todayTotal !== null && (
            <div className="text-right">
              <span className="text-sm font-semibold" style={{ color: cfg.color }}>
                {cfg.agg === 'sum' ? todayTotal.toLocaleString() : (todayTotal % 1 === 0 ? todayTotal : todayTotal.toFixed(1))}
                <span className="text-white/30 text-xs ml-0.5">{cfg.unit}</span>
              </span>
              {goal > 0 && cfg.agg === 'sum' && (
                <p className="text-white/25 text-[9px]">/ {goal.toLocaleString()} goal</p>
              )}
            </div>
          )}
          {expanded ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
        </div>
      </button>

      {/* Progress bar (sum metrics only) */}
      {cfg.agg === 'sum' && goal > 0 && todayTotal !== null && (
        <div className="mt-3 h-1 bg-white/8 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%`, backgroundColor: cfg.color }}
          />
        </div>
      )}

      {expanded && (
        <div className="mt-4 space-y-4">

          {/* DB error banner */}
          {dbError && (
            <div className="px-3 py-2 rounded-xl text-xs text-red-300/80" style={{ background: 'rgba(248,113,113,0.12)' }}>
              <p className="font-medium mb-0.5">Could not save to database</p>
              <p className="text-red-300/50">{dbError}</p>
              <p className="text-red-300/40 mt-1">Run the fitness_logs migration SQL in Supabase to fix this.</p>
            </div>
          )}

          {/* Goal setting */}
          <button
            onClick={() => setShowGoalEditor(v => !v)}
            className="flex items-center gap-1.5 text-white/30 text-xs hover:text-white/60 transition-colors"
          >
            <Target size={11} />
            {goal > 0 ? `Goal: ${goal.toLocaleString()} ${cfg.unit}` : 'Set a goal'}
          </button>
          {showGoalEditor && (
            <GoalEditor metric={metric} goal={goal} onSave={saveGoal} onClose={() => setShowGoalEditor(false)} />
          )}

          {/* Add entry */}
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm transition-colors"
              style={{ background: cfg.color, color: 'white' }}
            >
              <Plus size={14} />
              Log {cfg.label.toLowerCase()}
            </button>
          ) : (
            <div className="space-y-2 fade-up" style={{ animationDelay: '0s' }}>

              {/* Food search (calories only) */}
              {metric === 'calories' && (
                <div>
                  {!searchMode ? (
                    <button
                      onClick={() => { setSearchMode(true); setTimeout(() => searchRef.current?.focus(), 50); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm text-white/40 hover:text-white/70 transition-colors"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                    >
                      <Search size={13} />
                      Search food database…
                    </button>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl liquid-glass" style={{ background: 'rgba(255,255,255,0.07)' }}>
                        <Search size={13} className="text-white/40 shrink-0" />
                        <input
                          ref={searchRef}
                          type="text"
                          placeholder="e.g. banana, chicken breast, latte…"
                          value={foodQuery}
                          onChange={e => onFoodQueryChange(e.target.value)}
                          className="flex-1 bg-transparent text-white placeholder-white/30 text-sm outline-none"
                        />
                        <button onClick={() => { setSearchMode(false); setFoodQuery(''); setFoodResults([]); }} className="text-white/25 hover:text-white/60 text-xs">✕</button>
                      </div>
                      {foodResults.length > 0 && (
                        <div className="mt-1 rounded-2xl overflow-hidden" style={{ background: 'rgba(20,20,30,0.85)' }}>
                          {foodResults.map((f, i) => (
                            <button
                              key={i}
                              onClick={() => selectFood(f)}
                              className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/8 transition-colors text-left border-b border-white/5 last:border-0"
                            >
                              <div>
                                <p className="text-white text-sm">{f.name}</p>
                                <p className="text-white/30 text-[10px]">{f.serving}</p>
                              </div>
                              <span className="text-sm font-semibold ml-3 shrink-0" style={{ color: cfg.color }}>
                                {f.cal} kcal
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                      {foodQuery.length > 1 && foodResults.length === 0 && (
                        <p className="text-white/25 text-xs px-1 mt-1">No match — type the kcal manually below</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Date picker for logging past dates */}
              <div className="flex items-center gap-2">
                <span className="text-white/35 text-xs">Date</span>
                <DatePicker
                  value={logDate}
                  onChange={v => v && setLogDate(v)}
                  maxValue={getToday(getLocalTimeZone())}
                />
              </div>

              {/* Manual value input */}
              <div className="flex gap-2">
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder={cfg.placeholder}
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addEntry()}
                  autoFocus={metric !== 'calories'}
                  className="app-input flex-1"
                />
                <button
                  onClick={addEntry}
                  disabled={saving}
                  className="px-4 py-2.5 rounded-2xl text-sm font-medium text-white"
                  style={{ background: cfg.color }}
                >
                  Add
                </button>
              </div>
              <input
                type="text"
                placeholder={metric === 'calories' ? 'Food name (filled automatically from search)' : 'Note (optional)'}
                value={inputNote}
                onChange={e => setInputNote(e.target.value)}
                className="app-input"
              />
              <button onClick={() => { setShowAddForm(false); setSearchMode(false); setFoodQuery(''); setFoodResults([]); }} className="w-full text-white/25 text-xs py-1 hover:text-white/50">cancel</button>
            </div>
          )}

          {/* Today's entries */}
          {todayLogs.length > 0 && (
            <div>
              <p className="text-white/30 text-[10px] mb-2 uppercase tracking-widest">Today</p>
              <div className="space-y-1.5">
                {[...todayLogs].reverse().map(l => (
                  <div key={l.id} className="flex items-center justify-between px-3 py-2 rounded-xl group" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div>
                      <span className="font-medium text-sm" style={{ color: cfg.color }}>
                        {l.value % 1 === 0 ? l.value.toLocaleString() : l.value.toFixed(1)} {cfg.unit}
                      </span>
                      <span className="text-white/25 text-xs ml-2">{formatTime(l.logged_at)}</span>
                      {l.note && <p className="text-white/30 text-[10px] mt-0.5">{l.note}</p>}
                    </div>
                    <button
                      onClick={() => deleteEntry(l.id)}
                      className="text-white/15 hover:text-red-400/60 transition-colors ml-2"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                {cfg.agg === 'sum' && todayLogs.length > 1 && (
                  <div className="text-right text-xs px-3" style={{ color: cfg.color }}>
                    Total: {todayTotal?.toLocaleString()} {cfg.unit}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Chart */}
          <div>
            <p className="text-white/30 text-[10px] mb-1 uppercase tracking-widest">30-day trend</p>
            <MiniLineChart data={dailyData} color={cfg.color} goal={goal} />
          </div>

          {/* Stats */}
          {avg7 !== null && (
            <div className="flex gap-2">
              <div className="flex-1 text-center py-2 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <p className="text-white/30 text-[10px] mb-0.5">7-day avg</p>
                <p className="font-semibold text-sm" style={{ color: cfg.color }}>
                  {cfg.agg === 'sum' ? Math.round(avg7).toLocaleString() : avg7.toFixed(1)}
                  <span className="text-white/25 text-[9px] ml-0.5">{cfg.unit}</span>
                </p>
              </div>
              <div className="flex-1 text-center py-2 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <p className="text-white/30 text-[10px] mb-0.5">days logged</p>
                <p className="font-semibold text-sm text-white">{dailyData.length}</p>
              </div>
              {goal > 0 && avg7 !== null && cfg.agg === 'sum' && (
                <div className="flex-1 text-center py-2 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <p className="text-white/30 text-[10px] mb-0.5">avg vs goal</p>
                  <p className="font-semibold text-sm" style={{ color: avg7 >= goal ? 'white' : cfg.color }}>
                    {avg7 >= goal ? '✓ on track' : `${Math.round((avg7 / goal) * 100)}%`}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function MetricPanels({ userId }: { userId: string }) {
  return (
    <div className="space-y-4">
      {METRICS.map(m => <MetricPanel key={m} metric={m} userId={userId} />)}
    </div>
  );
}

export default function FitnessTracker({ onClose }: { onClose: () => void }) {
  const user = useAuthStore(s => s.user);
  if (!user) return null;

  return (
    <>
      <div className="scene-bg" />
      <div className="scene-overlay" />
      <div
        className="relative z-10 min-h-screen flex flex-col max-w-md mx-auto px-6 pt-14 pb-10"
       
      >
        <div className="flex items-center justify-between w-full mb-10 fade-up" style={{ animationDelay: '0.05s' }}>
          <div className="liquid-glass inline-flex items-center gap-2 px-3 py-2.5 rounded-full">
            <span className="text-xs">💪</span>
            <span className="text-white/90 text-xs font-medium">Fitness</span>
          </div>
          <button
            onClick={onClose}
            className="liquid-glass w-9 h-9 flex items-center justify-center rounded-full text-white/50 hover:text-white/80 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <div className="mb-8 fade-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-white text-3xl font-semibold leading-tight" style={{ letterSpacing: '-0.04em' }}>
            Track your body
          </h1>
          <p className="text-white/40 text-sm mt-1">Log any time — entries stack through the day</p>
        </div>

        <div className="space-y-4">
          {METRICS.map((m, i) => (
            <div key={m} className="fade-up" style={{ animationDelay: `${0.2 + i * 0.08}s` }}>
              <MetricPanel metric={m} userId={user.id} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
