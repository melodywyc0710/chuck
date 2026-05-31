import { motion, AnimatePresence } from 'framer-motion';
import { CREATURES } from '../data/creatures';
import { usePetStore } from '../store/petStore';

const MOOD_MESSAGES = {
  ecstatic: ['Absolutely thriving!', 'Pure joy overflowing!', 'On top of the world!', 'Nothing could be better!'],
  happy: ['Feeling wonderful today!', 'All smiles here~', 'So glad we\'re together!', 'Life is good!'],
  content: ['Cozy and at peace.', 'Everything feels right.', 'Just chilling~', 'Serene and happy.'],
  calm: ['Taking it easy today.', 'A quiet, peaceful day.', 'Resting gently.', 'Here with you always.'],
};

function getMood(happiness: number) {
  if (happiness >= 85) return 'ecstatic';
  if (happiness >= 65) return 'happy';
  if (happiness >= 40) return 'content';
  return 'calm';
}

const MOOD_EMOJI = { ecstatic: '🤩', happy: '😊', content: '😌', calm: '🌿' };

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function PetDisplay() {
  const { mbtiType, petName, level, isLevelingUp, happiness } = usePetStore();
  if (!mbtiType) return null;

  const creature = CREATURES[mbtiType];
  const mood = getMood(happiness);

  const animClass = {
    float: 'pet-float',
    bounce: 'pet-bounce',
    wiggle: 'pet-wiggle',
    pulse: 'pet-float pet-pulse',
  }[creature.idleAnimation];

  return (
    <div className="flex flex-col items-center justify-center py-8 relative">
      <AnimatePresence>
        {isLevelingUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <div className="text-center">
              <motion.div
                className="text-6xl mb-2"
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.6 }}
              >
                🌟
              </motion.div>
              <div
                className="text-3xl font-black"
                style={{ color: creature.accentColor, textShadow: `0 0 20px ${creature.glowColor}` }}
              >
                LEVEL UP!
              </div>
              <div className="text-white text-xl font-bold">Level {level}</div>
              <div className="text-slate-300 text-sm mt-1">You're doing amazing!</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Orbit ring + pet */}
      <div className="relative flex items-center justify-center mb-4">
        <div
          className="absolute rounded-full border-2 opacity-20 spin-slow"
          style={{ width: 180, height: 180, borderColor: creature.glowColor, borderStyle: 'dashed' }}
        />
        <div
          className="absolute rounded-full opacity-10"
          style={{ width: 160, height: 160, background: `radial-gradient(circle, ${creature.glowColor}88, transparent)` }}
        />
        <div
          className={`text-9xl select-none cursor-default ${animClass}`}
          style={{ filter: `drop-shadow(0 0 30px ${creature.glowColor})` }}
        >
          {creature.emoji}
        </div>
      </div>

      <div className="text-center mb-3">
        <h2
          className="text-3xl font-black mb-1"
          style={{ color: creature.textColor, textShadow: `0 0 10px ${creature.glowColor}66` }}
        >
          {petName}
        </h2>
        <div className="text-sm font-semibold opacity-70" style={{ color: creature.accentColor }}>
          {creature.species} · Lv.{level}
        </div>
      </div>

      {/* Mood bubble — always warm */}
      <motion.div
        key={mood}
        initial={{ opacity: 0, y: 8, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="rounded-2xl px-4 py-2 text-sm font-medium border"
        style={{
          background: `${creature.glowColor}22`,
          borderColor: `${creature.glowColor}44`,
          color: creature.textColor,
        }}
      >
        {MOOD_EMOJI[mood]} {pickRandom(MOOD_MESSAGES[mood])}
      </motion.div>
    </div>
  );
}
