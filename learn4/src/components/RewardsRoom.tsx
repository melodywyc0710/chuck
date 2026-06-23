import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { ROOM_ITEMS } from '../data/rewards';
import { BADGES } from '../data/badges';
import { sounds } from '../utils/sounds';

const THEME_COLOR = { purple: '#A855F7', blue: '#1CB0F6', green: '#58CC02', orange: '#F97316' };
const THEME_DARK  = { purple: '#7C3AED', blue: '#0E8FC4', green: '#46A302', orange: '#EA580C' };
type TabType = 'room' | 'shop' | 'farm' | 'badges';
type Category = 'all' | 'furniture' | 'pet' | 'decoration' | 'window';

const FARM_ANIMALS = ['chicken', 'sheep', 'cow', 'horse'];
const ANIMAL_EMOJI: Record<string, string> = { chicken: '🐔', sheep: '🐑', cow: '🐄', horse: '🐴' };
const ANIMAL_RATE: Record<string, number> = { chicken: 2, sheep: 5, cow: 10, horse: 20 };

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

// SVG pet bodies
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
  // panda
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

export default function RewardsRoom() {
  const {
    profile, totalStars, ownedItems, placedItems, buyItem, togglePlaced, setView,
    completedSessions, itemPositions, setItemPosition, itemQuantities,
    farmPlots, placeFarmAnimal, removeFarmAnimal, collectFarmStars,
    unlockedBadges, firstLoginDate,
  } = useAppStore();

  const weeksEnrolled = firstLoginDate
    ? Math.floor((Date.now() - new Date(firstLoginDate).getTime()) / (7 * 24 * 3600 * 1000))
    : 99; // if no firstLoginDate, show everything

  const [tab, setTab] = useState<TabType>('room');
  const [filter, setFilter] = useState<Category>('all');
  const [companionIdx, setCompanionIdx] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [showBubble, setShowBubble] = useState(false);
  const [bounce, setBounce] = useState(false);
  const [selectedFarmAnimal, setSelectedFarmAnimal] = useState<string | null>(null);
  const roomRef = useRef<HTMLDivElement>(null);
  const prevBadgesRef = useRef<string[]>([]);

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
  ).sort((a, b) => (a.weekUnlock ?? 0) - (b.weekUnlock ?? 0)).slice(0, 5);
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

  // Farm stars pending calculation
  const now = Date.now();
  let pendingStars = 0;
  farmPlots.forEach(plot => {
    if (!plot.animalId || !plot.placedAt) return;
    const h = (now - new Date(plot.placedAt).getTime()) / 3600000;
    pendingStars += Math.floor(h * (ANIMAL_RATE[plot.animalId] ?? 2));
  });

  return (
    <div className="min-h-screen" style={{ background: '#F7FFF4' }}>
      {/* Header */}
      <div className="sticky top-0 z-10" style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => setView('home')} className="text-white/70 hover:text-white text-sm font-bold">← Home</button>
          <h2 className="font-black text-white">{hasTreehouse ? '🌳 My Treehouse' : '🛏️ My Room'}</h2>
          <div className="flex items-center gap-1 bg-yellow-400 px-3 py-1.5 rounded-full" style={{ borderBottom: '2px solid #E0A800' }}>
            <span>⭐</span>
            <span className="font-black text-yellow-900">{totalStars}</span>
          </div>
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
            {/* 3D Room */}
            <div className="relative" style={{ height: 320 }}>
              {/* 3D scene container */}
              <div
                ref={roomRef}
                className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl"
                style={{ background: hasTreehouse ? '#86efac' : '#dbeafe' }}
              >
                {/* Sky / ceiling gradient */}
                <div className="absolute inset-0" style={{
                  background: hasTreehouse
                    ? 'linear-gradient(180deg, #4ade80 0%, #86efac 50%)'
                    : 'linear-gradient(180deg, #bfdbfe 0%, #dbeafe 60%)',
                }}/>

                {/* Back wall with perspective lines */}
                <div className="absolute inset-x-0 bottom-0" style={{ height: '65%' }}>
                  {/* Wall */}
                  <div className="absolute inset-0" style={{
                    background: hasTreehouse ? '#92400e' : '#fef3c7',
                    clipPath: 'polygon(12% 0%, 88% 0%, 100% 100%, 0% 100%)',
                  }}/>
                  {/* Baseboard */}
                  <div className="absolute bottom-0 inset-x-0 h-3" style={{
                    background: hasTreehouse ? '#78350f' : '#fde68a',
                    clipPath: 'polygon(0% 0%, 100% 0%, 98% 100%, 2% 100%)',
                  }}/>
                </div>

                {/* Floor with 3D perspective */}
                <div
                  className="absolute inset-x-0 bottom-0"
                  style={{
                    height: '42%',
                    background: hasTreehouse
                      ? 'linear-gradient(180deg, #78350f 0%, #92400e 100%)'
                      : 'linear-gradient(180deg, #fde68a 0%, #fbbf24 100%)',
                    clipPath: 'polygon(0% 30%, 100% 30%, 100% 100%, 0% 100%)',
                  }}
                />

                {/* Floor grid lines for 3D effect */}
                <svg className="absolute inset-x-0 bottom-0 w-full" style={{ height: '42%' }} viewBox="0 0 300 120" preserveAspectRatio="none">
                  <defs>
                    <pattern id="grid" x="0" y="0" width="30" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="300" height="120" fill="url(#grid)"/>
                  {/* Perspective lines */}
                  {[0,1,2,3,4,5,6,7,8,9].map(i => (
                    <line key={i} x1={i * 30} y1="0" x2={150 + (i-4.5)*8} y2="120"
                      stroke="rgba(0,0,0,0.05)" strokeWidth="0.5"/>
                  ))}
                </svg>

                {/* Left wall sliver */}
                <div className="absolute left-0 bottom-0" style={{
                  width: '12%', height: '65%',
                  background: hasTreehouse ? '#7c2d12' : '#fef9c3',
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                  filter: 'brightness(0.85)',
                }}/>

                {/* Right wall sliver */}
                <div className="absolute right-0 bottom-0" style={{
                  width: '12%', height: '65%',
                  background: hasTreehouse ? '#7c2d12' : '#fef9c3',
                  filter: 'brightness(0.75)',
                }}/>

                {/* Draggable placed items */}
                {placed.map(item => {
                  const savedPos = itemPositions[item.id];
                  // Always store/use percentage values (0-100)
                  const xPct = savedPos ? savedPos.x : (item.position?.x ?? 50);
                  const yPct = savedPos ? savedPos.y : (item.position?.y ?? 55);
                  return (
                    // Outer div: CSS percentage positioning — never changes during drag
                    <div
                      key={item.id}
                      style={{
                        position: 'absolute',
                        left: `${xPct}%`,
                        top: `${yPct}%`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10,
                      }}
                    >
                      {/* Inner motion.div: keyed so it resets (x=0,y=0) after every drop */}
                      <motion.div
                        key={`${item.id}-${xPct}-${yPct}`}
                        drag
                        dragMomentum={false}
                        dragConstraints={roomRef}
                        onDragEnd={(_, info) => {
                          if (!roomRef.current) return;
                          const rect = roomRef.current.getBoundingClientRect();
                          // Compute new percentage from current CSS position + drag offset
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

                {/* Companion mascot — bottom right, z-5 so draggable items stay on top */}
                <div className="absolute bottom-3 right-4 flex flex-col items-end z-5" style={{ zIndex: 5 }}>
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

                {/* Drag hint */}
                {placed.length > 0 && (
                  <div className="absolute top-3 left-3 bg-black/20 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                    Drag items to rearrange
                  </div>
                )}
              </div>
            </div>

            {/* Stats strip */}
            <div className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
              <PetBody type={mascotType} size={40} />
              <div>
                <div className="font-bold text-gray-700 text-sm">Your companion</div>
                <div className="text-xs text-gray-400">
                  <span className="font-bold text-yellow-600">⭐ {totalStars}</span> stars ·{' '}
                  <span className="font-bold">{completedSessions.length}</span> {completedSessions.length === 1 ? 'lesson' : 'lessons'} completed
                </div>
              </div>
            </div>

            {/* Placed items management */}
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
                  const canAfford = totalStars >= item.cost;
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`bg-white rounded-2xl p-4 border-2 shadow-sm ${owned ? 'border-green-300' : 'border-gray-100'}`}
                    >
                      <div className="relative text-4xl text-center mb-2">
                        {item.emoji}
                        {qty > 1 && (
                          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-black rounded-full w-5 h-5 flex items-center justify-center">
                            {qty}
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-gray-800 text-sm text-center">{item.name}</div>
                      <div className="text-xs text-gray-400 text-center mb-3">{item.description}</div>
                      {item.cost === 0 ? (
                        <div className="text-center text-gray-400 text-xs">Free starter item</div>
                      ) : (
                        <motion.button
                          whileHover={canAfford ? { scale: 1.03 } : {}}
                          whileTap={canAfford ? { scale: 0.97 } : {}}
                          onClick={() => canAfford && buyItem(item.id, item.cost)}
                          disabled={!canAfford}
                          className="w-full py-2 rounded-xl text-xs font-black transition-all disabled:opacity-40"
                          style={canAfford ? { background: themeColor, borderBottomColor: themeDark, color: 'white' } : { background: '#f3f4f6', borderBottomColor: '#d1d5db', color: '#9ca3af' }}
                        >
                          ⭐ {item.cost} {owned ? 'Buy another' : canAfford ? 'Buy' : '— need more stars'}
                        </motion.button>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Coming Soon */}
            {comingSoonItems.length > 0 && (
              <div className="mt-4">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">🔒 Coming Soon — New items every week!</div>
                <div className="grid grid-cols-2 gap-3">
                  {comingSoonItems.map(item => (
                    <div key={item.id} className="bg-gray-50 rounded-2xl p-4 border-2 border-dashed border-gray-200 text-center opacity-60">
                      <div className="text-4xl grayscale mb-2">{item.emoji}</div>
                      <div className="font-bold text-gray-500 text-sm">{item.name}</div>
                      <div className="text-xs font-semibold mt-1" style={{ color: themeColor }}>
                        🗓 Unlocks week {item.weekUnlock}
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
            {/* Farm scene */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl" style={{ height: 220 }}>
              {/* Sky */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #7dd3fc 0%, #bae6fd 60%, #86efac 60%, #4ade80 100%)' }}/>
              {/* Sun */}
              <div className="absolute top-4 right-8 w-12 h-12 rounded-full bg-yellow-300 shadow-lg" style={{ boxShadow: '0 0 30px rgba(253,224,71,0.8)' }}/>
              {/* Clouds */}
              <div className="absolute top-6 left-8 flex gap-1">
                <div className="w-12 h-5 bg-white rounded-full opacity-90"/>
                <div className="w-8 h-5 bg-white rounded-full opacity-90 -ml-3"/>
              </div>
              {/* Fence */}
              <div className="absolute bottom-12 inset-x-0 flex justify-around px-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-2.5 bg-amber-700 rounded-t-sm" style={{ height: 28 }}/>
                ))}
              </div>
              <div className="absolute inset-x-0 bottom-20 h-2 bg-amber-700 mx-4 rounded-full"/>
              {/* Ground */}
              <div className="absolute bottom-0 inset-x-0 h-14" style={{ background: 'linear-gradient(180deg, #86efac 0%, #4ade80 100%)' }}/>
              {/* Farm animals on ground */}
              <div className="absolute bottom-2 inset-x-0 flex justify-around px-8">
                {farmPlots.filter(p => p.animalId).map(plot => (
                  <motion.div
                    key={plot.id}
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: Math.random() }}
                    className="text-3xl"
                  >
                    {ANIMAL_EMOJI[plot.animalId!]}
                  </motion.div>
                ))}
                {farmPlots.filter(p => p.animalId).length === 0 && (
                  <p className="text-white/60 text-xs font-semibold self-center">Place animals on your plots below</p>
                )}
              </div>
            </div>

            {/* Collect stars button */}
            {pendingStars > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={collectFarmStars}
                className="w-full py-3 rounded-2xl text-white font-black text-base"
                style={{ background: '#f59e0b' }}
                animate={{ boxShadow: ['0 0 0 0 rgba(245,158,11,0.4)', '0 0 0 12px rgba(245,158,11,0)'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Collect ⭐ {pendingStars} stars from your farm!
              </motion.button>
            )}

            {/* Farm plots */}
            <div>
              <h3 className="font-black text-gray-700 mb-3 text-sm uppercase tracking-wide">Your plots</h3>
              <div className="grid grid-cols-3 gap-3">
                {farmPlots.map(plot => (
                  <motion.div
                    key={plot.id}
                    whileTap={{ scale: 0.97 }}
                    className="bg-white rounded-2xl p-3 border-2 border-amber-200 text-center cursor-pointer hover:border-amber-400 transition-colors"
                    onClick={() => {
                      if (plot.animalId) {
                        removeFarmAnimal(plot.id);
                      } else if (selectedFarmAnimal) {
                        placeFarmAnimal(plot.id, selectedFarmAnimal);
                        setSelectedFarmAnimal(null);
                      }
                    }}
                  >
                    <div className="text-3xl mb-1">{plot.animalId ? ANIMAL_EMOJI[plot.animalId] : '🟫'}</div>
                    <div className="text-xs font-semibold text-gray-600">
                      {plot.animalId
                        ? `${plot.animalId.charAt(0).toUpperCase() + plot.animalId.slice(1)}`
                        : selectedFarmAnimal ? 'Tap to place' : 'Empty'}
                    </div>
                    {plot.animalId && (
                      <div className="text-xs text-amber-600 mt-0.5">+{ANIMAL_RATE[plot.animalId]}/hr</div>
                    )}
                    {plot.animalId && (
                      <div className="text-xs text-red-400 mt-1">Tap to remove</div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Owned farm animals */}
            <div>
              <h3 className="font-black text-gray-700 mb-3 text-sm uppercase tracking-wide">Your animals</h3>
              {FARM_ANIMALS.filter(a => ownedItems.includes(a)).length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
                  <p className="text-amber-700 text-sm font-semibold">No farm animals yet.</p>
                  <p className="text-amber-600 text-xs mt-1">Buy chickens, sheep, cows and horses from the Shop — then place them on your plots to earn stars while you study!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {FARM_ANIMALS.filter(a => ownedItems.includes(a)).map(animalId => {
                    const inUse = farmPlots.filter(p => p.animalId === animalId).length;
                    const isSelected = selectedFarmAnimal === animalId;
                    return (
                      <motion.button
                        key={animalId}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedFarmAnimal(isSelected ? null : animalId)}
                        className={`p-3 rounded-2xl border-2 text-left flex items-center gap-2 transition-all ${
                          isSelected ? 'border-amber-400 bg-amber-50' : 'border-gray-200 bg-white'
                        }`}
                      >
                        <span className="text-2xl">{ANIMAL_EMOJI[animalId]}</span>
                        <div>
                          <div className="text-sm font-bold text-gray-700 capitalize">{animalId}</div>
                          <div className="text-xs text-gray-400">+{ANIMAL_RATE[animalId]} stars/hr</div>
                          {inUse > 0 && <div className="text-xs text-green-600">{inUse} on plot</div>}
                        </div>
                        {isSelected && <span className="ml-auto text-amber-500 font-bold text-xs">Selected</span>}
                      </motion.button>
                    );
                  })}
                </div>
              )}
              {selectedFarmAnimal && (
                <p className="text-center text-sm text-amber-600 font-semibold mt-3">
                  {ANIMAL_EMOJI[selectedFarmAnimal]} {selectedFarmAnimal} selected — tap an empty plot above to place it
                </p>
              )}
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
