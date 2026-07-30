import { useEffect, useState } from 'react';
import type React from 'react';
import { LogOut, Flame, Users, CreditCard, Dumbbell, Brain, Laugh, Smile, Meh, Frown, Sparkles, Star } from 'lucide-react';
import TraitAllocator from './TraitAllocator';
import SpeciesSelector from './SpeciesSelector';
import AiCheckin from './AiCheckin';
import { SPECIES_LIST } from '../lib/species';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import type { Promise_, Completion, GoalCategory } from '../lib/supabase';
import { applyDecayIfNeeded } from '../lib/petEngine';
import { isPlus, isPro } from '../lib/species';


function MoodIcon({ h, size = 14 }: { h: number; size?: number }) {
  if (h >= 80) return <Laugh size={size} />;
  if (h >= 60) return <Smile size={size} />;
  if (h >= 40) return <Meh size={size} />;
  return <Frown size={size} />;
}

const CATEGORY_CONFIG: Record<GoalCategory, { label: string; Icon: React.ElementType; color: string; tagline: string }> = {
  fitness: { label: 'Fitness', Icon: Dumbbell, color: '#FF4D4D', tagline: 'No goals yet' },
  focus:   { label: 'Focus',   Icon: Brain,    color: '#3D8EFF', tagline: 'No goals yet' },
};


export default function HomeScreen({
  onFriends, onPayment, onCategory,
}: {
  onFriends: () => void;
  onPayment: () => void;
  onCategory: (c: GoalCategory) => void;
}) {
  const pet = useAuthStore(s => s.pet);
  const profile = useAuthStore(s => s.profile);
  const signOut = useAuthStore(s => s.signOut);
  const updatePetState = useAuthStore(s => s.setPetLocal);

  const [promises, setPromises] = useState<Promise_[]>([]);
  const [history, setHistory] = useState<Completion[]>([]);
  const [showTraits, setShowTraits] = useState(false);
  const [showSpecies, setShowSpecies] = useState(false);

  const tier = profile?.subscription_tier ?? 'free';
  const plus = isPlus(tier);
  const pro = isPro(tier);

  useEffect(() => {
    loadData();
    if (pet) applyDecayIfNeeded(pet, pet.user_id).then(u => { if (u) updatePetState(u); });
  }, []);

  async function loadData() {
    if (!pet) return;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (plus ? 365 : 30));
    const [{ data: p }, { data: h }] = await Promise.all([
      supabase.from('promises').select('*').eq('user_id', pet.user_id).eq('active', true).order('created_at', { ascending: true }),
      supabase.from('completions').select('*').eq('user_id', pet.user_id).gte('date_key', cutoff.toISOString().slice(0, 10)),
    ]);
    if (p) setPromises(p);
    if (h) setHistory(h);
  }

  if (!pet) return null;

  const xpPct = pet.xp / pet.xp_to_next;
  const today = new Date().toISOString().slice(0, 10);
  const todayDoneIds = new Set(history.filter(h => h.date_key === today).map(h => h.promise_id));

  const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <>
      <div className="scene-bg" />
      <div className="scene-overlay" />
      {showTraits && <TraitAllocator onClose={() => setShowTraits(false)} />}
      {showSpecies && <SpeciesSelector onClose={() => setShowSpecies(false)} />}

      <div className="relative z-10 min-h-screen flex flex-col max-w-md mx-auto px-5 pt-12 pb-8">

        {/* Nav */}
        <div className="flex items-center justify-between mb-8 fade-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center gap-1.5 text-white/50 text-xs">
            <Flame size={12} className="text-white/50" strokeWidth={1.5} />
            <span className="text-white/70 font-medium">{pet.streak}</span>
            <span>day streak</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-white/30 text-xs mr-1">{profile?.username}</span>
            <button onClick={onPayment} className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white/70 transition-colors">
              <CreditCard size={15} strokeWidth={1.5} />
            </button>
            <button onClick={onFriends} className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white/70 transition-colors">
              <Users size={15} strokeWidth={1.5} />
            </button>
            <button onClick={signOut} className="w-8 h-8 flex items-center justify-center rounded-full text-white/25 hover:text-white/60 transition-colors">
              <LogOut size={15} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Pet — compact */}
        <div className="flex items-center gap-4 mb-8 fade-up" style={{ animationDelay: '0.1s' }}>
          <button onClick={() => setShowSpecies(true)} className="relative shrink-0">
            <div className="relative w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#141414', border: '1px solid #1E1E1E' }}>
              <Star size={26} strokeWidth={1.5} color="white" opacity={0.7} />
              <span className="absolute -bottom-0.5 -right-0.5 text-white/30"><MoodIcon h={pet.happiness} size={12} /></span>
            </div>
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-2">
              <h1 className="text-white text-xl font-semibold" style={{ letterSpacing: '-0.03em' }}>{pet.name}</h1>
              {pet.trait_points_available > 0 && (
                <button onClick={() => setShowTraits(true)} className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0" style={{ background: '#C91818', color: '#F2EEE8' }}>
                  {pet.trait_points_available} pts
                </button>
              )}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pet.happiness}%`, backgroundColor: '#A8A8A8' }} />
                </div>
                <span className="text-white/25 text-[10px] tabular-nums w-10 text-right">{pet.happiness}/100</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${xpPct * 100}%`, backgroundColor: '#505050' }} />
                </div>
                <span className="text-white/25 text-[10px] tabular-nums w-10 text-right">Lv {pet.level}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Date */}
        <p className="text-white/25 text-xs mb-5 fade-up" style={{ animationDelay: '0.15s' }}>{todayLabel}</p>

        {/* Category cards — Uiverse two-section style */}
        <div className="grid grid-cols-2 gap-3 fade-up" style={{ animationDelay: '0.2s' }}>
          {(Object.entries(CATEGORY_CONFIG) as [GoalCategory, typeof CATEGORY_CONFIG[GoalCategory]][]).map(([cat, cfg]) => {
            const catPromises = promises.filter(p => p.category === cat);
            const doneToday = catPromises.filter(p => todayDoneIds.has(p.id)).length;
            const allDone = catPromises.length > 0 && doneToday === catPromises.length;
            return (
              <button
                key={cat}
                onClick={() => onCategory(cat)}
                className="cat-card"
                style={{ '--cat-clr': cfg.color } as React.CSSProperties}
              >
                {/* Colored top section */}
                <div className="cat-card-top">
                  <cfg.Icon size={36} strokeWidth={1.5} color="white" />
                </div>
                {/* Dark body */}
                <div className="cat-card-body">
                  <div className="cat-card-header">
                    <span className="cat-card-title">{cfg.label}</span>
                    <div className="cat-card-menu">
                      <div className="cat-card-dot" />
                      <div className="cat-card-dot" />
                      <div className="cat-card-dot" />
                    </div>
                  </div>
                  <p className="cat-card-value">
                    {catPromises.length === 0 ? '—' : `${doneToday}/${catPromises.length}`}
                  </p>
                  <p className="cat-card-sub">
                    {catPromises.length === 0
                      ? cfg.tagline
                      : allDone
                        ? '✓ All done today'
                        : `${catPromises.length - doneToday} remaining`}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Pro AI check-in */}
        {pro && (
          <div className="mt-6 fade-up" style={{ animationDelay: '0.3s' }}>
            <AiCheckin petEmoji={SPECIES_LIST.find(s => s.id === pet.species)?.emoji ?? '⭐'} color="#ffffff" />
          </div>
        )}
        {!pro && (
          <button
            onClick={onPayment}
            className="mt-6 w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors fade-up"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', animationDelay: '0.3s' }}
          >
            <Sparkles size={14} className="text-white/25 shrink-0" strokeWidth={1.5} />
            <p className="text-white/25 text-xs flex-1 text-left">Upgrade to Pro for daily AI check-ins</p>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 text-white/30" style={{ background: '#1e1e1e' }}>Pro</span>
          </button>
        )}
      </div>
    </>
  );
}
