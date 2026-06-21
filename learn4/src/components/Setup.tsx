import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, type Mascot, type Density } from '../store/appStore';
import { upsertProfile } from '../lib/db';

const MASCOTS: { id: Mascot; emoji: string; name: string; trait: string; color: string }[] = [
  { id: 'owl', emoji: '🦉', name: 'Ollie the Owl', trait: 'Loves reading & big words', color: '#7C3AED' },
  { id: 'fox', emoji: '🦊', name: 'Finn the Fox', trait: 'Quick thinker & problem solver', color: '#EA580C' },
  { id: 'panda', emoji: '🐼', name: 'Pea the Panda', trait: 'Calm, steady & never gives up', color: '#0891B2' },
];

const THEMES = [
  { id: 'green' as const, color: '#58CC02', dark: '#46A302', label: '🌿 Forest' },
  { id: 'blue' as const, color: '#1CB0F6', dark: '#0E8FC4', label: '🌊 Ocean' },
  { id: 'purple' as const, color: '#A855F7', dark: '#7C3AED', label: '🪄 Galaxy' },
  { id: 'orange' as const, color: '#F97316', dark: '#EA580C', label: '🌅 Sunset' },
];

const STEPS = ['Name', 'Companion', 'Style'];

export default function Setup() {
  const setupProfile = useAppStore(s => s.setupProfile);
  const userId = useAppStore(s => s.userId);
  const [name, setName] = useState('');
  const [mascot, setMascot] = useState<Mascot>('owl');
  const [density, setDensity] = useState<Density>('younger');
  const [theme, setTheme] = useState<'purple' | 'blue' | 'green' | 'orange'>('green');
  const [step, setStep] = useState(0);

  const chosen = MASCOTS.find(m => m.id === mascot)!;
  const chosenTheme = THEMES.find(t => t.id === theme)!;

  return (
    <div className="min-h-screen leaf-bg flex items-center justify-center p-4">
      <motion.div
        className="card p-8 w-full max-w-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  i < step ? 'bg-green-500 text-white' :
                  i === step ? 'bg-gray-800 text-white' :
                  'bg-gray-200 text-gray-400'
                }`}
              >
                {i < step ? '✓' : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-1 rounded-full transition-all ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: Name */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              className="text-center space-y-6"
            >
              <div className="text-7xl float">🌱</div>
              <div>
                <h1 className="text-3xl font-black text-gray-800">Welcome to Chucky!</h1>
                <p className="text-gray-500 mt-2 font-semibold">Let's set up your learning profile</p>
              </div>
              <div className="text-left">
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-2">What's your name?</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && name.trim() && setStep(1)}
                  placeholder="Type your first name..."
                  className="input-duo text-lg"
                  autoFocus
                />
              </div>
              <button
                onClick={() => name.trim() && setStep(1)}
                disabled={!name.trim()}
                className="btn-duo btn-green w-full py-4 text-base"
              >
                Next →
              </button>
            </motion.div>
          )}

          {/* Step 1: Mascot */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              className="space-y-5"
            >
              <div className="text-center">
                <h2 className="text-2xl font-black text-gray-800">Choose your companion!</h2>
                <p className="text-gray-500 font-semibold mt-1">Hey {name}, who'll cheer you on?</p>
              </div>
              <div className="space-y-3">
                {MASCOTS.map(m => (
                  <motion.button
                    key={m.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMascot(m.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                      mascot === m.id ? 'border-b-4' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={mascot === m.id ? {
                      borderColor: m.color,
                      borderBottomColor: m.color,
                      background: m.color + '10',
                    } : {}}
                  >
                    <span className="text-4xl">{m.emoji}</span>
                    <div className="flex-1">
                      <div className="font-black text-gray-800">{m.name}</div>
                      <div className="text-sm text-gray-500 font-medium">{m.trait}</div>
                    </div>
                    {mascot === m.id && (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black"
                        style={{ background: m.color }}>✓</div>
                    )}
                  </motion.button>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(0)} className="btn-duo btn-ghost px-5 py-3">← Back</button>
                <button onClick={() => setStep(2)} className="btn-duo btn-green flex-1 py-3 text-base">Next →</button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Theme + Density */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-black text-gray-800">Make it yours!</h2>
                <p className="text-gray-500 font-semibold mt-1">Pick your style, {name}</p>
              </div>

              <div>
                <p className="font-black text-gray-600 text-xs uppercase tracking-wide mb-3">Colour theme</p>
                <div className="grid grid-cols-4 gap-3">
                  {THEMES.map(t => (
                    <motion.button
                      key={t.id}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => setTheme(t.id)}
                      className={`p-3 rounded-2xl text-center transition-all border-2 ${
                        theme === t.id ? 'border-b-4' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={theme === t.id ? {
                        borderColor: t.color,
                        borderBottomColor: t.dark,
                        background: t.color + '15',
                      } : {}}
                    >
                      <div className="w-8 h-8 rounded-full mx-auto mb-1.5 shadow-md"
                        style={{ background: t.color, boxShadow: `0 3px 0 ${t.dark}` }} />
                      <div className="text-xs font-black text-gray-600">{t.label.split(' ')[1]}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-black text-gray-600 text-xs uppercase tracking-wide mb-3">Lesson style</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'younger' as Density, label: '🌱 Easier', desc: 'Bigger text, simpler words, more hints' },
                    { id: 'older' as Density, label: '⚡ Standard', desc: 'Full curriculum level, more challenge' },
                  ].map(d => (
                    <motion.button
                      key={d.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setDensity(d.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        density === d.id ? 'border-b-4' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={density === d.id ? {
                        borderColor: chosenTheme.color,
                        borderBottomColor: chosenTheme.dark,
                        background: chosenTheme.color + '10',
                      } : {}}
                    >
                      <div className="font-black text-gray-800">{d.label}</div>
                      <div className="text-xs text-gray-500 mt-1 font-medium">{d.desc}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(1)} className="btn-duo btn-ghost px-5 py-3">← Back</button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={async () => {
                    setupProfile({ name: name.trim(), mascot, density, colorTheme: theme });
                    if (userId) {
                      await upsertProfile({ id: userId, name: name.trim(), role: 'student', mascot, density, color_theme: theme, teacher_id: null });
                    }
                  }}
                  className="btn-duo flex-1 py-3 text-base"
                  style={{ background: chosenTheme.color, borderBottomColor: chosenTheme.dark, color: '#fff' }}
                >
                  Let's go, {name}! {chosen.emoji}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
