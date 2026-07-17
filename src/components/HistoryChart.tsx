import { useMemo } from 'react';
import type { Completion, Promise_ } from '../lib/supabase';

interface CompletionWithTitle extends Completion {
  promise_title: string;
}

interface Props {
  history: CompletionWithTitle[];
  promises: Promise_[];
  color: string;
}

function getLast30Days(): string[] {
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().slice(0, 10);
  });
}

function shortDate(dateKey: string) {
  const d = new Date(dateKey + 'T00:00:00');
  return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
}

export default function HistoryChart({ history, promises, color }: Props) {
  const days = getLast30Days();

  // Count completions per day
  const dailyCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const d of days) map[d] = 0;
    for (const c of history) {
      if (map[c.date_key] !== undefined) map[c.date_key]++;
    }
    return days.map(d => ({ date: d, count: map[d] }));
  }, [history]);

  const maxCount = Math.max(...dailyCounts.map(d => d.count), 1);

  // SVG area chart
  const W = 320;
  const H = 80;
  const PAD = { left: 4, right: 4, top: 8, bottom: 4 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const points = dailyCounts.map((d, i) => {
    const x = PAD.left + (i / (days.length - 1)) * innerW;
    const y = PAD.top + innerH - (d.count / maxCount) * innerH;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x.toFixed(1)},${(PAD.top + innerH).toFixed(1)} L${PAD.left},${(PAD.top + innerH).toFixed(1)} Z`;

  // Per-promise breakdown: total completions + last 7 days streak
  const promiseStats = useMemo(() => {
    return promises.map(p => {
      const all = history.filter(c => c.promise_id === p.id);
      const last7 = days.slice(-7);
      const doneInLast7 = last7.filter(d => all.some(c => c.date_key === d)).length;
      const lastDone = all[0]?.date_key ?? null;
      return { promise: p, total: all.length, last7: doneInLast7, lastDone };
    });
  }, [history, promises]);

  // Recent activity: unique days with at least 1 completion in last 14 days
  const activeDays = useMemo(() => {
    const last14 = days.slice(-14);
    return last14.map(d => ({
      date: d,
      count: dailyCounts.find(x => x.date === d)?.count ?? 0,
    }));
  }, [dailyCounts]);

  const totalThisWeek = dailyCounts.slice(-7).reduce((s, d) => s + d.count, 0);
  const totalAllTime = history.length;

  return (
    <div className="space-y-4">

      {/* Summary pills */}
      <div className="flex gap-2">
        <div className="liquid-glass flex-1 rounded-2xl px-4 py-3 text-center">
          <p className="text-white text-xl font-semibold" style={{ letterSpacing: '-0.04em' }}>{totalThisWeek}</p>
          <p className="text-white/40 text-xs mt-0.5">this week</p>
        </div>
        <div className="liquid-glass flex-1 rounded-2xl px-4 py-3 text-center">
          <p className="text-white text-xl font-semibold" style={{ letterSpacing: '-0.04em' }}>{totalAllTime}</p>
          <p className="text-white/40 text-xs mt-0.5">all time</p>
        </div>
        <div className="liquid-glass flex-1 rounded-2xl px-4 py-3 text-center">
          <p className="text-white text-xl font-semibold" style={{ letterSpacing: '-0.04em' }}>
            {dailyCounts.filter(d => d.count > 0).length}
          </p>
          <p className="text-white/40 text-xs mt-0.5">active days</p>
        </div>
      </div>

      {/* Area chart */}
      <div className="liquid-glass rounded-2xl px-4 pt-4 pb-3">
        <p className="text-white/50 text-xs mb-3">completions · last 30 days</p>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ height: 80, display: 'block' }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={color} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {/* Horizontal grid lines */}
          {[0.25, 0.5, 0.75, 1].map(v => (
            <line
              key={v}
              x1={PAD.left} y1={PAD.top + innerH - v * innerH}
              x2={W - PAD.right} y2={PAD.top + innerH - v * innerH}
              stroke="rgba(255,255,255,0.06)" strokeWidth="1"
            />
          ))}
          {/* Area fill */}
          <path d={areaPath} fill="url(#areaGrad)" />
          {/* Line */}
          <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
          {/* Dots for days with completions */}
          {points.filter(p => p.count > 0).map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="2.5" fill={color} />
          ))}
        </svg>
        {/* X axis labels: first, middle, last */}
        <div className="flex justify-between mt-1">
          <span className="text-white/25 text-[10px]">{shortDate(days[0])}</span>
          <span className="text-white/25 text-[10px]">{shortDate(days[14])}</span>
          <span className="text-white/25 text-[10px]">Today</span>
        </div>
      </div>

      {/* Last 14 days dot grid */}
      <div className="liquid-glass rounded-2xl px-4 py-3">
        <p className="text-white/50 text-xs mb-3">last 14 days</p>
        <div className="flex gap-1.5 flex-wrap">
          {activeDays.map(d => (
            <div key={d.date} className="flex flex-col items-center gap-1">
              <div
                className="w-5 h-5 rounded-md transition-all"
                style={{
                  background: d.count === 0
                    ? 'rgba(255,255,255,0.06)'
                    : d.count === 1
                    ? color + '60'
                    : d.count >= 2
                    ? color + 'cc'
                    : color,
                }}
                title={`${shortDate(d.date)}: ${d.count} completed`}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <span className="text-white/25 text-[10px]">none</span>
          <div className="w-3 h-3 rounded-sm ml-2" style={{ background: color + '60' }} />
          <span className="text-white/25 text-[10px]">1</span>
          <div className="w-3 h-3 rounded-sm ml-2" style={{ background: color + 'cc' }} />
          <span className="text-white/25 text-[10px]">2+</span>
        </div>
      </div>

      {/* Per-promise breakdown */}
      {promiseStats.length > 0 && (
        <div className="liquid-glass rounded-2xl px-4 py-3">
          <p className="text-white/50 text-xs mb-3">by promise</p>
          <div className="space-y-3">
            {promiseStats.map(({ promise, total, last7 }) => {
              const pct = total === 0 ? 0 : Math.min(100, (last7 / 7) * 100);
              return (
                <div key={promise.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/70 text-xs truncate max-w-[200px]">{promise.title}</span>
                    <span className="text-white/30 text-xs ml-2 whitespace-nowrap">{total}× total</span>
                  </div>
                  <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                  <p className="text-white/25 text-[10px] mt-0.5">{last7}/7 days this week</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
