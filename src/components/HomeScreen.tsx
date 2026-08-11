import { useEffect, useState } from 'react';
import { LogOut, Flame, Users, CreditCard, Laugh, Smile, Meh, Frown, Sparkles, Star, BarChart2, Check, Plus, ChevronRight } from 'lucide-react';

import TraitAllocator from './TraitAllocator';
import SpeciesSelector from './SpeciesSelector';
import AiCheckin from './AiCheckin';
import { SPECIES_LIST, getStageImage } from '../lib/species';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { applyDecayIfNeeded } from '../lib/petEngine';
import { isPro } from '../lib/species';
import type { Habit, HabitLog } from '../lib/habitTypes';

const TYPE_LABEL: Record<string, string> = {
  complete: 'Complete', timer: 'Timer', counter: 'Counter', numeric: 'Number',
  avoid: 'Avoid', journal: 'Journal', checklist: 'Checklist', workout: 'Workout',
};

function MoodIcon({ h, size = 14 }: { h: number; size?: number }) {
  if (h >= 80) return <Laugh size={size} />;
  if (h >= 60) return <Smile size={size} />;
  if (h >= 40) return <Meh size={size} />;
  return <Frown size={size} />;
}


export default function HomeScreen({
  onFriends, onPayment, onStats, onHabits,
}: {
  onFriends: () => void;
  onPayment: () => void;
  onStats: () => void;
  onHabits: () => void;
}) {
  const pet = useAuthStore(s => s.pet);
  const profile = useAuthStore(s => s.profile);
  const signOut = useAuthStore(s => s.signOut);
  const updatePetState = useAuthStore(s => s.setPetLocal);

  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayLogs, setTodayLogs] = useState<Record<string, HabitLog>>({});
  const [habitsLoading, setHabitsLoading] = useState(true);
  const [showTraits, setShowTraits] = useState(false);
  const [showSpecies, setShowSpecies] = useState(false);
  const [wiggling, setWiggling] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);

  const tier = profile?.subscription_tier ?? 'free';
  const pro = isPro(tier);

  useEffect(() => {
    loadData();
    if (pet) applyDecayIfNeeded(pet, pet.user_id).then(u => { if (u) updatePetState(u); });
  }, []);

  async function loadData() {
    if (!pet) return;
    const dateKey = new Date().toISOString().slice(0, 10);
    try {
      const [{ data: h }, { data: l }] = await Promise.all([
        supabase.from('habits').select('*').eq('user_id', pet.user_id).eq('archived', false).order('sort_order'),
        supabase.from('habit_logs').select('*').eq('user_id', pet.user_id).eq('date_key', dateKey),
      ]);
      if (h) setHabits(h.map(x => ({ ...x, checklist_items: x.checklist_items ?? [] })) as Habit[]);
      if (l) {
        const map: Record<string, HabitLog> = {};
        for (const log of l) map[log.habit_id] = log as HabitLog;
        setTodayLogs(map);
      }
    } catch (e) {
      console.error('HomeScreen loadData error:', e);
    } finally {
      setHabitsLoading(false);
    }
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
  const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const doneCount = habits.filter(h => !!todayLogs[h.id]).length;

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

        {/* Today's habits */}
        <div className="fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/30 text-[10px] uppercase tracking-widest">Today</p>
            {habits.length > 0 && (
              <span className="text-white/20 text-[10px]">{doneCount}/{habits.length}</span>
            )}
          </div>

          {habitsLoading && (
            <div className="flex justify-center py-8">
              <div className="w-4 h-4 rounded-full border-2 border-white/15 border-t-white/50 animate-spin" />
            </div>
          )}

          {!habitsLoading && habits.length === 0 && (
            <button
              onClick={onHabits}
              className="w-full flex flex-col items-center justify-center py-10 rounded-[24px] transition-all active:scale-[0.98]"
              style={{ background: '#111111', border: '1px dashed rgba(255,255,255,0.1)' }}
            >
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3" style={{ background: 'rgba(255,77,77,0.1)' }}>
                <Plus size={18} style={{ color: '#FF4D4D' }} strokeWidth={2} />
              </div>
              <p className="text-white/40 text-sm font-medium">Add your first habit</p>
              <p className="text-white/20 text-xs mt-1">Workout, journal, meditate and more</p>
            </button>
          )}

          {!habitsLoading && habits.length > 0 && (
            <div className="space-y-2">
              {habits.slice(0, 5).map(habit => {
                const done = !!todayLogs[habit.id];
                return (
                  <button
                    key={habit.id}
                    onClick={onHabits}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-[18px] text-left transition-all active:scale-[0.98]"
                    style={{
                      background: done ? 'rgba(16,185,129,0.06)' : '#111111',
                      border: `1px solid ${done ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.07)'}`,
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: done ? 'rgba(16,185,129,0.15)' : 'rgba(255,77,77,0.1)' }}
                    >
                      {done
                        ? <Check size={13} style={{ color: '#10B981' }} strokeWidth={2.5} />
                        : <div className="w-2 h-2 rounded-full" style={{ background: '#FF4D4D', opacity: 0.7 }} />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: done ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.8)', textDecoration: done ? 'line-through' : 'none' }}>
                        {habit.name}
                      </p>
                      <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                        {TYPE_LABEL[habit.tracking_type] ?? habit.tracking_type}
                        {habit.target_value != null && ` · ${habit.target_value}${habit.target_unit ? ' ' + habit.target_unit : ''}`}
                      </p>
                    </div>
                  </button>
                );
              })}
              {habits.length > 5 && (
                <button
                  onClick={onHabits}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-[18px] text-xs transition-all active:scale-[0.98]"
                  style={{ color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.03)' }}
                >
                  {habits.length - 5} more <ChevronRight size={11} />
                </button>
              )}
              <button
                onClick={onHabits}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[18px] text-xs font-medium transition-all active:scale-[0.98]"
                style={{ color: 'rgba(255,77,77,0.7)', background: 'rgba(255,77,77,0.06)', border: '1px solid rgba(255,77,77,0.12)' }}
              >
                <Plus size={12} strokeWidth={2.5} /> Add habit
              </button>
            </div>
          )}
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
