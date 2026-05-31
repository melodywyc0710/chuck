import { motion } from 'framer-motion';
import { CREATURES } from '../data/creatures';
import { usePetStore } from '../store/petStore';
import PetDisplay from './PetDisplay';
import StatsPanel from './StatsPanel';
import InteractionPanel from './InteractionPanel';
import GoalsPanel from './GoalsPanel';

export default function GameView() {
  const { mbtiType, resetPet } = usePetStore();
  if (!mbtiType) return null;

  const creature = CREATURES[mbtiType];

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${creature.bgGradient} relative overflow-hidden`}
      style={{ '--glow-color': creature.glowColor } as React.CSSProperties}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: creature.glowColor }}
      />
      <div
        className="absolute bottom-0 right-0 w-64 h-64 rounded-full opacity-10 blur-2xl pointer-events-none"
        style={{ background: creature.accentColor }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-5 pb-2">
        <div>
          <h1 className="text-xl font-black text-white">✨ Mystic Companions</h1>
          <p className="text-xs" style={{ color: creature.accentColor }}>{mbtiType} · {creature.species}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { if (confirm('Start over with a new companion?')) resetPet(); }}
          className="text-xs text-slate-500 hover:text-slate-300 border border-slate-700 rounded-lg px-3 py-1.5 transition-colors"
        >
          New Pet
        </motion.button>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-xl mx-auto px-4 pb-8 space-y-4">
        <PetDisplay />
        <StatsPanel />
        <InteractionPanel />
        <GoalsPanel />
      </div>
    </div>
  );
}
