import { useEffect, useState } from 'react';
import type React from 'react';
import { LogOut, Flame, Users, CreditCard, Dumbbell, Brain, Laugh, Smile, Meh, Frown, Sparkles, Star, BarChart2, Check } from 'lucide-react';

import TraitAllocator from './TraitAllocator';
import SpeciesSelector from './SpeciesSelector';
import AiCheckin from './AiCheckin';
import { SPECIES_LIST, getStageImage } from '../lib/species';
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

const CATEGORY_DEFAULTS: Record<GoalCategory, { label: string; Icon: React.ElementType; color: string }> = {
  fitness: { label: 'Fitness', Icon: Dumbbell, color: '#FF4D4D' },
  focus:   { label: 'Focus',   Icon: Brain,    color: '#3D8EFF' },
};

function getCategoryConfig() {
  return (Object.keys(CATEGORY_DEFAULTS) as GoalCategory[]).reduce((acc, cat) => {
    acc[cat] = {
      ...CATEGORY_DEFAULTS[cat],
      color: localStorage.getItem(`cat-color-${cat}`) ?? CATEGORY_DEFAULTS[cat].color,
    };
    return acc;
  }, {} as Record<GoalCategory, { label: string; Icon: React.ElementType; color: string }>);
}


export default function HomeScreen({
  onFriends, onPayment, onStats, onCategory,
}: {
  onFriends: () => void;
  onPayment: () => void;
  onStats: () => void;
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
  const [wiggling, setWiggling] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [categoryConfig] = useState(getCategoryConfig);

  const tier = profile?.subscription_tier ?? 'free';
  const plus = isPlus(tier);
  const pro = isPro(tier);

  useEffect(() => {
    loadData();
    if (pet) applyDecayIfNeeded(pet, pet.user_id).then(u => { if (u) updatePetState(u); });
  }, []);

  async function loadData() {
    if (!pet) return;
    const completionsQuery = (() => {
      const q = supabase.from('completions').select('*').eq('user_id', pet.user_id);
      if (!plus) {
        const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 30);
        return q.gte('date_key', cutoff.toISOString().slice(0, 10));
      }
      return q;
    })();
    const [{ data: p }, { data: h }] = await Promise.all([
      supabase.from('promises').select('*').eq('user_id', pet.user_id).eq('active', true).order('created_at', { ascending: true }),
      completionsQuery,
    ]);
    if (p) setPromises(p);
    if (h) setHistory(h);
  }

  if (!pet) return null;

  const MOOD_MESSAGES: Record<string, string[]> = {
    happy:   ['Yay! ✨', 'I love you!', 'Let\'s go! 🌟', 'So happy~', 'You\'re the best!'],
    good:    ['Hi there! 👋', 'Keep it up!', 'Feeling good!', 'You got this~', '*happy wiggle*'],
    meh:     ['...hi.', 'I\'m okay.', 'Maybe a goal today?', 'Mmmph.', 'Could be better~'],
    sad:     ['I miss you...', 'Please come back 🥺', 'I\'m lonely...', 'Don\'t forget me~', '*sad eyes*'],
  };

  function getMoodKey(h: number) {
    if (h >= 80) return 'happy';
    if (h >= 60) return 'good';
    if (h >= 40) return 'meh';
    return 'sad';
  }

  function tapPet() {
    if (wiggling) return;
    const msgs = MOOD_MESSAGES[getMoodKey(pet!.happiness)];
    setBubble(msgs[Math.floor(Math.random() * msgs.length)]);
    setWiggling(true);
    setTimeout(() => setWiggling(false), 600);
    setTimeout(() => setBubble(null), 2200);
  }

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
            <button onClick={onStats} className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white/70 transition-colors">
              <BarChart2 size={15} strokeWidth={1.5} />
            </button>
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
          <div className="relative shrink-0">
            {bubble && (
              <div className="pet-bubble absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-2xl text-xs font-medium z-20"
                style={{ background: '#1e1e1e', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>
                {bubble}
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-0 h-0" style={{ borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid #1e1e1e' }} />
              </div>
            )}
            <button onClick={tapPet} className="relative block" aria-label="Pet melmel">
              <div className={`relative w-16 h-16 rounded-full flex items-center justify-center overflow-hidden${wiggling ? ' pet-wiggle' : ''}`} style={{ background: '#141414', border: '1px solid #1E1E1E' }}>
                {(() => {
                  const stageImg = getStageImage(pet.species, pet.level);
                  return stageImg
                    ? <img src={stageImg} alt={pet.name} className="w-full h-full object-contain" />
                    : <Star size={26} strokeWidth={1.5} color="white" opacity={0.7} />;
                })()}
                <span className="absolute -bottom-0.5 -right-0.5 text-white/30"><MoodIcon h={pet.happiness} size={12} /></span>
              </div>
            </button>
            <button onClick={() => setShowSpecies(true)} className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center z-10" style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)' }} aria-label="Change species">
              <Star size={9} strokeWidth={2} color="rgba(255,255,255,0.4)" />
            </button>
          </div>
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

        {/* Category cards */}
        <div className="grid grid-cols-2 gap-3 fade-up" style={{ animationDelay: '0.2s' }}>
          {(Object.entries(categoryConfig) as [GoalCategory, typeof categoryConfig[GoalCategory]][]).map(([cat, cfg]) => {
            const catPromises = promises.filter(p => p.category === cat);
            const doneToday = catPromises.filter(p => todayDoneIds.has(p.id)).length;
            const allDone = catPromises.length > 0 && doneToday === catPromises.length;
            const pct = catPromises.length > 0 ? doneToday / catPromises.length : 0;
            return (
              <button
                key={cat}
                onClick={() => onCategory(cat)}
                className="relative rounded-[24px] overflow-hidden text-left transition-all duration-200 active:scale-[0.97]"
                style={{ background: '#111111', border: '1px solid #1e1e1e', minHeight: 160, display: 'flex', flexDirection: 'column', width: '100%' }}
              >
                {/* Color glow top band */}
                <div className="relative flex items-center justify-center" style={{ background: cfg.color, height: 88, width: '100%', flexShrink: 0 }}>
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0.15) 100%)' }} />
                  <cfg.Icon size={40} strokeWidth={1.4} color="white" style={{ opacity: 0.95, position: 'relative' }} />
                  {allDone && catPromises.length > 0 && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
                      <Check size={12} color="white" strokeWidth={2.5} />
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 px-4 pt-3 pb-3 gap-1" style={{ background: '#141414', marginTop: -6, borderRadius: '14px 14px 0 0' }}>
                  <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>{cfg.label}</span>

                  {catPromises.length === 0 ? (
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>Tap to add goals</p>
                  ) : (
                    <>
                      <p className="font-semibold text-white leading-none" style={{ fontSize: 22, letterSpacing: '-0.04em' }}>
                        {doneToday}<span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', letterSpacing: 0 }}>/{catPromises.length}</span>
                      </p>
                      {/* Progress bar */}
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)', marginTop: 2 }}>
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct * 100}%`, background: cfg.color }} />
                      </div>

                    </>
                  )}
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
