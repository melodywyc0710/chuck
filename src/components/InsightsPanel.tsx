import { useEffect, useState } from 'react';
import { Sparkles, Loader, RefreshCw, TrendingUp, Lightbulb, Flame, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { HabitInsight, HabitInsightsResult } from '../lib/aiTypes';
import type { Promise_, Completion, GoalCategory } from '../lib/supabase';

const INSIGHT_ICON: Record<string, React.ElementType> = {
  pattern:        TrendingUp,
  recommendation: Lightbulb,
  streak:         Flame,
  drop_off:       AlertTriangle,
};

const INSIGHT_COLOR: Record<string, string> = {
  pattern:        '#3D8EFF',
  recommendation: '#F59E0B',
  streak:         '#10B981',
  drop_off:       '#EF4444',
};

interface Props {
  category: GoalCategory;
  tasks: Promise_[];
  completions: Completion[];
  color: string;
}

export default function InsightsPanel({ category, tasks, completions, color }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HabitInsightsResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (!fetched && tasks.length > 0) fetchInsights();
  }, [tasks.length]);

  async function fetchInsights() {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('habit-insights', {
        body: {
          category,
          tasks: tasks.map(t => ({ id: t.id, title: t.title })),
          completions: completions.map(c => ({ promise_id: c.promise_id, date_key: c.date_key })),
        },
      });
      if (error) throw new Error(JSON.stringify(error));
      if (!data) throw new Error('No data returned');
      setResult(data as HabitInsightsResult);
    } catch (e) {
      const msg = (e as Error).message;
      console.error('habit-insights error:', msg);
      setError(msg);
    } finally {
      setLoading(false);
      setFetched(true);
    }
  }

  const debugLine = `t:${tasks.length} c:${completions.length} f:${fetched} l:${loading} e:${error ?? 'none'}`;

  return (
    <div className="space-y-3">
      <p className="text-white/30 text-[10px]">{debugLine}</p>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles size={12} style={{ color }} />
          <span className="text-white/50 text-[10px] uppercase tracking-widest font-semibold">AI Insights</span>
        </div>
        {fetched && !loading && (
          <button onClick={fetchInsights} className="text-white/20 hover:text-white/50 transition-colors">
            <RefreshCw size={12} />
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2.5 px-4 py-3.5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <Loader size={14} style={{ color }} className="animate-spin shrink-0" />
          <p className="text-white/40 text-xs">Analysing your habits…</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="px-4 py-3 rounded-2xl" style={{ background: 'rgba(248,113,113,0.08)' }}>
          <p className="text-red-300/70 text-xs">{error}</p>
          <button onClick={fetchInsights} className="text-red-300/40 text-[10px] mt-1 hover:text-red-300/60">Retry</button>
        </div>
      )}

      {/* Summary */}
      {result?.summary && !loading && (
        <p className="text-white/35 text-xs px-1 leading-relaxed">{result.summary}</p>
      )}

      {/* Insight cards */}
      {result?.insights.map((ins: HabitInsight, i: number) => {
        const Icon = INSIGHT_ICON[ins.type] ?? Lightbulb;
        const c = INSIGHT_COLOR[ins.type] ?? color;
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

      {result?.insights.length === 0 && !loading && (
        <p className="text-white/25 text-xs text-center py-2">No notable patterns yet — keep going!</p>
      )}
    </div>
  );
}
