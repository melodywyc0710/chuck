import { useState } from 'react';
import { Dumbbell, Brain, Zap, Wind } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import type { TraitKey } from '../lib/supabase';

const TRAITS: { key: TraitKey; label: string; Icon: React.ElementType; desc: string; color: string }[] = [
  { key: 'trait_strength',     label: 'Strength',     Icon: Dumbbell, desc: 'Physical power & endurance', color: '#FF4D4D' },
  { key: 'trait_intelligence', label: 'Intelligence',  Icon: Brain,    desc: 'Focus, memory & learning',   color: '#3D8EFF' },
  { key: 'trait_agility',      label: 'Agility',       Icon: Zap,      desc: 'Speed & reflexes',           color: '#FF4D4D' },
  { key: 'trait_speed',        label: 'Speed',         Icon: Wind,     desc: 'Efficiency & momentum',      color: '#3D8EFF' },
];
import type React from 'react';

const MAX_TRAIT = 50;

interface Props {
  onClose: () => void;
}

export default function TraitAllocator({ onClose }: Props) {
  const pet = useAuthStore(s => s.pet);
  const setPet = useAuthStore(s => s.setPetLocal);
  const user = useAuthStore(s => s.user);
  const [saving, setSaving] = useState(false);
  // local pending allocations — how many extra points to add per trait
  const [pending, setPending] = useState<Record<TraitKey, number>>({
    trait_strength: 0, trait_intelligence: 0, trait_agility: 0, trait_speed: 0,
  });

  if (!pet || !user) return null;

  const pointsLeft = pet.trait_points_available - Object.values(pending).reduce((a, b) => a + b, 0);

  function add(key: TraitKey) {
    if (pointsLeft <= 0) return;
    if ((pet![key] + pending[key]) >= MAX_TRAIT) return;
    setPending(p => ({ ...p, [key]: p[key] + 1 }));
  }

  function remove(key: TraitKey) {
    if (pending[key] <= 0) return;
    setPending(p => ({ ...p, [key]: p[key] - 1 }));
  }

  const totalPending = Object.values(pending).reduce((a, b) => a + b, 0);

  async function confirm() {
    if (!pet || !user || totalPending === 0) { onClose(); return; }
    setSaving(true);
    const updates: Record<string, number> = {
      trait_points_available: pet.trait_points_available - totalPending,
    };
    for (const t of TRAITS) {
      updates[t.key] = pet[t.key] + pending[t.key];
    }
    const { data } = await supabase.from('pets').update(updates).eq('user_id', user.id).select().single();
    if (data) setPet(data);
    setSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-8" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
      <div className="liquid-glass rounded-[32px] w-full max-w-md p-6 fade-up" style={{ animationDelay: '0s' }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-white text-xl font-semibold" style={{ letterSpacing: '-0.02em' }}>Train your pet</h2>
          <div className="liquid-glass px-3 py-1 rounded-full">
            <span className="text-white text-sm font-semibold">{pointsLeft}</span>
            <span className="text-white/40 text-xs ml-1">pts left</span>
          </div>
        </div>
        <p className="text-white/40 text-xs mb-5">Distribute your earned points</p>

        {/* Trait rows */}
        <div className="space-y-3 mb-6">
          {TRAITS.map(({ key, label, Icon, desc, color }) => {
            const current = pet[key];
            const added = pending[key];
            const total = current + added;
            const pct = (total / MAX_TRAIT) * 100;
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Icon size={15} strokeWidth={1.5} style={{ color }} />
                    <div>
                      <span className="text-white/80 text-sm font-medium">{label}</span>
                      <span className="text-white/25 text-xs ml-2">{desc}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => remove(key)}
                      disabled={added === 0}
                      className="w-6 h-6 rounded-full bg-white/10 text-white/60 text-sm flex items-center justify-center disabled:opacity-20 hover:bg-white/20 transition-colors"
                    >−</button>
                    <span className="text-white text-sm font-semibold w-6 text-center tabular-nums">{total}</span>
                    <button
                      onClick={() => add(key)}
                      disabled={pointsLeft <= 0 || total >= MAX_TRAIT}
                      className="w-6 h-6 rounded-full text-white text-sm flex items-center justify-center disabled:opacity-20 hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: color }}
                    >+</button>
                  </div>
                </div>
                <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
                {added > 0 && (
                  <p className="text-[10px] mt-0.5" style={{ color }}> +{added} pending</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Confirm */}
        <button
          onClick={confirm}
          disabled={saving}
          className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-50"
          style={{ background: totalPending > 0 ? '#FF4D4D' : '#1e1e1e' }}
        >
          {saving ? 'Saving…' : totalPending > 0 ? `Confirm — ${totalPending} point${totalPending > 1 ? 's' : ''} allocated` : 'Skip for now'}
        </button>
      </div>
    </div>
  );
}

