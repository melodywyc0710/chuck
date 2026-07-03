import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, PLAYER_LEVELS, getPlayerLevel, FARM_ANIMAL_CONFIG, FARM_DAILY_CAP } from '../store/appStore';
import { ROOM_ITEMS } from '../data/rewards';
import { BADGES } from '../data/badges';
import { sounds } from '../utils/sounds';

const THEME_COLOR = { purple: '#A855F7', blue: '#1CB0F6', green: '#58CC02', orange: '#F97316' };
const THEME_DARK  = { purple: '#7C3AED', blue: '#0E8FC4', green: '#46A302', orange: '#EA580C' };
type TabType = 'room' | 'shop' | 'farm' | 'badges';
type Category = 'all' | 'furniture' | 'pet' | 'decoration' | 'window';

const FARM_ANIMALS = ['chicken', 'sheep', 'cow', 'horse', 'peacock', 'llama', 'elephant', 'tiger', 'dragon', 'unicorn'];
const ANIMAL_EMOJI: Record<string, string> = {
  chicken: '🐔', sheep: '🐑', cow: '🐄', horse: '🐴',
  peacock: '🦚', llama: '🦙', elephant: '🐘', tiger: '🐯', dragon: '🐉', unicorn: '🦄',
};
const ANIMAL_COST: Record<string, number> = {
  chicken: 8, sheep: 20, cow: 45, horse: 80,
  peacock: 150, llama: 300, elephant: 600, tiger: 1200, dragon: 2500, unicorn: 5000,
};
const WEEKLY_GOAL = 5;

// Star rank system based on lifetime stars earned
const RANKS = [
  { name: 'Seedling', min: 0,    emoji: '🌱', color: '#6b7280' },
  { name: 'Sprout',   min: 50,   emoji: '🌿', color: '#16a34a' },
  { name: 'Scholar',  min: 150,  emoji: '📚', color: '#2563eb' },
  { name: 'Champion', min: 350,  emoji: '🏆', color: '#d97706' },
  { name: 'Master',   min: 700,  emoji: '💎', color: '#7c3aed' },
  { name: 'Legend',   min: 1200, emoji: '⚡', color: '#dc2626' },
];
function getRank(lifetime: number) {
  let rank = RANKS[0];
  for (const r of RANKS) { if (lifetime >= r.min) rank = r; }
  return rank;
}
function getNextRank(lifetime: number) {
  for (const r of RANKS) { if (r.min > lifetime) return r; }
  return null;
}

const COMPANION_LINES: Record<string, string[][]> = {
  owl: [
    ['Hoot hoot!', "I'm so proud of you!", 'Keep collecting stars!'],
    ['Wisdom is knowing...', '...that practice makes perfect!', "You're doing brilliantly."],
    ['Did you know?', 'Owls can rotate their heads 270°!', 'Now THAT\'s a fun fact.'],
    ['Time to study!', 'Every lesson makes you smarter.', 'I believe in you!'],
  ],
  fox: [
    ['Hey there, smarty!', 'Foxes are clever — just like you!', 'Keep it up!'],
    ['Yip yip!', "You've been working so hard.", "I'm your biggest fan!"],
    ['Quick tip!', 'Review your lessons daily.', 'Even 5 minutes helps!'],
    ['Wow wow wow!', 'Look at all those stars!', "You're amazing!"],
  ],
  panda: [
    ['Nom nom...', '...eating knowledge like bamboo!', "You're doing great!"],
    ['Slow and steady', 'wins the race — and you\'re racing!', "I'm so proud."],
    ['Chill vibes only', 'But serious about learning!', "That's the panda way."],
    ['Big panda hug!', 'Your hard work shows.', "Don't stop now!"],
  ],
};

function PetBody({ type, size = 80 }: { type: 'owl' | 'fox' | 'panda'; size?: number }) {
  if (type === 'owl') return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <ellipse cx="40" cy="52" rx="22" ry="26" fill="#8B6914"/>
      <ellipse cx="40" cy="28" rx="18" ry="18" fill="#A07820"/>
      <circle cx="33" cy="26" r="7" fill="white"/><circle cx="47" cy="26" r="7" fill="white"/>
      <circle cx="33" cy="27" r="4" fill="#2d1b00"/><circle cx="47" cy="27" r="4" fill="#2d1b00"/>
      <circle cx="34" cy="26" r="1.5" fill="white"/><circle cx="48" cy="26" r="1.5" fill="white"/>
      <ellipse cx="40" cy="34" rx="4" ry="3" fill="#E8A020"/>
      <ellipse cx="28" cy="54" rx="6" ry="4" fill="#7a5810" transform="rotate(-15 28 54)"/>
      <ellipse cx="52" cy="54" rx="6" ry="4" fill="#7a5810" transform="rotate(15 52 54)"/>
      <ellipse cx="33" cy="72" rx="5" ry="3" fill="#E8A020"/>
      <ellipse cx="47" cy="72" rx="5" ry="3" fill="#E8A020"/>
      <path d="M24 20 Q28 10 32 18" stroke="#A07820" strokeWidth="3" fill="none"/>
      <path d="M56 20 Q52 10 48 18" stroke="#A07820" strokeWidth="3" fill="none"/>
    </svg>
  );
  if (type === 'fox') return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <ellipse cx="40" cy="55" rx="20" ry="22" fill="#E8650A"/>
      <ellipse cx="40" cy="30" rx="16" ry="16" fill="#F07820"/>
      <ellipse cx="40" cy="36" rx="9" ry="8" fill="#FDE8D8"/>
      <path d="M24 22 L18 8 L30 18 Z" fill="#F07820"/>
      <path d="M56 22 L62 8 L50 18 Z" fill="#F07820"/>
      <path d="M24 22 L20 12 L29 19 Z" fill="white"/>
      <path d="M56 22 L60 12 L51 19 Z" fill="white"/>
      <circle cx="34" cy="28" r="4" fill="white"/><circle cx="46" cy="28" r="4" fill="white"/>
      <circle cx="34" cy="29" r="2.5" fill="#1a1a2e"/><circle cx="46" cy="29" r="2.5" fill="#1a1a2e"/>
      <circle cx="35" cy="28" r="1" fill="white"/><circle cx="47" cy="28" r="1" fill="white"/>
      <ellipse cx="40" cy="35" rx="3" ry="2" fill="#c45010"/>
      <ellipse cx="34" cy="72" rx="5" ry="3" fill="#E8650A"/>
      <ellipse cx="46" cy="72" rx="5" ry="3" fill="#E8650A"/>
      <ellipse cx="60" cy="58" rx="14" ry="6" fill="#E8650A" transform="rotate(-30 60 58)"/>
      <ellipse cx="60" cy="58" rx="10" ry="4" fill="white" transform="rotate(-30 60 58)"/>
    </svg>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <ellipse cx="40" cy="54" rx="22" ry="24" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
      <ellipse cx="40" cy="30" rx="18" ry="18" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
      <ellipse cx="30" cy="24" rx="8" ry="8" fill="#1a1a2e"/>
      <ellipse cx="50" cy="24" rx="8" ry="8" fill="#1a1a2e"/>
      <circle cx="34" cy="30" r="5" fill="white"/><circle cx="46" cy="30" r="5" fill="white"/>
      <circle cx="34" cy="31" r="3" fill="#1a1a2e"/><circle cx="46" cy="31" r="3" fill="#1a1a2e"/>
      <circle cx="35" cy="30" r="1.2" fill="white"/><circle cx="47" cy="30" r="1.2" fill="white"/>
      <ellipse cx="40" cy="37" rx="4" ry="3" fill="#e0a0a0"/>
      <ellipse cx="24" cy="56" rx="7" ry="5" fill="#1a1a2e"/>
      <ellipse cx="56" cy="56" rx="7" ry="5" fill="#1a1a2e"/>
      <ellipse cx="34" cy="73" rx="5" ry="3" fill="#1a1a2e"/>
      <ellipse cx="46" cy="73" rx="5" ry="3" fill="#1a1a2e"/>
    </svg>
  );
}

const ANIMAL_GREETINGS: Record<string, string[]> = {
  chicken: ['Cluck cluck! 🐣', 'Bawk bawk! 🌾', 'Cluck! ⭐'],
  sheep:   ['Baaaa! 🌿', 'Baaa! ⭐', 'Fluffy hug! 🤗'],
  cow:     ['Mooooo! 🌾', 'Moo! ⭐', 'Mooo! 🥛'],
  horse:   ['Neigh! 🌟', 'Nay nay! ⭐', 'Gallop! 🏇'],
  peacock: ['Screech! 🦚', 'So pretty! ✨', 'Look at me! 🌟'],
  llama:   ['Mwwah! 🦙', 'Spit! 💦', 'Llama love! ⭐'],
  elephant:['Trumpet! 🎺', 'Toot toot! ⭐', 'Big hug! 🤗'],
  tiger:   ['Roarrr! 🐯', 'Grr! ⭐', 'Pounce! 💥'],
  dragon:  ['RAWR! 🔥', 'Fire! 🐉', 'Fly! ⭐'],
  unicorn: ['Sparkle! ✨', 'Magic! 🌈', 'Shine! ⭐'],
};

interface WalkState {
  fromX: number;
  toX: number;
  duration: number;
  facing: 1 | -1;
}

function useWalker(idx: number): { x: number; facing: 1 | -1; bump: () => void } {
  const SEED_OFFSETS = [7, 23, 41, 13, 57, 31, 3, 47, 19, 61];
  const seedOff = SEED_OFFSETS[idx % SEED_OFFSETS.length];
  const [state, setState] = useState<WalkState>(() => {
    const from = (seedOff + idx * 9) % 72 + 4;
    const to = Math.min(96, from + 15 + (idx * 7) % 30);
    return { fromX: from, toX: to, duration: 4 + (idx * 1.3) % 4, facing: 1 };
  });
  const [x, setX] = useState(state.fromX);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    let running = true;
    function tick(now: number) {
      if (!running) return;
      if (!startRef.current) startRef.current = now;
      const elapsed = (now - startRef.current) / 1000;
      const s = stateRef.current;
      const t = Math.min(1, elapsed / s.duration);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setX(s.fromX + (s.toX - s.fromX) * eased);
      if (t >= 1) {
        // Pick a new random destination anywhere across the farm
        const newFrom = s.toX;
        const span = 20 + Math.floor(Math.random() * 55);
        const goRight = Math.random() > 0.5;
        const newTo = goRight
          ? Math.min(92, newFrom + span)
          : Math.max(4, newFrom - span);
        startRef.current = now;
        setState({ fromX: newFrom, toX: newTo, duration: 3 + Math.random() * 5, facing: newTo > newFrom ? 1 : -1 });
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(rafRef.current); };
  }, []);

  const bump = () => {
    // On tap, spring toward a new spot on the other side
    void stateRef.current;
    const currentX = x;
    const newTo = currentX > 50 ? 4 + Math.random() * 30 : 60 + Math.random() * 30;
    startRef.current = 0;
    setState({ fromX: currentX, toX: newTo, duration: 1.5 + Math.random() * 1.5, facing: newTo > currentX ? 1 : -1 });
  };

  return { x, facing: state.facing, bump };
}

function WalkingAnimal({ plot, idx, petNames, containerRef }: {
  plot: { id: string; animalId: string | null; placedAt: string };
  idx: number;
  petNames: Record<string, string>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { x, facing, bump } = useWalker(idx);
  const [bubble, setBubble] = useState<string | null>(null);
  const [hearts, setHearts] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState<number | null>(null);
  const animalId = plot.animalId!;
  const customName = petNames[animalId];

  const displayX = dragX !== null ? dragX : x;
  const displayFacing = dragX !== null ? (dragX > x ? 1 : -1) : facing;

  const startDrag = (_clientX: number) => {
    setDragging(true);
    setDragX(x);
    const onMove = (e: MouseEvent | TouchEvent) => {
      const cx = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const pct = Math.max(2, Math.min(92, ((cx - rect.left) / rect.width) * 100));
      setDragX(pct);
    };
    const onEnd = () => {
      setDragging(false);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchend', onEnd);
      // Release back to autonomous walking from current drag position
      setDragX(null);
      bump();
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchend', onEnd);
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    startDrag(clientX);
  };

  const handleTap = () => {
    if (dragging) return;
    bump();
    const msgs = ANIMAL_GREETINGS[animalId] ?? ['Hi! ⭐'];
    setBubble(msgs[Math.floor(Math.random() * msgs.length)]);
    setHearts(true);
    setTimeout(() => setBubble(null), 1800);
    setTimeout(() => setHearts(false), 1000);
  };

  return (
    <div
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
      onClick={handleTap}
      style={{
        position: 'absolute',
        bottom: 2,
        left: `${displayX}%`,
        transform: `scaleX(${displayFacing})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: dragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        transition: dragging ? 'none' : 'left 0.05s linear',
        zIndex: dragging ? 30 : 10,
        touchAction: 'none',
      }}
    >
      {/* Speech bubble */}
      <AnimatePresence>
        {bubble && (
          <motion.div
            key="bubble"
            initial={{ opacity: 0, y: 4, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.8 }}
            style={{
              position: 'absolute',
              bottom: '110%',
              left: '50%',
              transform: `translateX(-50%) scaleX(${facing})`,
              background: 'white',
              borderRadius: 10,
              padding: '3px 8px',
              fontSize: 11,
              fontWeight: 800,
              color: '#374151',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              zIndex: 20,
            }}
          >
            {bubble}
            <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid white' }} />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Heart burst */}
      <AnimatePresence>
        {hearts && (
          <motion.div
            key="hearts"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            style={{ position: 'absolute', bottom: '130%', fontSize: 14, pointerEvents: 'none', zIndex: 20 }}
          >
            ❤️
          </motion.div>
        )}
      </AnimatePresence>
      {/* Name tag */}
      {customName && (
        <div style={{
          fontSize: '9px', fontWeight: 800, color: '#fff',
          background: 'rgba(0,0,0,0.5)', borderRadius: 6,
          padding: '1px 5px', marginBottom: 1, whiteSpace: 'nowrap',
          transform: `scaleX(${facing})`,
        }}>
          {customName}
        </div>
      )}
      <div style={{ fontSize: '1.8rem', lineHeight: 1 }}>{ANIMAL_EMOJI[animalId]}</div>
    </div>
  );
}

function FarmScene({ farmPlots, petNames }: {
  farmPlots: { id: string; animalId: string | null; placedAt: string }[];
  petNames: Record<string, string>;
}) {
  const occupied = farmPlots.filter(p => p.animalId);
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={containerRef} className="relative rounded-3xl overflow-hidden shadow-xl" style={{ height: 240 }}>
      {/* Sky */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #7dd3fc 0%, #bae6fd 55%, #86efac 55%, #4ade80 100%)' }}/>
      {/* Sun */}
      <div className="absolute top-3 right-6 w-10 h-10 rounded-full bg-yellow-300" style={{ boxShadow: '0 0 22px rgba(253,224,71,0.9)' }}/>
      {/* Clouds */}
      <div className="absolute top-5 left-6 flex gap-1">
        <div className="w-14 h-5 bg-white rounded-full opacity-90"/>
        <div className="w-8 h-5 bg-white rounded-full opacity-90 -ml-4"/>
      </div>
      <div className="absolute top-8 left-24 flex gap-1">
        <div className="w-10 h-4 bg-white rounded-full opacity-70"/>
        <div className="w-6 h-4 bg-white rounded-full opacity-70 -ml-3"/>
      </div>
      {/* Fence */}
      <div className="absolute inset-x-0 flex justify-around px-4" style={{ bottom: 52 }}>
        {[...Array(10)].map((_, i) => (
          <div key={i} className="w-2.5 bg-amber-800 rounded-t-sm" style={{ height: 22 }}/>
        ))}
      </div>
      <div className="absolute inset-x-4 h-1.5 bg-amber-700 rounded-full" style={{ bottom: 64 }}/>
      {/* Ground */}
      <div className="absolute bottom-0 inset-x-0 h-14" style={{ background: 'linear-gradient(180deg, #86efac 0%, #4ade80 100%)' }}/>
      {/* Animals */}
      <div className="absolute bottom-1 inset-x-0" style={{ height: 56 }}>
        {occupied.length === 0 ? (
          <p className="text-center text-white/80 text-xs font-bold mt-4">Place animals below to earn stars!</p>
        ) : (
          occupied.map((plot, idx) => (
            <WalkingAnimal key={plot.id} plot={plot} idx={idx} petNames={petNames} containerRef={containerRef} />
          ))
        )}
      </div>
      {/* Tap hint */}
      {occupied.length > 0 && (
        <div className="absolute top-3 left-4 text-xs font-bold text-white/60 pointer-events-none">Tap an animal! 👆</div>
      )}
    </div>
  );
}

export default function RewardsRoom() {
  const {
    profile, totalStars, ownedItems, placedItems, buyItem, togglePlaced, setView,
    itemPositions, setItemPosition, itemQuantities,
    farmPlots, placeFarmAnimal, removeFarmAnimal, collectFarmStars, sellFarmAnimal,
    unlockedBadges, firstLoginDate,
    farmDailyStars, farmLastDay, lifetimeStarsEarned,
    lastLoginBonus, currentStreak, claimDailyBonus,
    weeklyLessonsCount, weeklyLessonsWeek, weeklyChallengeCollected, claimWeeklyBonus,
    pendingBabyBonus, dismissBabyBonus,
    petNames, namePet,
  } = useAppStore();

  // Fix: default to 0 weeks (not 99) so new items are properly locked
  const weeksEnrolled = firstLoginDate
    ? Math.floor((Date.now() - new Date(firstLoginDate).getTime()) / (7 * 24 * 3600 * 1000))
    : 0;

  const [tab, setTab] = useState<TabType>('room');
  const [filter, setFilter] = useState<Category>('all');
  const [companionIdx, setCompanionIdx] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [showBubble, setShowBubble] = useState(false);
  const [bounce, setBounce] = useState(false);
  const [selectedFarmAnimal, setSelectedFarmAnimal] = useState<string | null>(null);
  const [showDailyBonus, setShowDailyBonus] = useState(false);
  const [dailyBonusAmount, setDailyBonusAmount] = useState(0);
  const roomRef = useRef<HTMLDivElement>(null);
  const prevBadgesRef = useRef<string[]>([]);

  // Auto-claim daily login bonus on mount
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    if (lastLoginBonus !== today) {
      const streak = currentStreak;
      const bonus = streak >= 7 ? 20 : streak >= 3 ? 10 : 5;
      claimDailyBonus();
      setDailyBonusAmount(bonus);
      setShowDailyBonus(true);
      setTimeout(() => setShowDailyBonus(false), 3500);
    }
  }, []);

  useEffect(() => {
    const prev = prevBadgesRef.current;
    if (unlockedBadges.length > prev.length) {
      sounds.unlock();
    }
    prevBadgesRef.current = unlockedBadges;
  }, [unlockedBadges]);

  if (!profile) return null;

  const themeColor = THEME_COLOR[profile.colorTheme];
  const themeDark = THEME_DARK[profile.colorTheme];
  const mascotType = profile.mascot;
  const placed = ROOM_ITEMS.filter(i => placedItems.includes(i.id) && !FARM_ANIMALS.includes(i.id));
  const shopItems = ROOM_ITEMS.filter(i =>
    (filter === 'all' || i.category === filter) &&
    (i.weekUnlock === undefined || i.weekUnlock === 0 || i.weekUnlock <= weeksEnrolled)
  );
  const comingSoonItems = ROOM_ITEMS.filter(i =>
    (filter === 'all' || i.category === filter) &&
    i.weekUnlock !== undefined && i.weekUnlock > 0 && i.weekUnlock > weeksEnrolled
  ).sort((a, b) => (a.weekUnlock ?? 0) - (b.weekUnlock ?? 0)).slice(0, 6);
  const hasTreehouse = placedItems.includes('treehouse-upgrade');

  const lines = COMPANION_LINES[mascotType];
  const currentScript = lines[companionIdx % lines.length];
  const currentLine = currentScript[lineIdx];

  const handleMascotClick = () => {
    if (!showBubble) {
      setShowBubble(true); setLineIdx(0); setBounce(true);
      setTimeout(() => setBounce(false), 600);
    } else if (lineIdx < currentScript.length - 1) {
      setLineIdx(l => l + 1);
    } else {
      setShowBubble(false);
      setCompanionIdx(i => i + 1);
    }
  };

  // Farm: pending stars and daily cap
  const today = new Date().toISOString().slice(0, 10);
  const todayFarmStars = farmLastDay === today ? farmDailyStars : 0;
  const farmCapRemaining = Math.max(0, FARM_DAILY_CAP - todayFarmStars);
  const now = Date.now();
  let pendingStars = 0;
  farmPlots.forEach(plot => {
    if (!plot.animalId || !plot.placedAt) return;
    const cfg = FARM_ANIMAL_CONFIG[plot.animalId];
    if (!cfg) return;
    const h = (now - new Date(plot.placedAt).getTime()) / 3600000;
    pendingStars += Math.floor(h * cfg.rate);
  });
  const collectableStars = Math.min(pendingStars, farmCapRemaining);

  // Player level (based on lifetime stars earned)
  const playerLevel = getPlayerLevel(lifetimeStarsEarned);
  const currentLevelData = PLAYER_LEVELS[playerLevel - 1];
  const nextLevelData = PLAYER_LEVELS[playerLevel] ?? null;
  const levelProgress = nextLevelData
    ? Math.round(((lifetimeStarsEarned - currentLevelData.minStars) / (nextLevelData.minStars - currentLevelData.minStars)) * 100)
    : 100;

  // Rank
  const rank = getRank(lifetimeStarsEarned);
  const nextRank = getNextRank(lifetimeStarsEarned);
  const rankProgress = nextRank
    ? Math.round(((lifetimeStarsEarned - rank.min) / (nextRank.min - rank.min)) * 100)
    : 100;

  // Weekly challenge
  const thisWeek = (() => {
    const d = new Date(); d.setHours(0,0,0,0);
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    const w1 = new Date(d.getFullYear(), 0, 4);
    return `${d.getFullYear()}-W${String(1 + Math.round(((d.getTime()-w1.getTime())/86400000 - 3 + ((w1.getDay()+6)%7)) / 7)).padStart(2,'0')}`;
  })();
  const weeklyProgress = weeklyLessonsWeek === thisWeek ? weeklyLessonsCount : 0;
  const weeklyGoalMet = weeklyProgress >= WEEKLY_GOAL;
  const weeklyAlreadyClaimed = weeklyChallengeCollected === thisWeek;

  return (
    <div className="min-h-screen" style={{ background: '#F7FFF4' }}>
      {/* Daily Bonus Toast */}
      <AnimatePresence>
        {showDailyBonus && (
          <motion.div
            initial={{ opacity: 0, y: -60, x: '-50%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            className="fixed top-4 left-1/2 z-50 bg-yellow-400 text-yellow-900 font-black px-5 py-3 rounded-2xl shadow-xl text-sm"
            style={{ borderBottom: '3px solid #E0A800' }}
          >
            🌅 Daily bonus! +⭐{dailyBonusAmount} stars
            {currentStreak >= 3 && <span className="ml-1 text-xs">({currentStreak} week streak!)</span>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Baby Bonus Toast */}
      <AnimatePresence>
        {pendingBabyBonus && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, x: '-50%', y: '-50%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.7 }}
            className="fixed top-1/2 left-1/2 z-50 bg-white rounded-3xl shadow-2xl p-6 text-center w-72"
            style={{ border: '3px solid #FCD34D' }}
          >
            <div className="text-6xl mb-2">{pendingBabyBonus.emoji}</div>
            <div className="text-2xl mb-1">🐣</div>
            <div className="font-black text-gray-800 text-lg mb-1">Baby {pendingBabyBonus.animalId.charAt(0).toUpperCase() + pendingBabyBonus.animalId.slice(1)}!</div>
            <div className="text-sm text-gray-500 mb-4">Your animal had a baby!<br/>+⭐{pendingBabyBonus.bonusStars} bonus stars!</div>
            <button
              onClick={dismissBabyBonus}
              className="btn-duo text-white font-black px-6 py-2 rounded-2xl text-sm"
              style={{ background: '#F59E0B', borderBottomColor: '#D97706' }}
            >
              Yay! 🎉
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {pendingBabyBonus && <div className="fixed inset-0 bg-black/30 z-40" onClick={dismissBabyBonus} />}

      {/* Header */}
      <div className="sticky top-0 z-10" style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => setView('home')} className="text-white/70 hover:text-white text-sm font-bold">← Home</button>
          <h2 className="font-black text-white">{hasTreehouse ? '🌳 My Treehouse' : '🛏️ My Room'}</h2>
          <div className="flex items-center gap-2">
            {/* Level badge */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-black"
              style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
              {currentLevelData.emoji} Lv.{playerLevel}
            </div>
            <div className="flex items-center gap-1 bg-yellow-400 px-3 py-1.5 rounded-full" style={{ borderBottom: '2px solid #E0A800' }}>
              <span>⭐</span>
              <span className="font-black text-yellow-900">{totalStars}</span>
            </div>
          </div>
        </div>
        {/* Level progress bar (thin strip under header) */}
        <div className="max-w-2xl mx-auto px-4 pb-1">
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-yellow-300 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
          {nextLevelData && (
            <div className="flex justify-between text-white/60 text-[10px] mt-0.5 px-0.5">
              <span>{currentLevelData.label}</span>
              <span>{nextLevelData.minStars - lifetimeStarsEarned} ⭐ to Lv.{playerLevel + 1} {nextLevelData.label}</span>
            </div>
          )}
        </div>
        <div className="max-w-2xl mx-auto px-4 pb-3 flex gap-2">
          {(['room', 'shop', 'farm', 'badges'] as TabType[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl font-black text-sm transition-all btn-duo ${tab === t ? 'text-white' : 'bg-white/20 text-white/70'}`}
              style={tab === t ? { background: themeColor, borderBottomColor: themeDark } : {}}
            >
              {t === 'room' ? 'My Room' : t === 'shop' ? 'Shop' : t === 'farm' ? '🌾 Farm' : '🏅 Badges'}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5">

        {/* ── ROOM TAB ── */}
        {tab === 'room' && (
          <div className="space-y-5">
            {/* Rank progress bar */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{rank.emoji}</span>
                  <div>
                    <div className="font-black text-gray-800 text-sm">{rank.name}</div>
                    <div className="text-xs text-gray-400">⭐ {lifetimeStarsEarned} lifetime stars</div>
                  </div>
                </div>
                {nextRank && (
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Next: {nextRank.emoji} {nextRank.name}</div>
                    <div className="text-xs font-bold" style={{ color: nextRank.color }}>
                      {nextRank.min - lifetimeStarsEarned} stars away
                    </div>
                  </div>
                )}
                {!nextRank && <div className="text-xs font-black text-red-500">⚡ MAX RANK!</div>}
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: nextRank?.color ?? rank.color, width: `${rankProgress}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${rankProgress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Weekly Challenge strip */}
            <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="text-2xl">🎯</div>
              <div className="flex-1">
                <div className="font-black text-gray-700 text-sm">Weekly Challenge</div>
                <div className="text-xs text-gray-400">Complete {WEEKLY_GOAL} lessons this week · Reward: ⭐25</div>
                <div className="mt-1 flex items-center gap-1">
                  {Array.from({ length: WEEKLY_GOAL }).map((_, i) => (
                    <div key={i} className={`h-2 flex-1 rounded-full ${i < weeklyProgress ? 'bg-green-400' : 'bg-gray-100'}`} />
                  ))}
                </div>
              </div>
              {weeklyGoalMet && !weeklyAlreadyClaimed && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={claimWeeklyBonus}
                  className="btn-duo text-white text-xs font-black px-3 py-2 rounded-xl"
                  style={{ background: '#58CC02', borderBottomColor: '#46A302' }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  Claim!
                </motion.button>
              )}
              {weeklyAlreadyClaimed && (
                <div className="text-green-500 text-xs font-black">✓ Done!</div>
              )}
            </div>

            {/* 3D Room */}
            <div className="relative" style={{ height: 280 }}>
              <div
                ref={roomRef}
                className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl"
                style={{ background: hasTreehouse ? '#86efac' : '#dbeafe' }}
              >
                <div className="absolute inset-0" style={{
                  background: hasTreehouse
                    ? 'linear-gradient(180deg, #4ade80 0%, #86efac 50%)'
                    : 'linear-gradient(180deg, #bfdbfe 0%, #dbeafe 60%)',
                }}/>
                <div className="absolute inset-x-0 bottom-0" style={{ height: '65%' }}>
                  <div className="absolute inset-0" style={{
                    background: hasTreehouse ? '#92400e' : '#fef3c7',
                    clipPath: 'polygon(12% 0%, 88% 0%, 100% 100%, 0% 100%)',
                  }}/>
                  <div className="absolute bottom-0 inset-x-0 h-3" style={{
                    background: hasTreehouse ? '#78350f' : '#fde68a',
                    clipPath: 'polygon(0% 0%, 100% 0%, 98% 100%, 2% 100%)',
                  }}/>
                </div>
                <div className="absolute inset-x-0 bottom-0" style={{
                  height: '42%',
                  background: hasTreehouse
                    ? 'linear-gradient(180deg, #78350f 0%, #92400e 100%)'
                    : 'linear-gradient(180deg, #fde68a 0%, #fbbf24 100%)',
                  clipPath: 'polygon(0% 30%, 100% 30%, 100% 100%, 0% 100%)',
                }}/>
                <svg className="absolute inset-x-0 bottom-0 w-full" style={{ height: '42%' }} viewBox="0 0 300 120" preserveAspectRatio="none">
                  <defs>
                    <pattern id="grid" x="0" y="0" width="30" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="300" height="120" fill="url(#grid)"/>
                  {[0,1,2,3,4,5,6,7,8,9].map(i => (
                    <line key={i} x1={i * 30} y1="0" x2={150 + (i-4.5)*8} y2="120"
                      stroke="rgba(0,0,0,0.05)" strokeWidth="0.5"/>
                  ))}
                </svg>
                <div className="absolute left-0 bottom-0" style={{
                  width: '12%', height: '65%',
                  background: hasTreehouse ? '#7c2d12' : '#fef9c3',
                  filter: 'brightness(0.85)',
                }}/>
                <div className="absolute right-0 bottom-0" style={{
                  width: '12%', height: '65%',
                  background: hasTreehouse ? '#7c2d12' : '#fef9c3',
                  filter: 'brightness(0.75)',
                }}/>
                {placed.map(item => {
                  const savedPos = itemPositions[item.id];
                  const xPct = savedPos ? savedPos.x : (item.position?.x ?? 50);
                  const yPct = savedPos ? savedPos.y : (item.position?.y ?? 55);
                  return (
                    <div key={item.id} style={{ position: 'absolute', left: `${xPct}%`, top: `${yPct}%`, transform: 'translate(-50%, -50%)', zIndex: 10 }}>
                      <motion.div
                        key={`${item.id}-${xPct}-${yPct}`}
                        drag dragMomentum={false} dragConstraints={roomRef}
                        onDragEnd={(_, info) => {
                          if (!roomRef.current) return;
                          const rect = roomRef.current.getBoundingClientRect();
                          const newXPx = rect.width * xPct / 100 + info.offset.x;
                          const newYPx = rect.height * yPct / 100 + info.offset.y;
                          setItemPosition(item.id, {
                            x: Math.max(4, Math.min(96, (newXPx / rect.width) * 100)),
                            y: Math.max(4, Math.min(92, (newYPx / rect.height) * 100)),
                          });
                        }}
                        whileDrag={{ scale: 1.2, zIndex: 50 }}
                        whileHover={{ scale: 1.1 }}
                        style={{ cursor: 'grab' }}
                        className="text-4xl select-none touch-none block"
                        title={`${item.name} — drag to move`}
                      >
                        {item.emoji}
                      </motion.div>
                    </div>
                  );
                })}
                {placed.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center pb-12">
                    <p className="text-black/30 font-semibold text-sm text-center px-8">
                      Your room is empty.<br/>Buy items from the Shop and place them here.
                    </p>
                  </div>
                )}
                <div className="absolute bottom-3 right-4 flex flex-col items-end" style={{ zIndex: 5 }}>
                  <AnimatePresence>
                    {showBubble && (
                      <motion.div
                        key={`${companionIdx}-${lineIdx}`}
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-white rounded-2xl shadow-lg px-3 py-2 mb-2 max-w-[150px] text-xs font-semibold text-gray-700 text-center border border-gray-100 cursor-pointer"
                        onClick={handleMascotClick}
                      >
                        {currentLine}
                        <div className="text-gray-300 mt-1 text-[10px]">
                          {lineIdx < currentScript.length - 1 ? 'tap ›' : 'close ✕'}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <motion.div
                    animate={bounce ? { y: [-8, 0, -4, 0] } : {}}
                    transition={{ duration: 0.5 }}
                    className="cursor-pointer select-none"
                    whileHover={{ scale: 1.1 }}
                    onClick={handleMascotClick}
                    title="Talk to your companion!"
                  >
                    <PetBody type={mascotType} size={72} />
                  </motion.div>
                </div>
                {placed.length > 0 && (
                  <div className="absolute top-3 left-3 bg-black/20 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                    Drag items to rearrange
                  </div>
                )}
              </div>
            </div>

            {/* Items in room */}
            <div>
              <h3 className="font-black text-gray-700 mb-3 text-sm uppercase tracking-wide">Items in your room</h3>
              {ownedItems.length === 0 ? (
                <p className="text-gray-400 text-sm">No items yet — earn stars and visit the shop!</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {ROOM_ITEMS.filter(i => ownedItems.includes(i.id) && !FARM_ANIMALS.includes(i.id)).map(item => (
                    <motion.button
                      key={item.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => togglePlaced(item.id)}
                      className={`p-3 rounded-2xl border-2 text-left flex items-center gap-2 transition-all ${
                        placedItems.includes(item.id) ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white'
                      }`}
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <div>
                        <div className="text-sm font-bold text-gray-700">{item.name}</div>
                        <div className="text-xs text-gray-400">{placedItems.includes(item.id) ? '✓ In room' : 'Tap to place'}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SHOP TAB ── */}
        {tab === 'shop' && (
          <div className="space-y-4">
            {/* Weekly challenge reminder in shop */}
            {!weeklyAlreadyClaimed && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center gap-3">
                <span className="text-xl">🎯</span>
                <div className="flex-1">
                  <div className="font-bold text-amber-800 text-sm">Weekly Challenge: {weeklyProgress}/{WEEKLY_GOAL} lessons</div>
                  <div className="text-xs text-amber-600">Complete {WEEKLY_GOAL - weeklyProgress} more this week → earn ⭐25 bonus!</div>
                </div>
              </div>
            )}

            <div className="flex gap-2 overflow-x-auto pb-1">
              {(['all', 'furniture', 'pet', 'decoration', 'window'] as Category[]).map(c => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${filter === c ? 'text-white' : 'bg-gray-100 text-gray-500'}`}
                  style={filter === c ? { background: themeColor } : {}}
                >
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <AnimatePresence>
                {shopItems.map(item => {
                  const qty = itemQuantities[item.id] ?? 0;
                  const owned = qty > 0;
                  const isFarmAnimal = FARM_ANIMALS.includes(item.id);
                  const alreadyOwned = isFarmAnimal && owned;
                  const levelReq = item.levelRequired ?? 1;
                  const levelLocked = playerLevel < levelReq;
                  const canAfford = totalStars >= item.cost;
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`bg-white rounded-2xl p-4 border-2 shadow-sm relative ${
                        levelLocked ? 'border-gray-200 opacity-60' : owned ? 'border-green-300' : 'border-gray-100'
                      }`}
                    >
                      {levelLocked && (
                        <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-black/5">
                          <div className="bg-gray-800 text-white text-xs font-black px-3 py-1.5 rounded-full">
                            🔒 Level {levelReq}
                          </div>
                        </div>
                      )}
                      <div className="text-4xl text-center mb-2">{item.emoji}</div>
                      <div className="font-bold text-gray-800 text-sm text-center">{item.name}</div>
                      <div className="text-xs text-gray-400 text-center mb-3">{item.description}</div>
                      {item.cost === 0 ? (
                        <div className="text-center text-gray-400 text-xs">Free starter item</div>
                      ) : alreadyOwned ? (
                        <div className="w-full py-2 rounded-xl text-xs font-black text-center bg-green-50 text-green-600 border border-green-200">
                          ✓ Owned — go to Farm
                        </div>
                      ) : levelLocked ? (
                        <div className="w-full py-2 rounded-xl text-xs font-black text-center bg-gray-50 text-gray-400 border border-gray-200">
                          Reach Level {levelReq} to unlock
                        </div>
                      ) : (
                        <motion.button
                          whileHover={canAfford ? { scale: 1.03 } : {}}
                          whileTap={canAfford ? { scale: 0.97 } : {}}
                          onClick={() => canAfford && buyItem(item.id, item.cost)}
                          disabled={!canAfford}
                          className="w-full py-2 rounded-xl text-xs font-black transition-all btn-duo disabled:opacity-40"
                          style={canAfford
                            ? { background: themeColor, borderBottomColor: themeDark, color: 'white' }
                            : { background: '#f3f4f6', borderBottomColor: '#d1d5db', color: '#9ca3af' }}
                        >
                          ⭐ {item.cost} {canAfford ? 'Buy' : '— need more stars'}
                        </motion.button>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Coming Soon — items unlock by week */}
            {comingSoonItems.length > 0 && (
              <div className="mt-4">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">🔒 New items unlock every week!</div>
                <div className="grid grid-cols-2 gap-3">
                  {comingSoonItems.map(item => (
                    <div key={item.id} className="bg-gray-50 rounded-2xl p-4 border-2 border-dashed border-gray-200 text-center opacity-60">
                      <div className="text-4xl grayscale mb-2">{item.emoji}</div>
                      <div className="font-bold text-gray-500 text-sm">{item.name}</div>
                      <div className="text-xs font-semibold mt-1" style={{ color: themeColor }}>
                        🗓 Week {item.weekUnlock}
                        {item.weekUnlock !== undefined && ` (${item.weekUnlock - weeksEnrolled} week${item.weekUnlock - weeksEnrolled !== 1 ? 's' : ''} away)`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── FARM TAB ── */}
        {tab === 'farm' && (
          <div className="space-y-5">
            {/* Farm scene with walking animals */}
            <FarmScene
              farmPlots={farmPlots}
              petNames={petNames}
            />

            {/* Daily cap progress */}
            <div className="bg-white rounded-2xl p-4 border border-amber-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-black text-gray-700">Daily farm stars</div>
                <div className="text-sm font-black text-amber-600">⭐ {todayFarmStars} / {FARM_DAILY_CAP}</div>
              </div>
              <div className="h-2.5 bg-amber-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(todayFarmStars / FARM_DAILY_CAP) * 100}%`, background: '#f59e0b' }}
                />
              </div>
              {farmCapRemaining === 0
                ? <p className="text-xs text-amber-600 font-semibold mt-1">✓ Daily limit reached — resets at midnight!</p>
                : <p className="text-xs text-gray-400 mt-1">{farmCapRemaining} stars remaining today</p>
              }
            </div>

            {/* Collect stars button */}
            {collectableStars > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={collectFarmStars}
                className="w-full py-3 rounded-2xl text-white font-black text-base btn-duo"
                style={{ background: '#f59e0b', borderBottomColor: '#d97706' }}
                animate={{ boxShadow: ['0 0 0 0 rgba(245,158,11,0.4)', '0 0 0 12px rgba(245,158,11,0)'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Collect ⭐ {collectableStars} stars from your farm!
              </motion.button>
            )}
            {pendingStars > 0 && collectableStars === 0 && (
              <div className="w-full py-3 rounded-2xl bg-gray-100 text-gray-400 font-black text-base text-center">
                Daily limit reached — come back tomorrow!
              </div>
            )}

            {/* Farm plots */}
            <div>
              <h3 className="font-black text-gray-700 mb-3 text-sm uppercase tracking-wide">Farm plots (10 total)</h3>
              <div className="grid grid-cols-5 gap-2">
                {farmPlots.map(plot => {
                  const cfg = plot.animalId ? FARM_ANIMAL_CONFIG[plot.animalId] : null;
                  return (
                    <motion.div
                      key={plot.id}
                      whileTap={{ scale: 0.95 }}
                      className={`rounded-2xl p-2 border-2 text-center cursor-pointer transition-colors ${
                        plot.animalId
                          ? 'border-amber-300 bg-amber-50'
                          : selectedFarmAnimal
                          ? 'border-dashed border-amber-400 bg-amber-50'
                          : 'border-amber-200 bg-white'
                      }`}
                      onClick={() => {
                        if (plot.animalId) {
                          removeFarmAnimal(plot.id);
                        } else if (selectedFarmAnimal) {
                          placeFarmAnimal(plot.id, selectedFarmAnimal);
                          setSelectedFarmAnimal(null);
                        }
                      }}
                    >
                      <div className="text-2xl">{plot.animalId ? ANIMAL_EMOJI[plot.animalId] : '🟫'}</div>
                      {plot.animalId && (
                        <div className="text-[9px] font-black text-gray-700 truncate w-full text-center px-0.5">
                          {petNames[plot.animalId] || plot.animalId}
                        </div>
                      )}
                      {cfg && <div className="text-[9px] text-amber-600 font-bold">+{cfg.rate}/hr</div>}
                      {plot.animalId && <div className="text-[8px] text-red-400">tap to recall</div>}
                      {!plot.animalId && selectedFarmAnimal && <div className="text-[9px] text-amber-500 font-bold">place here</div>}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Owned farm animals */}
            <div>
              <h3 className="font-black text-gray-700 mb-1 text-sm uppercase tracking-wide">Your animals</h3>
              <p className="text-xs text-gray-400 mb-3">Each animal earns ⭐ and may produce babies 🐣 when collected</p>
              {FARM_ANIMALS.filter(a => ownedItems.includes(a)).length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
                  <p className="text-amber-700 text-sm font-semibold">No farm animals yet.</p>
                  <p className="text-amber-600 text-xs mt-1">Buy from Shop → Pet. Rarer animals need higher player levels.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {FARM_ANIMALS.filter(a => ownedItems.includes(a)).map(animalId => {
                    const owned = itemQuantities[animalId] ?? 0;
                    const placed = farmPlots.filter(p => p.animalId === animalId).length;
                    const unplaced = owned - placed;
                    const isSelected = selectedFarmAnimal === animalId;
                    const cfg = FARM_ANIMAL_CONFIG[animalId];
                    const sellRefund = Math.floor(ANIMAL_COST[animalId] * 0.6);
                    return (
                      <div key={animalId} className={`bg-white rounded-2xl border-2 overflow-hidden ${isSelected ? 'border-amber-400' : 'border-gray-200'}`}>
                        <div className="flex items-center gap-3 p-3">
                          <span className="text-3xl">{ANIMAL_EMOJI[animalId]}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-black text-gray-700 capitalize">{animalId}</div>
                            <div className="text-xs text-gray-400">+{cfg?.rate ?? 1} ⭐/hr · 🐣 {((cfg?.babyChance ?? 0) * 100).toFixed(0)}% baby</div>
                            <div className="flex gap-2 mt-0.5 text-xs font-semibold">
                              <span className="text-green-600">Placed: {placed}</span>
                              <span className={unplaced > 0 ? 'text-amber-600' : 'text-gray-400'}>Free: {unplaced}</span>
                            </div>
                            <input
                              type="text"
                              maxLength={14}
                              placeholder="Give me a name…"
                              defaultValue={petNames[animalId] ?? ''}
                              onBlur={e => namePet(animalId, e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                              className="mt-1 w-full text-xs px-2 py-0.5 rounded-lg border border-gray-200 focus:outline-none focus:border-amber-400 placeholder-gray-300 font-semibold text-gray-700 bg-gray-50"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5 shrink-0">
                            {unplaced > 0 && (
                              <button
                                onClick={() => setSelectedFarmAnimal(isSelected ? null : animalId)}
                                className="text-xs font-black px-3 py-1.5 rounded-xl text-white btn-duo"
                                style={{ background: isSelected ? '#d97706' : '#f59e0b', borderBottomColor: isSelected ? '#b45309' : '#d97706' }}
                              >
                                {isSelected ? 'Cancel' : 'Place'}
                              </button>
                            )}
                            {unplaced > 0 && (
                              <button
                                onClick={() => sellFarmAnimal(animalId, sellRefund)}
                                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-red-50 text-red-500 border border-red-200"
                              >
                                Sell ⭐{sellRefund}
                              </button>
                            )}
                            {unplaced === 0 && placed > 0 && (
                              <div className="text-xs text-gray-400 text-center px-1">All<br/>placed</div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {selectedFarmAnimal && (
                <p className="text-center text-sm text-amber-600 font-semibold mt-3">
                  {ANIMAL_EMOJI[selectedFarmAnimal]} Tap an empty plot above to place it
                </p>
              )}
            </div>

            {/* Available animals to unlock */}
            <div>
              <h3 className="font-black text-gray-700 mb-2 text-sm uppercase tracking-wide">All Farm Animals</h3>
              <div className="grid grid-cols-2 gap-2">
                {FARM_ANIMALS.map(animalId => {
                  const cfg = FARM_ANIMAL_CONFIG[animalId];
                  const isOwned = ownedItems.includes(animalId);
                  const lvlOk = playerLevel >= (cfg?.levelRequired ?? 1);
                  return (
                    <div key={animalId} className={`rounded-2xl p-3 border-2 flex items-center gap-2 ${isOwned ? 'border-green-300 bg-green-50' : lvlOk ? 'border-amber-200 bg-white' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
                      <span className="text-2xl">{ANIMAL_EMOJI[animalId]}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black text-gray-700 capitalize">{animalId}
                          {isOwned && <span className="ml-1 text-green-500">✓</span>}
                        </div>
                        <div className="text-[10px] text-gray-400">⭐{ANIMAL_COST[animalId]} · +{cfg?.rate}/hr · 🐣{((cfg?.babyChance ?? 0) * 100).toFixed(0)}%</div>
                        {!lvlOk && <div className="text-[10px] text-gray-400 font-bold">🔒 Level {cfg?.levelRequired} required</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Farm info */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="font-black text-amber-800 text-sm mb-2">🌾 How the farm works</div>
              <div className="space-y-1 text-xs text-amber-700">
                <div>• Each animal earns stars every hour — collect to claim!</div>
                <div>• Daily cap: <strong>⭐{FARM_DAILY_CAP}/day</strong> — resets at midnight</div>
                <div>• 🐣 <strong>Baby bonus:</strong> each collect has a chance a baby is born — bonus stars!</div>
                <div>• Rarer animals earn more and have bigger baby bonuses</div>
                <div>• Higher level animals require you to level up first</div>
                <div>• Sell unplaced animals for 60% refund if you change your mind</div>
              </div>
            </div>
          </div>
        )}

        {/* ── BADGES TAB ── */}
        {tab === 'badges' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-gray-700 text-lg">Achievement Badges</h3>
              <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                {unlockedBadges.length} / {BADGES.length} unlocked
              </span>
            </div>

            {/* Rank summary */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Your Rank</div>
              <div className="flex gap-2 overflow-x-auto">
                {RANKS.map((r) => {
                  const reached = lifetimeStarsEarned >= r.min;
                  return (
                    <div key={r.name} className={`flex-shrink-0 text-center px-3 py-2 rounded-xl border-2 transition-all ${
                      reached ? 'border-yellow-300 bg-yellow-50' : 'border-gray-100 opacity-40'
                    }`}>
                      <div className="text-xl">{r.emoji}</div>
                      <div className="text-xs font-bold text-gray-600">{r.name}</div>
                      <div className="text-xs text-gray-400">⭐{r.min}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {BADGES.map(badge => {
                const unlocked = unlockedBadges.includes(badge.id);
                return (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`bg-white rounded-2xl p-4 border-2 shadow-sm text-center transition-all ${
                      unlocked ? 'border-yellow-300' : 'border-gray-100'
                    }`}
                  >
                    <div className={`text-4xl mb-2 ${!unlocked ? 'grayscale opacity-30' : ''}`}>
                      {badge.emoji}
                    </div>
                    <div className={`font-bold text-sm ${unlocked ? 'text-gray-800' : 'text-gray-400'}`}>
                      {badge.name}
                    </div>
                    <div className={`text-xs mt-1 ${unlocked ? 'text-gray-500' : 'text-gray-300'}`}>
                      {badge.description}
                    </div>
                    {unlocked && (
                      <div className="mt-2 text-xs text-yellow-600 font-bold">✓ Earned!</div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
