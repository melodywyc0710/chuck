import { useState, useRef } from 'react';
import { Sparkles, ArrowRight, ChevronRight, Lock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { SPECIES_LIST } from '../lib/species';

const TRAITS = [
  { id: 'gentle',   num: '01', label: 'Gentle',   desc: 'Calm & nurturing' },
  { id: 'playful',  num: '02', label: 'Playful',  desc: 'Energetic & fun' },
  { id: 'focused',  num: '03', label: 'Focused',  desc: 'Disciplined & sharp' },
  { id: 'creative', num: '04', label: 'Creative', desc: 'Curious & imaginative' },
];

const EGG_IMAGES: Record<string, string> = {
  melmel: '/eggs/egg-melmel.png',
  lolo:   '/eggs/egg-lolo.png',
  didi:   '/eggs/egg-didi.png',
  chacha: '/eggs/egg-chacha.png',
  kiki:   '/eggs/egg-kiki.png',
};

const EGG_FILTER: Record<string, string> = {
  melmel: 'none',
  lolo:   'hue-rotate(30deg) saturate(1.2)',
  didi:   'hue-rotate(120deg) saturate(1.3)',
  chacha: 'hue-rotate(260deg) saturate(1.1)',
  kiki:   'hue-rotate(200deg) saturate(1.4)',
};

const TIER_LABEL: Record<string, string> = {
  plus: 'Plus',
  pro: 'Pro',
};

function SlideToHatch({ onConfirm, disabled, label = 'Slide to hatch 🥚' }: { onConfirm: () => void; disabled: boolean; label?: string }) {
  const [x, setX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const trackWidth = 280 - 52 - 8;

  function onPointerDown(e: React.PointerEvent) {
    if (disabled) return;
    setDragging(true);
    startX.current = e.clientX - x;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    setX(Math.max(0, Math.min(e.clientX - startX.current, trackWidth)));
  }
  function onPointerUp() {
    if (!dragging) return;
    setDragging(false);
    if (x / trackWidth > 0.85) { setX(trackWidth); setTimeout(onConfirm, 200); }
    else setX(0);
  }

  return (
    <div className="relative liquid-glass rounded-full h-14 flex items-center px-1 select-none" style={{ opacity: disabled ? 0.4 : 1 }}>
      <div
        className="absolute left-1 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md z-10 cursor-grab active:cursor-grabbing touch-none"
        style={{ transform: `translateX(${x}px)`, transition: dragging ? 'none' : 'transform 0.35s cubic-bezier(0.22,1,0.36,1)' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <ArrowRight size={18} className="text-gray-800" />
      </div>
      <span className="flex-1 text-center text-white/60 text-sm font-medium pointer-events-none">{label}</span>
      <div className="flex items-center gap-0.5 pr-3 pointer-events-none">
        <ChevronRight size={14} className="text-white/40" />
        <ChevronRight size={14} className="text-white/50" />
        <ChevronRight size={14} className="text-white/60" />
      </div>
    </div>
  );
}

export default function OnboardingFlow() {
  const [step, setStep] = useState<'species' | 'name' | 'trait' | 'hatching' | 'done'>('species');
  const [selectedSpecies, setSelectedSpecies] = useState('melmel');
  const [petName, setPetName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState('');

  const user = useAuthStore(s => s.user);
  const refreshPet = useAuthStore(s => s.refreshPet);

  function toggleTrait(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  async function createPet() {
    if (!user) return;
    const trait = selected[0] ?? 'gentle';
    const { error: err } = await supabase.from('pets').insert({
      user_id: user.id,
      name: petName.trim() || 'Mochi',
      species: selectedSpecies,
      color_seed: Math.floor(Math.random() * 360),
      personality_trait: trait,
      hatched: false,
    });
    if (err) { setError(err.message); return; }
    setStep('hatching');
    setTimeout(async () => {
      await supabase.from('pets').update({ hatched: true }).eq('user_id', user.id);
      await refreshPet();
      setStep('done');
    }, 2400);
  }

  // ── Species pick ──────────────────────────────────────────────────────────
  if (step === 'species') {
    return (
      <>
        <div className="scene-bg" />
        <div className="scene-overlay" />
        <div className="relative z-10 min-h-screen flex flex-col px-6 pt-14 pb-6">

          <div className="fade-up mb-8" style={{ animationDelay: '0.1s' }}>
            <div className="liquid-glass inline-flex items-center gap-2 px-3 py-2.5 rounded-full">
              <Sparkles size={12} className="text-white/80" />
              <span className="text-white/90 text-xs font-medium">IAM</span>
            </div>
          </div>

          <div className="mb-8 fade-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-white/40 text-sm mb-1">Step 1 of 3</p>
            <h2 className="text-white text-3xl font-semibold leading-tight" style={{ letterSpacing: '-0.04em' }}>
              Choose your<br />companion
            </h2>
            <p className="text-white/40 text-xs mt-2">Free users start with Melmel — unlock more species later</p>
          </div>

          <div className="grid grid-cols-3 gap-3 flex-1 fade-up" style={{ animationDelay: '0.35s' }}>
            {SPECIES_LIST.map((s, i) => {
              const locked = s.requiredTier !== 'free';
              const isSelected = selectedSpecies === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => !locked && setSelectedSpecies(s.id)}
                  className="flex flex-col items-center gap-2 p-3 rounded-[24px] transition-all active:scale-95 fade-up"
                  style={{
                    animationDelay: `${0.35 + i * 0.06}s`,
                    background: isSelected ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.05)',
                    boxShadow: isSelected ? `0 0 0 1.5px rgba(255,255,255,0.3)` : 'none',
                    opacity: locked ? 0.5 : 1,
                  }}
                >
                  <div className="relative w-full aspect-square flex items-center justify-center">
                    <img
                      src={EGG_IMAGES[s.id]}
                      alt={s.name}
                      className="w-full h-full object-contain drop-shadow-lg"
                      style={{ filter: EGG_FILTER[s.id] ?? 'none' }}
                    />
                    {locked && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                        <Lock size={14} className="text-white/70" />
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: s.requiredTier === 'pro' ? 'rgba(200,80,255,0.5)' : 'rgba(80,140,255,0.5)', color: '#fff' }}
                        >
                          {TIER_LABEL[s.requiredTier]}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-white text-xs font-medium">{s.name}</p>
                    <p className="text-white/30 text-[9px] leading-tight mt-0.5">{s.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 fade-up" style={{ animationDelay: '0.75s' }}>
            <div
              className="relative liquid-glass rounded-full h-14 flex items-center px-1 select-none cursor-pointer"
              onClick={() => setStep('name')}
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md z-10">
                <ArrowRight size={18} className="text-gray-800" />
              </div>
              <span className="flex-1 text-center text-white/60 text-sm font-medium">Next →</span>
              <div className="flex items-center gap-0.5 pr-3">
                <ChevronRight size={14} className="text-white/40" />
                <ChevronRight size={14} className="text-white/50" />
                <ChevronRight size={14} className="text-white/60" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Name step ─────────────────────────────────────────────────────────────
  if (step === 'name') {
    const speciesData = SPECIES_LIST.find(s => s.id === selectedSpecies)!;
    return (
      <>
        <div className="scene-bg" />
        <div className="scene-overlay" />
        <div className="relative z-10 min-h-screen flex flex-col px-6 pt-14 pb-6">

          <div className="fade-up mb-8" style={{ animationDelay: '0.1s' }}>
            <div className="liquid-glass inline-flex items-center gap-2 px-3 py-2.5 rounded-full">
              <Sparkles size={12} className="text-white/80" />
              <span className="text-white/90 text-xs font-medium">IAM</span>
            </div>
          </div>

          <div className="flex justify-center mb-6 fade-up" style={{ animationDelay: '0.2s' }}>
            <img src={EGG_IMAGES[selectedSpecies]} alt={speciesData.name} className="w-36 h-36 object-contain drop-shadow-2xl" style={{ filter: EGG_FILTER[selectedSpecies] ?? 'none' }} />
          </div>

          <div className="mb-8 fade-up" style={{ animationDelay: '0.3s' }}>
            <p className="text-white/40 text-sm mb-1">Step 2 of 3</p>
            <h2 className="text-white text-3xl font-semibold leading-tight" style={{ letterSpacing: '-0.04em' }}>
              You found a<br />{speciesData.name} egg!
            </h2>
            <p className="text-white/40 text-sm mt-2">{speciesData.description}</p>
          </div>

          <div className="flex-1" />

          <div className="space-y-4 fade-up" style={{ animationDelay: '0.4s' }}>
            <input
              type="text"
              placeholder="Name your companion…"
              value={petName}
              onChange={e => setPetName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && setStep('trait')}
              maxLength={20}
              autoFocus
              className="app-input text-center"
            />
            <div
              className="relative liquid-glass rounded-full h-14 flex items-center px-1 select-none cursor-pointer"
              onClick={() => setStep('trait')}
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md z-10">
                <ArrowRight size={18} className="text-gray-800" />
              </div>
              <span className="flex-1 text-center text-white/60 text-sm font-medium">Next step →</span>
              <div className="flex items-center gap-0.5 pr-3">
                <ChevronRight size={14} className="text-white/40" />
                <ChevronRight size={14} className="text-white/50" />
                <ChevronRight size={14} className="text-white/60" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Trait step ────────────────────────────────────────────────────────────
  if (step === 'trait') {
    return (
      <>
        <div className="scene-bg" />
        <div className="scene-overlay" />
        <div className="relative z-10 min-h-screen flex flex-col px-6 pt-14 pb-6">

          <div className="fade-up mb-8" style={{ animationDelay: '0.1s' }}>
            <div className="liquid-glass inline-flex items-center gap-2 px-3 py-2.5 rounded-full">
              <Sparkles size={12} className="text-white/80" />
              <span className="text-white/90 text-xs font-medium">IAM</span>
            </div>
          </div>

          <div className="mb-6 fade-up" style={{ animationDelay: '0.25s' }}>
            <p className="text-white/40 text-sm mb-1">Step 3 of 3</p>
            <h2 className="text-white text-3xl font-semibold leading-tight" style={{ letterSpacing: '-0.04em' }}>
              What best describes<br />{petName || 'your companion'}?
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 flex-1 fade-up" style={{ animationDelay: '0.4s' }}>
            {TRAITS.map((t, i) => {
              const isSelected = selected.includes(t.id);
              return (
                <button
                  key={t.id}
                  onClick={() => toggleTrait(t.id)}
                  className="relative rounded-[32px] p-4 flex flex-col justify-between text-left transition-all duration-200 active:scale-[0.97] fade-up"
                  style={{ height: 100, animationDelay: `${0.4 + i * 0.08}s` }}
                >
                  <div className={`absolute inset-0 rounded-[32px] ${isSelected ? 'liquid-glass-selected' : 'liquid-glass'}`} />
                  <span className="relative text-white/50 text-xs font-medium">{t.num}</span>
                  <div className="relative">
                    <p className="text-white text-base font-medium">{t.label}</p>
                    <p className="text-white/40 text-xs mt-0.5">{t.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {error && <p className="text-red-400/80 text-xs text-center mt-4">{error}</p>}

          <div className="mt-6 fade-up" style={{ animationDelay: '0.85s' }}>
            <SlideToHatch onConfirm={createPet} disabled={selected.length === 0} />
          </div>
        </div>
      </>
    );
  }

  // ── Hatching ──────────────────────────────────────────────────────────────
  if (step === 'hatching') {
    return (
      <>
        <div className="scene-bg" />
        <div className="scene-overlay" />
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center">
          <div className="relative">
            <img
              src={EGG_IMAGES[selectedSpecies]}
              alt="hatching"
              className="w-44 h-44 object-contain drop-shadow-2xl"
              style={{ animation: 'eggShake 0.25s ease-in-out infinite', filter: EGG_FILTER[selectedSpecies] ?? 'none' }}
            />
            <div className="absolute inset-0 rounded-full blur-3xl scale-150 animate-pulse" style={{ background: 'rgba(220,200,80,0.2)' }} />
          </div>
          <p className="mt-8 text-white/40 text-sm tracking-widest uppercase">hatching…</p>
        </div>
      </>
    );
  }

  // ── Done ──────────────────────────────────────────────────────────────────
  const speciesData = SPECIES_LIST.find(s => s.id === selectedSpecies)!;
  return (
    <>
      <div className="scene-bg" />
      <div className="scene-overlay" />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="text-8xl mb-6 fade-up" style={{ animationDelay: '0s' }}>{speciesData.emoji}</div>
        <h2 className="text-white text-4xl font-semibold mb-3 fade-up" style={{ animationDelay: '0.15s', letterSpacing: '-0.04em' }}>
          {petName || 'Mochi'} hatched!
        </h2>
        <p className="text-white/40 text-sm max-w-xs leading-relaxed fade-up" style={{ animationDelay: '0.3s' }}>
          Your {speciesData.name} is here. Keep your promises and watch them grow.
        </p>
        <button
          onClick={() => refreshPet()}
          className="mt-10 px-8 py-3.5 bg-white/10 liquid-glass text-white rounded-full font-medium text-sm transition-all hover:bg-white/15 active:scale-95 fade-up"
          style={{ animationDelay: '0.5s' }}
        >
          Let's go →
        </button>
      </div>
    </>
  );
}
