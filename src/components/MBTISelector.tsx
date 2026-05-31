import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CREATURES, MBTI_GROUPS, type MBTIType } from '../data/creatures';
import { usePetStore } from '../store/petStore';

export default function MBTISelector() {
  const [selected, setSelected] = useState<MBTIType | null>(null);
  const [name, setName] = useState('');
  const selectMBTI = usePetStore(s => s.selectMBTI);

  const creature = selected ? CREATURES[selected] : null;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.1,
              animation: `pulse-glow ${2 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 relative z-10"
      >
        <h1 className="text-5xl font-bold text-white mb-2">
          ✨ Mystic Companions ✨
        </h1>
        <p className="text-slate-400 text-lg">Choose your MBTI type to meet your destined creature</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl relative z-10 mb-8">
        {MBTI_GROUPS.map((group, gi) => (
          <motion.div
            key={group.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.1 }}
            className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-2xl p-4"
          >
            <h3 className="text-slate-400 text-xs uppercase tracking-widest mb-3 font-semibold">{group.label}</h3>
            <div className="grid grid-cols-2 gap-2">
              {group.types.map(type => {
                const c = CREATURES[type];
                const isSelected = selected === type;
                return (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelected(type)}
                    className={`relative p-3 rounded-xl border text-left transition-all duration-200 ${
                      isSelected
                        ? 'border-transparent text-white'
                        : 'border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
                    }`}
                    style={isSelected ? {
                      background: `linear-gradient(135deg, ${c.glowColor}33, ${c.glowColor}11)`,
                      borderColor: c.glowColor,
                      boxShadow: `0 0 20px ${c.glowColor}44`,
                    } : {}}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{c.emoji}</span>
                      <div>
                        <div className="font-bold text-sm">{type}</div>
                        <div className="text-xs opacity-60">{c.species}</div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {creature && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-md relative z-10 mb-6"
          >
            <div
              className="rounded-3xl p-6 border text-center"
              style={{
                background: `linear-gradient(135deg, ${creature.glowColor}22, ${creature.glowColor}08)`,
                borderColor: `${creature.glowColor}66`,
                boxShadow: `0 0 40px ${creature.glowColor}33`,
              }}
            >
              <div
                className="text-8xl mb-4 inline-block pet-float"
                style={{ filter: `drop-shadow(0 0 20px ${creature.glowColor})` }}
              >
                {creature.emoji}
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{creature.name}</h2>
              <div className="text-sm font-semibold mb-3" style={{ color: creature.accentColor }}>
                {creature.species} · {creature.personality}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">{creature.description}</p>

              <div className="mb-4">
                <label className="text-slate-400 text-xs uppercase tracking-widest block mb-2">
                  Name your companion
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={creature.name}
                  maxLength={20}
                  className="w-full bg-slate-900/60 border border-slate-600 rounded-xl px-4 py-2 text-white text-center placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => selectMBTI(selected!, name || creature.name)}
                className="w-full py-3 rounded-xl font-bold text-slate-900 transition-all"
                style={{ background: creature.accentColor }}
              >
                Begin Your Journey →
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
