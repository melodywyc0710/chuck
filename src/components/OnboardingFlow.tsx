import { useState } from 'react';
import { Sparkles, ArrowRight, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

const TRAITS = [
  { id: 'gentle',   num: '01', label: 'Gentle',   desc: 'Calm & nurturing' },
  { id: 'playful',  num: '02', label: 'Playful',  desc: 'Energetic & fun' },
  { id: 'focused',  num: '03', label: 'Focused',  desc: 'Disciplined & sharp' },
  { id: 'creative', num: '04', label: 'Creative', desc: 'Curious & imaginative' },
];

function SlideToHatch({ onConfirm, disabled }: { onConfirm: () => void; disabled: boolean }) {
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
      <span className="flex-1 text-center text-white/60 text-sm font-medium pointer-events-none">Slide to hatch 🥚</span>
      <div className="flex items-center gap-0.5 pr-3 pointer-events-none">
        <ChevronRight size={14} className="text-white/40" />
        <ChevronRight size={14} className="text-white/50" />
        <ChevronRight size={14} className="text-white/60" />
      </div>
    </div>
  );
}

import { useRef } from 'react';

export default function OnboardingFlow() {
  const [step, setStep] = useState<'name' | 'trait' | 'hatching' | 'done'>('name');
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
      species: 'fluffkin',
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

  if (step === 'hatching') {
    return (
      <>
        <div className="scene-bg" />
        <div className="scene-overlay" />
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center">
          <div className="relative">
            <div className="text-8xl" style={{ animation: 'eggShake 0.4s ease-in-out infinite' }}>🥚</div>
            <div className="absolute inset-0 rounded-full bg-yellow-300/20 blur-3xl scale-150 animate-pulse" />
          </div>
          <p className="mt-8 text-white/40 text-sm tracking-widest uppercase" style={{ animation: 'fadeIn 0.5s ease forwards' }}>hatching…</p>
        </div>
      </>
    );
  }

  if (step === 'done') {
    return (
      <>
        <div className="scene-bg" />
        <div className="scene-overlay" />
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <div className="text-8xl mb-6 fade-up" style={{ animationDelay: '0s' }}>🐣</div>
          <h2 className="font-playfair italic text-white text-4xl mb-3 fade-up" style={{ animationDelay: '0.15s', letterSpacing: '-0.04em' }}>
            {petName || 'Mochi'} hatched!
          </h2>
          <p className="text-white/40 text-sm max-w-xs leading-relaxed fade-up" style={{ animationDelay: '0.3s' }}>
            Your companion is here. Keep your promises and watch them grow.
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

  if (step === 'trait') {
    return (
      <>
        <div className="scene-bg" />
        <div className="scene-overlay" />
        <div className="relative z-10 min-h-screen flex flex-col px-6 pt-14 pb-6" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

          {/* Badge */}
          <div className="fade-up mb-10" style={{ animationDelay: '0.1s' }}>
            <div className="liquid-glass inline-flex items-center gap-2 px-3 py-2.5 rounded-full">
              <Sparkles size={12} className="text-white/80" />
              <span className="text-white/90 text-xs font-medium">Nagi Onboarding</span>
            </div>
          </div>

          {/* Title */}
          <div className="mb-8 fade-up" style={{ animationDelay: '0.25s' }}>
            <p className="text-white/60 text-sm mb-2">Choose all that apply</p>
            <h2 className="font-playfair italic text-white text-3xl leading-tight" style={{ letterSpacing: '-0.04em' }}>
              What best describes {petName || 'your companion'}?
            </h2>
          </div>

          {/* Selection grid */}
          <div className="grid grid-cols-2 gap-3 flex-1 fade-up" style={{ animationDelay: '0.4s' }}>
            {TRAITS.map((t, i) => {
              const isSelected = selected.includes(t.id);
              return (
                <button
                  key={t.id}
                  onClick={() => toggleTrait(t.id)}
                  className={`rounded-[32px] p-4 flex flex-col justify-between text-left transition-all duration-200 active:scale-[0.97] fade-up`}
                  style={{
                    height: 100,
                    animationDelay: `${0.4 + i * 0.08}s`,
                  }}
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

          {/* Slide to hatch */}
          <div className="mt-6 fade-up" style={{ animationDelay: '0.85s' }}>
            <SlideToHatch onConfirm={createPet} disabled={selected.length === 0} />
          </div>
        </div>
      </>
    );
  }

  // Name step
  return (
    <>
      <div className="scene-bg" />
      <div className="scene-overlay" />
      <div className="relative z-10 min-h-screen flex flex-col px-6 pt-14 pb-6" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

        {/* Badge */}
        <div className="fade-up mb-10" style={{ animationDelay: '0.1s' }}>
          <div className="liquid-glass inline-flex items-center gap-2 px-3 py-2.5 rounded-full">
            <Sparkles size={12} className="text-white/80" />
            <span className="text-white/90 text-xs font-medium">Nagi Onboarding</span>
          </div>
        </div>

        {/* Egg */}
        <div className="flex justify-center mb-8 fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="text-8xl">🥚</div>
        </div>

        {/* Title */}
        <div className="mb-8 fade-up" style={{ animationDelay: '0.25s' }}>
          <p className="text-white/60 text-sm mb-2">Step 1 of 2</p>
          <h2 className="font-playfair italic text-white text-3xl leading-tight" style={{ letterSpacing: '-0.04em' }}>
            You found an egg!<br />What will you name them?
          </h2>
        </div>

        <div className="flex-1" />

        {/* Name input */}
        <div className="space-y-4 fade-up" style={{ animationDelay: '0.4s' }}>
          <input
            type="text"
            placeholder="Name your companion…"
            value={petName}
            onChange={e => setPetName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && setStep('trait')}
            maxLength={20}
            autoFocus
            className="w-full px-4 py-3.5 rounded-2xl text-white placeholder-white/30 text-sm outline-none transition-all text-center liquid-glass"
            style={{ background: 'rgba(255,255,255,0.07)' }}
          />

          {/* Slide to next */}
          <div className="fade-up" style={{ animationDelay: '0.55s' }}>
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
      </div>
    </>
  );
}
