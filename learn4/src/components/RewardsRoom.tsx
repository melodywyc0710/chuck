import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { ROOM_ITEMS } from '../data/rewards';

const THEME_COLOR = { purple: '#6366f1', blue: '#3b82f6', green: '#10b981', orange: '#f59e0b' };
const MASCOT_EMOJI = { owl: '🦉', fox: '🦊', panda: '🐼' };
type Category = 'all' | 'furniture' | 'pet' | 'decoration' | 'window';

const COMPANION_LINES: Record<string, string[][]> = {
  owl: [
    ['Hoot hoot! 🦉', "I'm so proud of you!", 'Keep collecting stars!'],
    ['Wisdom is knowing...', '...that practice makes perfect! 📚', 'You\'re doing brilliantly.'],
    ['Did you know?', 'Owls can rotate their heads 270°! 🌀', 'Now THAT\'s a fun fact.'],
    ['Time to study! 🎓', 'Every lesson makes you smarter.', 'I believe in you!'],
    ['Whoo whoo! 🌟', `${'' /* name injected below */}You\'re a superstar!`, 'Come back tomorrow!'],
  ],
  fox: [
    ['Hey there, smarty! 🦊', 'Foxes are clever — just like you!', 'Keep it up!'],
    ['Yip yip! 🎉', 'You\'ve been working so hard.', 'I\'m your biggest fan!'],
    ['Quick tip! ⚡', 'Review your lessons daily.', 'Even 5 minutes helps!'],
    ['Wow wow wow! 🌈', 'Look at all those stars!', 'You\'re amazing!'],
    ['Psst... 🤫', 'The secret to success?', 'Never giving up! Go you!'],
  ],
  panda: [
    ['Nom nom 🐼', '...eating knowledge like bamboo!', 'You\'re doing great!'],
    ['Slow and steady 🎋', 'wins the race — and you\'re racing!', 'I\'m so proud.'],
    ['Chill vibes only 😌', 'But serious about learning!', 'That\'s the panda way.'],
    ['Big panda hug! 🤗', 'Your hard work shows.', 'Don\'t stop now!'],
    ['Yawn... 😴', 'Even I get tired, but...', 'Learning is worth it!'],
  ],
};

export default function RewardsRoom() {
  const { profile, totalStars, ownedItems, placedItems, buyItem, togglePlaced, setView, completedSessions } = useAppStore();
  const [tab, setTab] = useState<'room' | 'shop'>('room');
  const [filter, setFilter] = useState<Category>('all');
  const [companionIdx, setCompanionIdx] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [showBubble, setShowBubble] = useState(false);
  const [bounce, setBounce] = useState(false);
  if (!profile) return null;

  const mascot = MASCOT_EMOJI[profile.mascot];
  const lines = COMPANION_LINES[profile.mascot];
  const currentScript = lines[companionIdx % lines.length];
  const currentLine = currentScript[lineIdx];

  const handleMascotClick = () => {
    if (!showBubble) {
      setShowBubble(true);
      setLineIdx(0);
      setBounce(true);
      setTimeout(() => setBounce(false), 600);
      return;
    }
    if (lineIdx < currentScript.length - 1) {
      setLineIdx(l => l + 1);
    } else {
      setShowBubble(false);
      setCompanionIdx(i => i + 1);
    }
  };

  const themeColor = THEME_COLOR[profile.colorTheme];
  const placed = ROOM_ITEMS.filter(i => placedItems.includes(i.id));
  const shopItems = ROOM_ITEMS.filter(i => filter === 'all' || i.category === filter);
  const hasTreehouse = placedItems.includes('treehouse-upgrade');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => setView('home')} className="text-gray-400 hover:text-gray-600 text-sm">← Home</button>
          <h2 className="font-black text-gray-800">{hasTreehouse ? '🌳 My Treehouse' : '🛏️ My Room'}</h2>
          <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1.5 rounded-full">
            <span>⭐</span>
            <span className="font-black text-yellow-700">{totalStars}</span>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 pb-3 flex gap-2">
          {(['room', 'shop'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${tab === t ? 'text-white' : 'bg-gray-100 text-gray-500'}`}
              style={tab === t ? { background: themeColor } : {}}
            >
              {t === 'room' ? '🏠 My Room' : '🛍️ Shop'}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5">
        {tab === 'room' && (
          <div className="space-y-5">
            {/* Room visualisation */}
            <div
              className="relative rounded-3xl overflow-hidden shadow-xl"
              style={{
                height: 280,
                background: hasTreehouse
                  ? 'linear-gradient(180deg, #86efac 0%, #4ade80 40%, #713f12 100%)'
                  : 'linear-gradient(180deg, #dbeafe 0%, #bfdbfe 40%, #fef3c7 100%)',
              }}
            >
              {/* Room walls */}
              <div
                className="absolute inset-x-0 bottom-0 h-40 rounded-b-3xl"
                style={{ background: hasTreehouse ? '#92400e' : '#fef9c3' }}
              />
              {/* Floor */}
              <div
                className="absolute inset-x-0 bottom-0 h-16 rounded-b-3xl"
                style={{ background: hasTreehouse ? '#78350f' : '#fde68a' }}
              />

              {/* Placed items */}
              {placed.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute text-4xl cursor-pointer select-none"
                  style={{ left: `${item.position.x}%`, top: `${item.position.y}%`, transform: 'translate(-50%, -50%)' }}
                  whileHover={{ scale: 1.2 }}
                  title={item.name}
                >
                  {item.emoji}
                </motion.div>
              ))}

              {/* Interactive mascot companion */}
              <div className="absolute bottom-14 right-6 flex flex-col items-end">
                <AnimatePresence>
                  {showBubble && (
                    <motion.div
                      key={`${companionIdx}-${lineIdx}`}
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="bg-white rounded-2xl shadow-lg px-3 py-2 mb-2 max-w-[160px] text-xs font-semibold text-gray-700 text-center border border-gray-100 cursor-pointer"
                      onClick={handleMascotClick}
                    >
                      {currentLine}
                      <div className="text-gray-300 mt-1 text-[10px]">
                        {lineIdx < currentScript.length - 1 ? 'tap for more ›' : 'tap to close ✕'}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.div
                  animate={bounce ? { y: [-8, 0, -4, 0] } : {}}
                  transition={{ duration: 0.5 }}
                  className="text-5xl cursor-pointer select-none"
                  whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
                  onClick={handleMascotClick}
                  title={`Talk to your ${profile.mascot}!`}
                >
                  {mascot}
                </motion.div>
              </div>

              {placed.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-center px-8">
                  <p className="text-white/70 font-semibold">Your room is empty! 👆<br/>Buy items from the Shop to decorate.</p>
                </div>
              )}
            </div>

            {/* Companion hint */}
            <div className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
              <span className="text-3xl">{mascot}</span>
              <div>
                <div className="font-bold text-gray-700 text-sm">Your companion is here!</div>
                <div className="text-xs text-gray-400">Tap {mascot} in your room to chat. You have <span className="font-bold text-yellow-600">⭐ {totalStars} stars</span> and completed <span className="font-bold">{completedSessions.length}</span> {completedSessions.length === 1 ? 'lesson' : 'lessons'}.</div>
              </div>
            </div>

            {/* Placed items list */}
            <div>
              <h3 className="font-black text-gray-700 mb-3">Items in your room:</h3>
              {ownedItems.length === 0 ? (
                <p className="text-gray-400 text-sm">No items yet — earn stars and visit the shop!</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {ROOM_ITEMS.filter(i => ownedItems.includes(i.id)).map(item => (
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
                  const owned = ownedItems.includes(item.id);
                  const canAfford = totalStars >= item.cost;
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`bg-white rounded-2xl p-4 border-2 shadow-sm ${owned ? 'border-green-300' : 'border-gray-100'}`}
                    >
                      <div className="text-4xl text-center mb-2">{item.emoji}</div>
                      <div className="font-bold text-gray-800 text-sm text-center">{item.name}</div>
                      <div className="text-xs text-gray-400 text-center mb-3">{item.description}</div>
                      {owned ? (
                        <div className="text-center text-green-600 text-xs font-bold">✓ Owned</div>
                      ) : item.cost === 0 ? (
                        <div className="text-center text-gray-400 text-xs">Free starter item</div>
                      ) : (
                        <motion.button
                          whileHover={canAfford ? { scale: 1.03 } : {}}
                          whileTap={canAfford ? { scale: 0.97 } : {}}
                          onClick={() => canAfford && buyItem(item.id, item.cost)}
                          disabled={!canAfford}
                          className="w-full py-2 rounded-xl text-xs font-black transition-all disabled:opacity-40"
                          style={canAfford ? { background: themeColor, color: 'white' } : { background: '#f3f4f6', color: '#9ca3af' }}
                        >
                          ⭐ {item.cost} {canAfford ? 'Buy' : '— need more stars'}
                        </motion.button>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
