import { useEffect, useState } from 'react';
import { ChevronLeft, BarChart2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import type { Promise_, Completion } from '../lib/supabase';
import HistoryChart from './HistoryChart';

interface CompletionWithTitle extends Completion {
  promise_title: string;
}

export default function StatsScreen({ onBack }: { onBack: () => void }) {
  const pet = useAuthStore(s => s.pet);
  const [promises, setPromises] = useState<Promise_[]>([]);
  const [history, setHistory] = useState<CompletionWithTitle[]>([]);
  const [tab, setTab] = useState<'fitness' | 'focus'>('fitness');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pet) return;
    (async () => {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      const [{ data: p }, { data: h }] = await Promise.all([
        supabase.from('promises').select('*').eq('user_id', pet.user_id).eq('active', true),
        supabase.from('completions').select('*').eq('user_id', pet.user_id).gte('date_key', cutoff.toISOString().slice(0, 10)).order('completed_at', { ascending: false }),
      ]);
      const allPromises = p ?? [];
      const allHistory = (h ?? []).map(c => ({
        ...c,
        promise_title: allPromises.find(x => x.id === c.promise_id)?.title ?? 'Unknown',
      }));
      setPromises(allPromises);
      setHistory(allHistory);
      setLoading(false);
    })();
  }, [pet?.user_id]);

  const catColor = tab === 'fitness' ? '#FF4D4D' : '#3D8EFF';
  const catPromises = promises.filter(p => p.category === tab);
  const catHistory = history.filter(c => catPromises.some(p => p.id === c.promise_id));

  return (
    <>
      <div className="scene-bg" />
      <div className="scene-overlay" />
      <div className="relative z-10 min-h-screen flex flex-col max-w-md mx-auto px-5 pt-12 pb-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8 fade-up" style={{ animationDelay: '0.05s' }}>
          <button onClick={onBack} className="liquid-glass w-9 h-9 flex items-center justify-center rounded-full text-white/60 hover:text-white/90 transition-colors">
            <ChevronLeft size={16} />
          </button>
          <div>
            <p className="text-white/40 text-xs">your progress</p>
            <h1 className="text-white text-xl font-semibold" style={{ letterSpacing: '-0.02em' }}>Statistics</h1>
          </div>
          <BarChart2 size={18} className="ml-auto text-white/20" strokeWidth={1.5} />
        </div>

        {/* Tabs */}
        <div className="liquid-glass rounded-full p-1 flex mb-6 fade-up" style={{ animationDelay: '0.1s' }}>
          {(['fitness', 'focus'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-all duration-300 ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-white/50 hover:text-white/80'}`}
            >
              {t === 'fitness' ? 'Fitness' : 'Focus'}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="fade-up" style={{ animationDelay: '0.2s' }}>
          {loading ? (
            <div className="text-center py-16">
              <p className="text-white/20 text-sm">Loading…</p>
            </div>
          ) : catPromises.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-white/20 text-sm">No {tab} goals yet.</p>
              <p className="text-white/15 text-xs mt-1">Add goals to start tracking progress.</p>
            </div>
          ) : (
            <HistoryChart history={catHistory} promises={catPromises} color={catColor} />
          )}
        </div>
      </div>
    </>
  );
}
