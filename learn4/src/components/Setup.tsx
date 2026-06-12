import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore, type Mascot, type Density } from '../store/appStore';

const MASCOTS: { id: Mascot; emoji: string; name: string; trait: string }[] = [
  { id: 'owl', emoji: '🦉', name: 'Ollie the Owl', trait: 'Loves reading & big words' },
  { id: 'fox', emoji: '🦊', name: 'Finn the Fox', trait: 'Quick thinker & problem solver' },
  { id: 'panda', emoji: '🐼', name: 'Pea the Panda', trait: 'Calm, steady & never gives up' },
];

const THEMES = [
  { id: 'purple' as const, color: '#6366f1', label: 'Galaxy Purple' },
  { id: 'blue' as const, color: '#3b82f6', label: 'Ocean Blue' },
  { id: 'green' as const, color: '#10b981', label: 'Forest Green' },
  { id: 'orange' as const, color: '#f59e0b', label: 'Sunset Orange' },
];

export default function Setup() {
  const setupProfile = useAppStore(s => s.setupProfile);
  const [name, setName] = useState('');
  const [mascot, setMascot] = useState<Mascot>('owl');
  const [density, setDensity] = useState<Density>('younger');
  const [theme, setTheme] = useState<'purple' | 'blue' | 'green' | 'orange'>('purple');
  const [step, setStep] = useState(0);

  const chosen = MASCOTS.find(m => m.id === mascot)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Step 0: Name */}
        {step === 0 && (
          <div className="text-center space-y-6">
            <div className="text-6xl float">📚</div>
            <h1 className="text-3xl font-black text-gray-800">Welcome to Chucky!</h1>
            <p className="text-gray-500 text-lg">Your Year 4 learning adventure starts here.</p>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2 text-left">What's your name?</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && name.trim() && setStep(1)}
                placeholder="Type your first name..."
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-lg focus:outline-none focus:border-indigo-400 transition-colors"
                autoFocus
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => name.trim() && setStep(1)}
              disabled={!name.trim()}
              className="w-full py-3 rounded-2xl bg-indigo-500 text-white font-bold text-lg disabled:opacity-30 transition-opacity"
            >
              Next →
            </motion.button>
          </div>
        )}

        {/* Step 1: Mascot */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-2xl font-black text-gray-800 text-center">Choose your companion, {name}!</h2>
            <p className="text-gray-500 text-center">They'll cheer you on throughout every lesson.</p>
            <div className="space-y-3">
              {MASCOTS.map(m => (
                <motion.button
                  key={m.id}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setMascot(m.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                    mascot === m.id ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-4xl">{m.emoji}</span>
                  <div>
                    <div className="font-bold text-gray-800">{m.name}</div>
                    <div className="text-sm text-gray-500">{m.trait}</div>
                  </div>
                  {mascot === m.id && <span className="ml-auto text-indigo-500 text-xl">✓</span>}
                </motion.button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="px-6 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold">← Back</button>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setStep(2)}
                className="flex-1 py-3 rounded-2xl bg-indigo-500 text-white font-bold text-lg"
              >
                Next →
              </motion.button>
            </div>
          </div>
        )}

        {/* Step 2: Theme + Density */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-gray-800 text-center">Make it yours!</h2>

            <div>
              <p className="font-bold text-gray-700 mb-3">Colour theme:</p>
              <div className="grid grid-cols-4 gap-3">
                {THEMES.map(t => (
                  <motion.button
                    key={t.id}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setTheme(t.id)}
                    className={`p-3 rounded-2xl border-3 transition-all text-center ${theme === t.id ? 'border-gray-800 scale-105' : 'border-transparent'}`}
                    style={{ background: t.color + '22', borderColor: theme === t.id ? t.color : 'transparent' }}
                  >
                    <div className="w-8 h-8 rounded-full mx-auto mb-1" style={{ background: t.color }} />
                    <div className="text-xs font-semibold text-gray-600">{t.label.split(' ')[0]}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-bold text-gray-700 mb-3">Lesson style:</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'younger' as Density, label: '🌱 Easier', desc: 'Bigger text, simpler words, more hints' },
                  { id: 'older' as Density, label: '⚡ Standard', desc: 'Full curriculum level, more challenge' },
                ].map(d => (
                  <motion.button
                    key={d.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setDensity(d.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${density === d.id ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200'}`}
                  >
                    <div className="font-bold text-gray-800">{d.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{d.desc}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-6 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold">← Back</button>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setupProfile({ name: name.trim(), mascot, density, colorTheme: theme })}
                className="flex-1 py-3 rounded-2xl text-white font-bold text-lg"
                style={{ background: THEMES.find(t => t.id === theme)!.color }}
              >
                Let's go, {name}! {chosen.emoji}
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
