import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppStore } from '../store/appStore';

// ─────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─────────────────────────────────────────────
// Game 1: Times Table Blitz
// ─────────────────────────────────────────────

function makeTimesQuestion() {
  const a = Math.floor(Math.random() * 11) + 2; // 2–12
  const b = Math.floor(Math.random() * 11) + 2;
  const correct = a * b;
  const wrongs = new Set<number>();
  while (wrongs.size < 3) {
    const delta = Math.floor(Math.random() * 10) - 5;
    const w = correct + delta;
    if (w !== correct && w > 0) wrongs.add(w);
  }
  const options = shuffle([correct, ...wrongs]);
  return { a, b, correct, options };
}

function TimesTableBlitz({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<'playing' | 'done'>('playing');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [q, setQ] = useState(makeTimesQuestion);
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0) { setPhase('done'); return; }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phase]);

  function answer(opt: number) {
    if (phase !== 'playing') return;
    const correct = opt === q.correct;
    setFlash(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      setFlash(null);
      setQ(makeTimesQuestion());
    }, 400);
  }

  function restart() {
    setScore(0);
    setTimeLeft(30);
    setPhase('playing');
    setQ(makeTimesQuestion());
  }

  const timerColor = timeLeft > 10 ? '#10b981' : timeLeft > 5 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <button onClick={onBack} className="self-start flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm font-semibold">
        ← Back
      </button>

      {phase === 'playing' && (
        <>
          <div className="flex items-center justify-between w-full max-w-sm">
            <div className="text-center">
              <div className="text-2xl font-black text-gray-800">{score}</div>
              <div className="text-xs text-gray-400">Score</div>
            </div>
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-black text-white shadow-lg"
              style={{ background: timerColor }}
            >
              {timeLeft}
            </div>
          </div>

          <div
            className={`w-full max-w-sm rounded-3xl p-8 text-center shadow-xl transition-all ${
              flash === 'correct' ? 'bg-green-100' : flash === 'wrong' ? 'bg-red-100' : 'bg-white'
            }`}
          >
            <div className="text-4xl font-black text-gray-800 mb-2">
              {q.a} × {q.b} = ?
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
            {q.options.map((opt) => (
              <button
                key={opt}
                onClick={() => answer(opt)}
                className="py-4 rounded-2xl text-xl font-black bg-white border-2 border-indigo-100 hover:border-indigo-400 hover:bg-indigo-50 transition-all shadow-sm active:scale-95"
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}

      {phase === 'done' && (
        <div className="flex flex-col items-center gap-4 bg-white rounded-3xl p-8 shadow-xl w-full max-w-sm text-center">
          <div className="text-5xl">🏆</div>
          <h3 className="text-2xl font-black text-gray-800">Time's up!</h3>
          <div className="text-5xl font-black text-indigo-600">{score}</div>
          <div className="text-gray-500 text-sm">
            {score >= 20 ? 'Amazing! You\'re a maths star! 🌟' :
             score >= 10 ? 'Great job! Keep practising! 💪' :
             'Nice try! Play again to beat your score! 🎯'}
          </div>
          <button
            onClick={restart}
            className="w-full py-3 rounded-2xl font-black text-white text-lg bg-indigo-500 hover:bg-indigo-600 transition-all active:scale-95"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Game 2: Word Scramble
// ─────────────────────────────────────────────

const WORD_LIST = [
  'beautiful', 'because', 'different', 'important', 'necessary',
  'opportunity', 'environment', 'government', 'community', 'education',
  'knowledge', 'adventure', 'character', 'narrative', 'persuade',
  'fraction', 'multiply', 'subtract', 'equation', 'geometry',
  'australia', 'continent', 'parliament', 'democracy', 'atmosphere',
  'photosynthesis', 'ecosystem', 'migration', 'electricity', 'gravity',
];

function scramble(word: string): string {
  const arr = word.split('');
  let scrambled = word;
  let attempts = 0;
  while (scrambled === word && attempts < 20) {
    scrambled = shuffle(arr).join('');
    attempts++;
  }
  return scrambled;
}

function WordScramble({ onBack }: { onBack: () => void }) {
  const [words] = useState(() => shuffle(WORD_LIST));
  const [index, setIndex] = useState(0);
  const [lives, setLives] = useState(5);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState('');
  const [hintUsed, setHintUsed] = useState(false);
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null);
  const [phase, setPhase] = useState<'playing' | 'done'>('playing');
  const inputRef = useRef<HTMLInputElement>(null);

  const currentWord = words[index] ?? '';
  const [scrambled] = useState(() => words.map(scramble));

  useEffect(() => { inputRef.current?.focus(); }, [index]);

  function submit() {
    if (input.trim().toLowerCase() === currentWord) {
      setFlash('correct');
      setScore(s => s + 1);
      setTimeout(() => {
        setFlash(null);
        setInput('');
        setHintUsed(false);
        if (index + 1 >= words.length) { setPhase('done'); return; }
        setIndex(i => i + 1);
      }, 500);
    } else {
      setFlash('wrong');
      const newLives = lives - 1;
      setLives(newLives);
      setTimeout(() => {
        setFlash(null);
        setInput('');
        if (newLives <= 0) { setPhase('done'); return; }
      }, 500);
    }
  }

  function restart() {
    setIndex(0);
    setLives(5);
    setScore(0);
    setInput('');
    setHintUsed(false);
    setFlash(null);
    setPhase('playing');
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <button onClick={onBack} className="self-start flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm font-semibold">
        ← Back
      </button>

      {phase === 'playing' && (
        <>
          <div className="flex items-center justify-between w-full max-w-sm">
            <div className="text-center">
              <div className="text-2xl font-black text-gray-800">{score}</div>
              <div className="text-xs text-gray-400">Words solved</div>
            </div>
            <div className="flex gap-1 text-2xl">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>{i < lives ? '❤️' : '🖤'}</span>
              ))}
            </div>
          </div>

          <div
            className={`w-full max-w-sm rounded-3xl p-6 text-center shadow-xl transition-all ${
              flash === 'correct' ? 'bg-green-100' : flash === 'wrong' ? 'bg-red-100' : 'bg-white'
            }`}
          >
            <div className="text-xs text-gray-400 mb-1">Unscramble this word:</div>
            <div className="text-4xl font-black tracking-widest text-indigo-700 mb-3">
              {scrambled[index]}
            </div>
            {hintUsed && (
              <div className="text-sm text-gray-500">
                Hint: starts with <span className="font-black text-indigo-600">{currentWord[0].toUpperCase()}</span>
                {' '}({currentWord.length} letters)
              </div>
            )}
          </div>

          <div className="w-full max-w-sm flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder="Type your answer…"
              className="flex-1 border-2 border-gray-200 rounded-2xl px-4 py-3 text-lg font-semibold focus:border-indigo-400 focus:outline-none"
            />
            <button
              onClick={submit}
              className="px-5 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-black rounded-2xl transition-all active:scale-95"
            >
              ✓
            </button>
          </div>

          {!hintUsed && (
            <button
              onClick={() => setHintUsed(true)}
              className="text-sm text-gray-400 hover:text-indigo-500 underline"
            >
              💡 Use hint (reveals first letter)
            </button>
          )}
        </>
      )}

      {phase === 'done' && (
        <div className="flex flex-col items-center gap-4 bg-white rounded-3xl p-8 shadow-xl w-full max-w-sm text-center">
          <div className="text-5xl">{lives > 0 ? '🎉' : '💔'}</div>
          <h3 className="text-2xl font-black text-gray-800">
            {lives > 0 ? 'All words done!' : 'Game over!'}
          </h3>
          <div className="text-5xl font-black text-indigo-600">{score}</div>
          <div className="text-gray-500 text-sm">words solved</div>
          <button
            onClick={restart}
            className="w-full py-3 rounded-2xl font-black text-white text-lg bg-indigo-500 hover:bg-indigo-600 transition-all active:scale-95"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Game 3: Memory Match
// ─────────────────────────────────────────────

const CARD_PAIRS = ['📚', '🔢', '🌍', '✏️', '🔬', '🎵', '🏆', '🌿'];

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function makeCards(): Card[] {
  return shuffle([...CARD_PAIRS, ...CARD_PAIRS]).map((emoji, i) => ({
    id: i,
    emoji,
    flipped: false,
    matched: false,
  }));
}

function MemoryMatch({ onBack }: { onBack: () => void }) {
  const [cards, setCards] = useState<Card[]>(makeCards);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [phase, setPhase] = useState<'playing' | 'done'>('playing');
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (phase !== 'playing') return;
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  const flip = useCallback((id: number) => {
    if (locked || phase !== 'playing') return;
    const card = cards.find(c => c.id === id);
    if (!card || card.flipped || card.matched) return;
    if (selected.length === 1 && selected[0] === id) return;

    const newCards = cards.map(c => c.id === id ? { ...c, flipped: true } : c);
    setCards(newCards);

    if (selected.length === 0) {
      setSelected([id]);
    } else {
      const firstId = selected[0];
      const first = newCards.find(c => c.id === firstId)!;
      const second = newCards.find(c => c.id === id)!;
      setMoves(m => m + 1);
      setLocked(true);

      if (first.emoji === second.emoji) {
        const matched = newCards.map(c =>
          c.id === firstId || c.id === id ? { ...c, matched: true } : c
        );
        setCards(matched);
        setSelected([]);
        setLocked(false);
        if (matched.every(c => c.matched)) setPhase('done');
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === firstId || c.id === id ? { ...c, flipped: false } : c
          ));
          setSelected([]);
          setLocked(false);
        }, 900);
      }
    }
  }, [cards, selected, locked, phase]);

  function restart() {
    setCards(makeCards());
    setSelected([]);
    setMoves(0);
    setSeconds(0);
    setPhase('playing');
    setLocked(false);
  }

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="flex flex-col items-center gap-5 p-4">
      <button onClick={onBack} className="self-start flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm font-semibold">
        ← Back
      </button>

      {phase === 'playing' && (
        <>
          <div className="flex items-center justify-between w-full max-w-sm">
            <div className="text-center">
              <div className="text-xl font-black text-gray-800">{fmt(seconds)}</div>
              <div className="text-xs text-gray-400">Time</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-black text-gray-800">{moves}</div>
              <div className="text-xs text-gray-400">Moves</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-black text-gray-800">{cards.filter(c => c.matched).length / 2}</div>
              <div className="text-xs text-gray-400">Pairs</div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 w-full max-w-sm">
            {cards.map(card => (
              <button
                key={card.id}
                onClick={() => flip(card.id)}
                className={`aspect-square rounded-2xl text-3xl flex items-center justify-center font-bold shadow-sm transition-all active:scale-95 ${
                  card.matched
                    ? 'bg-green-100 border-2 border-green-300'
                    : card.flipped
                    ? 'bg-indigo-50 border-2 border-indigo-300'
                    : 'bg-indigo-500 hover:bg-indigo-600 border-2 border-indigo-600'
                }`}
              >
                {(card.flipped || card.matched) ? card.emoji : '?'}
              </button>
            ))}
          </div>
        </>
      )}

      {phase === 'done' && (
        <div className="flex flex-col items-center gap-4 bg-white rounded-3xl p-8 shadow-xl w-full max-w-sm text-center">
          <div className="text-5xl">🎉</div>
          <h3 className="text-2xl font-black text-gray-800">You matched them all!</h3>
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-indigo-50 rounded-2xl p-3">
              <div className="text-2xl font-black text-indigo-700">{fmt(seconds)}</div>
              <div className="text-xs text-gray-500">Time taken</div>
            </div>
            <div className="bg-indigo-50 rounded-2xl p-3">
              <div className="text-2xl font-black text-indigo-700">{moves}</div>
              <div className="text-xs text-gray-500">Moves used</div>
            </div>
          </div>
          <button
            onClick={restart}
            className="w-full py-3 rounded-2xl font-black text-white text-lg bg-indigo-500 hover:bg-indigo-600 transition-all active:scale-95"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Game 4: Maths Speed Round
// ─────────────────────────────────────────────

type Op = '+' | '-' | '×' | '÷';

function makeMathsQuestion(): { text: string; answer: number } {
  const ops: Op[] = ['+', '-', '×', '÷'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, answer: number;

  switch (op) {
    case '+':
      a = Math.floor(Math.random() * 50) + 1;
      b = Math.floor(Math.random() * 50) + 1;
      answer = a + b;
      break;
    case '-':
      a = Math.floor(Math.random() * 50) + 10;
      b = Math.floor(Math.random() * a) + 1;
      answer = a - b;
      break;
    case '×':
      a = Math.floor(Math.random() * 11) + 2;
      b = Math.floor(Math.random() * 11) + 2;
      answer = a * b;
      break;
    case '÷': {
      b = Math.floor(Math.random() * 11) + 2;
      answer = Math.floor(Math.random() * 11) + 2;
      a = b * answer;
      break;
    }
  }
  return { text: `${a} ${op} ${b} = ?`, answer };
}

const TOTAL_QUESTIONS = 20;
const SECONDS_PER_Q = 3;

function MathsSpeedRound({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<'playing' | 'done'>('playing');
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_Q);
  const [q, setQ] = useState(makeMathsQuestion);
  const [flash, setFlash] = useState<'correct' | 'wrong' | 'timeout' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const advance = useCallback((correct: boolean, flashType: 'correct' | 'wrong' | 'timeout') => {
    setFlash(flashType);
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      setFlash(null);
      setInput('');
      const next = qIndex + 1;
      if (next >= TOTAL_QUESTIONS) { setPhase('done'); return; }
      setQIndex(next);
      setQ(makeMathsQuestion());
      setTimeLeft(SECONDS_PER_Q);
    }, 400);
  }, [qIndex]);

  useEffect(() => {
    if (phase !== 'playing' || flash) return;
    if (timeLeft <= 0) { advance(false, 'timeout'); return; }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phase, flash, advance]);

  useEffect(() => { inputRef.current?.focus(); }, [qIndex]);

  function submit() {
    const val = parseInt(input, 10);
    if (isNaN(val)) return;
    advance(val === q.answer, val === q.answer ? 'correct' : 'wrong');
  }

  function restart() {
    setPhase('playing');
    setQIndex(0);
    setScore(0);
    setInput('');
    setTimeLeft(SECONDS_PER_Q);
    setQ(makeMathsQuestion());
    setFlash(null);
  }

  const timerColor = timeLeft === 3 ? '#10b981' : timeLeft === 2 ? '#f59e0b' : '#ef4444';
  const pct = (qIndex / TOTAL_QUESTIONS) * 100;

  return (
    <div className="flex flex-col items-center gap-5 p-4">
      <button onClick={onBack} className="self-start flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm font-semibold">
        ← Back
      </button>

      {phase === 'playing' && (
        <>
          <div className="flex items-center justify-between w-full max-w-sm">
            <div className="text-center">
              <div className="text-2xl font-black text-gray-800">{score}</div>
              <div className="text-xs text-gray-400">Score</div>
            </div>
            <div className="text-sm text-gray-500 font-semibold">
              {qIndex + 1} / {TOTAL_QUESTIONS}
            </div>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-black text-white shadow"
              style={{ background: timerColor }}
            >
              {timeLeft}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-sm bg-gray-100 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-indigo-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>

          <div
            className={`w-full max-w-sm rounded-3xl p-8 text-center shadow-xl transition-all ${
              flash === 'correct' ? 'bg-green-100' : flash === 'wrong' || flash === 'timeout' ? 'bg-red-100' : 'bg-white'
            }`}
          >
            <div className="text-3xl font-black text-gray-800">{q.text}</div>
          </div>

          <div className="w-full max-w-sm flex gap-2">
            <input
              ref={inputRef}
              type="number"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder="Answer…"
              className="flex-1 border-2 border-gray-200 rounded-2xl px-4 py-3 text-xl font-bold focus:border-indigo-400 focus:outline-none"
            />
            <button
              onClick={submit}
              className="px-5 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-black rounded-2xl transition-all active:scale-95"
            >
              ✓
            </button>
          </div>
        </>
      )}

      {phase === 'done' && (
        <div className="flex flex-col items-center gap-4 bg-white rounded-3xl p-8 shadow-xl w-full max-w-sm text-center">
          <div className="text-5xl">
            {score >= 18 ? '🌟' : score >= 14 ? '🏆' : score >= 10 ? '👍' : '🎯'}
          </div>
          <h3 className="text-2xl font-black text-gray-800">Round complete!</h3>
          <div className="text-5xl font-black text-indigo-600">{score} / {TOTAL_QUESTIONS}</div>
          <div className="text-gray-500 text-sm">
            {score >= 18 ? 'Outstanding! You\'re a maths genius! 🌟' :
             score >= 14 ? 'Excellent work! Keep it up! 💪' :
             score >= 10 ? 'Good effort! Practice makes perfect! 📚' :
             'Keep practising — you\'ll get there! 🎯'}
          </div>
          <button
            onClick={restart}
            className="w-full py-3 rounded-2xl font-black text-white text-lg bg-indigo-500 hover:bg-indigo-600 transition-all active:scale-95"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Games Hub
// ─────────────────────────────────────────────

type GameId = 'times' | 'scramble' | 'memory' | 'maths';

const GAMES = [
  {
    id: 'times' as GameId,
    emoji: '⚡',
    name: 'Times Table Blitz',
    desc: 'Answer times tables in 30 seconds!',
    color: '#6366f1',
  },
  {
    id: 'scramble' as GameId,
    emoji: '🔤',
    name: 'Word Scramble',
    desc: 'Unscramble tricky English words',
    color: '#10b981',
  },
  {
    id: 'memory' as GameId,
    emoji: '🧠',
    name: 'Memory Match',
    desc: 'Flip cards and find all the pairs',
    color: '#f59e0b',
  },
  {
    id: 'maths' as GameId,
    emoji: '🚀',
    name: 'Maths Speed Round',
    desc: '20 maths questions, 3 seconds each',
    color: '#ef4444',
  },
];

export default function GamesHub() {
  const { setView } = useAppStore();
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeGame && (
              <button
                onClick={() => setActiveGame(null)}
                className="text-gray-500 hover:text-gray-700 font-semibold text-sm mr-1"
              >
                ← Games
              </button>
            )}
            <span className="text-2xl">🎮</span>
            <div>
              <div className="font-black text-gray-800 text-sm leading-none">Mini Games</div>
              <div className="text-xs text-gray-400">Learn4</div>
            </div>
          </div>
          <button
            onClick={() => setView('home')}
            className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded-full px-3 py-1.5"
          >
            ← Home
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {!activeGame && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-gray-800">Pick a Game!</h2>
              <p className="text-gray-500 text-sm mt-1">Fun ways to practise your skills</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {GAMES.map(game => (
                <div
                  key={game.id}
                  className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
                >
                  <div className="text-5xl">{game.emoji}</div>
                  <div>
                    <h3 className="font-black text-gray-800 text-lg leading-tight">{game.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{game.desc}</p>
                  </div>
                  <button
                    onClick={() => setActiveGame(game.id)}
                    className="mt-auto py-2.5 px-5 rounded-2xl font-black text-white text-sm transition-all active:scale-95 hover:opacity-90"
                    style={{ background: game.color }}
                  >
                    Play →
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {activeGame === 'times' && <TimesTableBlitz onBack={() => setActiveGame(null)} />}
        {activeGame === 'scramble' && <WordScramble onBack={() => setActiveGame(null)} />}
        {activeGame === 'memory' && <MemoryMatch onBack={() => setActiveGame(null)} />}
        {activeGame === 'maths' && <MathsSpeedRound onBack={() => setActiveGame(null)} />}
      </div>
    </div>
  );
}
