import { useEffect, useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

type Metric = 'calories' | 'steps' | 'weight';

interface LogEntry {
  id: string;
  user_id: string;
  metric: Metric;
  value: number;
  date_key: string;
  logged_at: string;
}

const METRIC_CONFIG: Record<Metric, { label: string; unit: string; emoji: string; color: string; placeholder: string; defaultGoal: number }> = {
  calories: { label: 'Calories',  unit: 'kcal', emoji: '🔥', color: '#f87171', placeholder: 'e.g. 1800',  defaultGoal: 2000 },
  steps:    { label: 'Steps',     unit: 'steps',emoji: '👟', color: '#34d399', placeholder: 'e.g. 8000',  defaultGoal: 10000 },
  weight:   { label: 'Weight',    unit: 'kg',   emoji: '⚖️', color: '#60a5fa', placeholder: 'e.g. 65.5',  defaultGoal: 0 },
};

const METRICS: Metric[] = ['calories', 'steps', 'weight'];

interface Props {
  onClose: () => void;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(dateKey: string) {
  const d = new Date(dateKey + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function MiniLineChart({ data, color, height = 80 }: { data: { date: string; value: number }[]; color: string; height?: number }) {
  if (data.length < 2) {
    return (
      <div className="flex items-center justify-center text-white/20 text-xs" style={{ height }}>
        Log more entries to see your trend
      </div>
    );
  }
  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const W = 300;
  const H = height;
  const pad = 12;
  const pts = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (W - pad * 2);
    const y = H - pad - ((d.value - min) / range) * (H - pad * 2);
    return { x, y, ...d };
  });
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaD = `${pathD} L${pts[pts.length - 1].x},${H} L${pts[0].x},${H} Z`;
  const last = pts[pts.length - 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#grad-${color.replace('#','')})`} />
      <path d={pathD} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last.x} cy={last.y} r="4" fill={color} />
      <text x={last.x} y={last.y - 8} textAnchor="middle" fill={color} fontSize="9" fontWeight="600">
        {last.value % 1 === 0 ? last.value : last.value.toFixed(1)}
      </text>
    </svg>
  );
}

function MetricPanel({ metric, userId }: { metric: Metric; userId: string }) {
  const cfg = METRIC_CONFIG[metric];
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const today = todayKey();
  const todayLog = logs.find(l => l.date_key === today);

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 29);
    const { data } = await supabase
      .from('fitness_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('metric', metric)
      .gte('date_key', cutoff.toISOString().slice(0, 10))
      .order('date_key', { ascending: true });
    if (data) setLogs(data);
  }

  async function saveEntry() {
    const num = parseFloat(inputVal);
    if (isNaN(num) || num <= 0) return;
    setSaving(true);
    if (todayLog) {
      // Update existing
      const { data } = await supabase
        .from('fitness_logs')
        .update({ value: num })
        .eq('id', todayLog.id)
        .select()
        .single();
      if (data) setLogs(prev => prev.map(l => l.id === data.id ? data : l));
    } else {
      const { data } = await supabase
        .from('fitness_logs')
        .insert({ user_id: userId, metric, value: num, date_key: today })
        .select()
        .single();
      if (data) setLogs(prev => [...prev, data]);
    }
    setInputVal('');
    setSaving(false);
  }

  // Build chart data from last 30 days (only logged days)
  const chartData = logs.map(l => ({ date: l.date_key, value: l.value }));

  // Stats
  const recent = logs.slice(-7);
  const avg = recent.length ? recent.reduce((s, l) => s + l.value, 0) / recent.length : null;

  return (
    <div className="liquid-glass rounded-[28px] p-5 fade-up">
      <button
        className="w-full flex items-center justify-between"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{cfg.emoji}</span>
          <div className="text-left">
            <p className="text-white/40 text-xs">{cfg.unit}</p>
            <p className="text-white font-medium text-base leading-tight" style={{ letterSpacing: '-0.02em' }}>{cfg.label}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {todayLog && (
            <span className="text-sm font-semibold" style={{ color: cfg.color }}>
              {todayLog.value % 1 === 0 ? todayLog.value : todayLog.value.toFixed(1)}
              <span className="text-white/30 text-xs ml-0.5">{cfg.unit}</span>
            </span>
          )}
          {expanded ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
        </div>
      </button>

      {expanded && (
        <div className="mt-4">
          {/* Log input */}
          <div className="flex gap-2 mb-4">
            <input
              type="number"
              inputMode="decimal"
              placeholder={cfg.placeholder}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveEntry()}
              className="flex-1 px-4 py-2.5 rounded-2xl text-white placeholder-white/30 text-sm outline-none liquid-glass"
              style={{ background: 'rgba(255,255,255,0.07)' }}
            />
            <button
              onClick={saveEntry}
              disabled={saving}
              className="px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors"
              style={{ background: cfg.color + 'cc', color: '#fff' }}
            >
              {todayLog ? 'Update' : 'Log'}
            </button>
          </div>

          {/* Chart */}
          <div className="mb-3">
            <MiniLineChart data={chartData} color={cfg.color} />
          </div>

          {/* Stats row */}
          {avg !== null && (
            <div className="flex gap-3">
              <div className="flex-1 text-center py-2 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <p className="text-white/30 text-[10px] mb-0.5">7-day avg</p>
                <p className="font-semibold text-sm" style={{ color: cfg.color }}>
                  {avg % 1 < 0.05 ? Math.round(avg) : avg.toFixed(1)}
                  <span className="text-white/30 text-[10px] ml-0.5">{cfg.unit}</span>
                </p>
              </div>
              <div className="flex-1 text-center py-2 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <p className="text-white/30 text-[10px] mb-0.5">entries</p>
                <p className="font-semibold text-sm text-white">{logs.length}</p>
              </div>
              {metric !== 'weight' && (
                <div className="flex-1 text-center py-2 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <p className="text-white/30 text-[10px] mb-0.5">goal</p>
                  <p className="font-semibold text-sm text-white/50">{cfg.defaultGoal.toLocaleString()}</p>
                </div>
              )}
            </div>
          )}

          {/* Recent log list */}
          {logs.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {[...logs].reverse().slice(0, 5).map(l => (
                <div key={l.id} className="flex items-center justify-between text-xs px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <span className="text-white/40">{formatDate(l.date_key)}</span>
                  <span className="font-medium" style={{ color: cfg.color }}>
                    {l.value % 1 === 0 ? l.value : l.value.toFixed(1)} {cfg.unit}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function FitnessTracker({ onClose }: Props) {
  const user = useAuthStore(s => s.user);

  if (!user) return null;

  return (
    <>
      <div className="scene-bg" />
      <div className="scene-overlay" />
      <div
        className="relative z-10 min-h-screen flex flex-col max-w-md mx-auto px-6 pt-14 pb-10"
        style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
      >
        {/* Nav */}
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

        {/* Header */}
        <div className="mb-8 fade-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="font-playfair italic text-white text-3xl leading-tight" style={{ letterSpacing: '-0.04em' }}>
            Track your body
          </h1>
          <p className="text-white/40 text-sm mt-1">Log daily to see trends</p>
        </div>

        {/* Metric panels */}
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
