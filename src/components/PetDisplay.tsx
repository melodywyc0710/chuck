import { motion, AnimatePresence } from 'framer-motion';
import { CREATURES } from '../data/creatures';
import { usePetStore } from '../store/petStore';

const MOOD_MESSAGES: Record<string, string[]> = {
  happy: ['Feeling fantastic!', 'Life is wonderful~', 'So full of joy!', 'This is the best day!'],
  content: ['Doing just fine.', 'All is well.', 'Comfortable and cozy.', 'A peaceful moment.'],
  sad: ['A little lonely...', 'Could use some love.', 'Feeling a bit blue.', 'Play with me?'],
  hungry: ['So hungry...', 'Please feed me!', 'My tummy is empty.', 'Need food!'],
};

function getMood(happiness: number, hp: number) {
  if (hp < 30) return 'hungry';
  if (happiness >= 70) return 'happy';
  if (happiness >= 40) return 'content';
  return 'sad';
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function PetDisplay() {
  const { mbtiType, petName, level, isLevelingUp, hp, happiness } = usePetStore();
  if (!mbtiType) return null;

  const creature = CREATURES[mbtiType];
  const mood = getMood(happiness, hp);

  const animClass = {
    float: 'pet-float',
    bounce: 'pet-bounce',
    wiggle: 'pet-wiggle',
    pulse: 'pet-float pet-pulse',
  }[creature.idleAnimation];

  return (
    <div className="flex flex-col items-center justify-center py-8 relative">
      {/* Level up burst */}
      <AnimatePresence>
        {isLevelingUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <div className="text-center">
              <div className="text-6xl mb-2">🌟</div>
              <div
                className="text-3xl font-black"
                style={{ color: creature.accentColor, textShadow: `0 0 20px ${creature.glowColor}` }}
              >
                LEVEL UP!
              </div>
              <div className="text-white text-xl font-bold">Level {level}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative orbit ring */}
      <div className="relative flex items-center justify-center mb-4">
        <div
          className="absolute rounded-full border-2 opacity-20 spin-slow"
          style={{
            width: 180,
            height: 180,
            borderColor: creature.glowColor,
            borderStyle: 'dashed',
          }}
        />
        <div
          className="absolute rounded-full opacity-10"
          style={{
            width: 160,
            height: 160,
            background: `radial-gradient(circle, ${creature.glowColor}88, transparent)`,
          }}
        />

        {/* Pet emoji */}
        <motion.div
          className={`text-9xl select-none cursor-default ${animClass}`}
          style={{
            filter: `drop-shadow(0 0 30px ${creature.glowColor})`,
          }}
        >
          {creature.emoji}
        </motion.div>
      </div>

      {/* Pet name & species */}
      <motion.div className="text-center mb-3">
        <h2
          className="text-3xl font-black mb-1"
          style={{ color: creature.textColor, textShadow: `0 0 10px ${creature.glowColor}66` }}
        >
          {petName}
        </h2>
        <div className="text-sm font-semibold opacity-70" style={{ color: creature.accentColor }}>
          {creature.species} · Lv.{level}
        </div>
      </motion.div>

      {/* Mood speech bubble */}
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
        {mood === 'happy' && '😊 '}
        {mood === 'content' && '😌 '}
        {mood === 'sad' && '😢 '}
        {mood === 'hungry' && '😫 '}
        {pickRandom(MOOD_MESSAGES[mood])}
      </motion.div>
    </div>
  );
}
