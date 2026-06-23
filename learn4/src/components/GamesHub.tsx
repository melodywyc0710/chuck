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
                className="btn-duo py-4 rounded-2xl text-xl font-black bg-white border-2 border-gray-200 hover:border-green-400 hover:bg-green-50 transition-all shadow-sm"
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
          <div className="text-5xl font-black" style={{ color: '#58CC02' }}>{score}</div>
          <div className="text-gray-500 text-sm">
            {score >= 20 ? 'Amazing! You\'re a maths star! 🌟' :
             score >= 10 ? 'Great job! Keep practising! 💪' :
             'Nice try! Play again to beat your score! 🎯'}
          </div>
          <button
            onClick={restart}
            className="btn-duo w-full py-3 rounded-2xl font-black text-white text-lg" style={{ background: '#58CC02', borderBottomColor: '#46A302' }}
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
  'apple', 'chair', 'grass', 'light', 'beach',
  'cloud', 'earth', 'flame', 'grape', 'heart',
  'juice', 'lemon', 'magic', 'night', 'ocean',
  'paint', 'rainy', 'shade', 'table', 'water',
  'plant', 'stone', 'steam', 'bread', 'cream',
  'dream', 'frog', 'star', 'moon', 'bird',
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
            <div className="text-4xl font-black tracking-widest text-green-700 mb-3">
              {scrambled[index]}
            </div>
            {hintUsed && (
              <div className="text-sm text-gray-500">
                Hint: starts with <span className="font-black" style={{ color: '#58CC02' }}>{currentWord[0].toUpperCase()}</span>
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
              className="flex-1 border-2 border-gray-200 rounded-2xl px-4 py-3 text-lg font-semibold focus:border-green-400 focus:outline-none"
            />
            <button
              onClick={submit}
              className="px-5 py-3 btn-duo text-white font-black rounded-2xl" style={{ background: '#58CC02', borderBottomColor: '#46A302' }}
            >
              ✓
            </button>
          </div>

          {!hintUsed && (
            <button
              onClick={() => setHintUsed(true)}
              className="text-sm text-gray-400 hover:text-green-500 underline"
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
          <div className="text-5xl font-black" style={{ color: '#58CC02' }}>{score}</div>
          <div className="text-gray-500 text-sm">words solved</div>
          <button
            onClick={restart}
            className="btn-duo w-full py-3 rounded-2xl font-black text-white text-lg" style={{ background: '#58CC02', borderBottomColor: '#46A302' }}
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
                    ? 'bg-green-50 border-2 border-green-300'
                    : 'bg-green-500 hover:bg-green-600 border-2 border-green-600'
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
            <div className="bg-green-50 rounded-2xl p-3">
              <div className="text-2xl font-black text-green-700">{fmt(seconds)}</div>
              <div className="text-xs text-gray-500">Time taken</div>
            </div>
            <div className="bg-green-50 rounded-2xl p-3">
              <div className="text-2xl font-black text-green-700">{moves}</div>
              <div className="text-xs text-gray-500">Moves used</div>
            </div>
          </div>
          <button
            onClick={restart}
            className="btn-duo w-full py-3 rounded-2xl font-black text-white text-lg" style={{ background: '#58CC02', borderBottomColor: '#46A302' }}
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
              className="h-2 rounded-full bg-green-500 transition-all"
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
              className="flex-1 border-2 border-gray-200 rounded-2xl px-4 py-3 text-xl font-bold focus:border-green-400 focus:outline-none"
            />
            <button
              onClick={submit}
              className="px-5 py-3 btn-duo text-white font-black rounded-2xl" style={{ background: '#58CC02', borderBottomColor: '#46A302' }}
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
          <div className="text-5xl font-black" style={{ color: '#58CC02' }}>{score} / {TOTAL_QUESTIONS}</div>
          <div className="text-gray-500 text-sm">
            {score >= 18 ? 'Outstanding! You\'re a maths genius! 🌟' :
             score >= 14 ? 'Excellent work! Keep it up! 💪' :
             score >= 10 ? 'Good effort! Practice makes perfect! 📚' :
             'Keep practising — you\'ll get there! 🎯'}
          </div>
          <button
            onClick={restart}
            className="btn-duo w-full py-3 rounded-2xl font-black text-white text-lg" style={{ background: '#58CC02', borderBottomColor: '#46A302' }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Game 5: True or False
// ─────────────────────────────────────────────

const TRUE_FALSE_QUESTIONS = [
  { q: 'Australia is the smallest continent.', answer: false, explanation: 'Antarctica is the smallest continent. Australia is the smallest, but it\'s usually called a continent-country.' },
  { q: 'There are 12 months in a year.', answer: true, explanation: 'January through December — 12 months in every year!' },
  { q: 'A triangle has four sides.', answer: false, explanation: 'A triangle has THREE sides. A quadrilateral (like a square) has four sides.' },
  { q: 'The sun rises in the east.', answer: true, explanation: 'The sun always rises in the east and sets in the west.' },
  { q: 'Spiders are insects.', answer: false, explanation: 'Spiders are arachnids, not insects. Insects have 6 legs; spiders have 8.' },
  { q: 'Water boils at 100°C at sea level.', answer: true, explanation: 'Water boils at exactly 100°C (212°F) at standard sea-level pressure.' },
  { q: 'The Great Barrier Reef is in Queensland, Australia.', answer: true, explanation: 'The Great Barrier Reef stretches along the northeast coast of Queensland.' },
  { q: 'Mammals are cold-blooded animals.', answer: false, explanation: 'Mammals (including humans) are warm-blooded — they maintain a constant body temperature.' },
  { q: 'The plural of "mouse" is "mouses".', answer: false, explanation: 'The correct plural of mouse is "mice" — an irregular plural.' },
  { q: 'A square is a special type of rectangle.', answer: true, explanation: 'A square has all the properties of a rectangle (4 right angles, 2 pairs of parallel sides) plus all sides are equal.' },
  { q: 'Photosynthesis produces oxygen.', answer: true, explanation: 'Plants absorb CO₂ and water, and use sunlight to make glucose — releasing oxygen as a byproduct.' },
  { q: 'The capital of Australia is Sydney.', answer: false, explanation: 'The capital of Australia is Canberra, not Sydney. Sydney is the largest city.' },
  { q: '7 × 8 = 54', answer: false, explanation: '7 × 8 = 56, not 54.' },
  { q: 'Adjectives describe nouns.', answer: true, explanation: 'Adjectives are describing words — they tell us more about nouns (people, places, things).' },
  { q: 'The Earth takes 365 days to orbit the Sun.', answer: true, explanation: 'Earth\'s orbital period is approximately 365.25 days — the extra quarter day is why we have leap years every 4 years.' },
];

function TrueOrFalse({ onBack }: { onBack: () => void }) {
  const [questions] = useState(() => shuffle(TRUE_FALSE_QUESTIONS));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<boolean | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [phase, setPhase] = useState<'playing' | 'done'>('playing');

  const q = questions[index];

  function answer(choice: boolean) {
    if (confirmed) return;
    setSelected(choice);
    setConfirmed(true);
    if (choice === q.answer) setScore(s => s + 1);
  }

  function next() {
    if (index + 1 >= questions.length) { setPhase('done'); return; }
    setIndex(i => i + 1);
    setSelected(null);
    setConfirmed(false);
  }

  function restart() {
    setIndex(0);
    setScore(0);
    setSelected(null);
    setConfirmed(false);
    setPhase('playing');
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <button onClick={onBack} className="self-start flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm font-semibold">← Back</button>

      {phase === 'playing' && (
        <>
          <div className="flex items-center justify-between w-full max-w-sm">
            <div className="text-center">
              <div className="text-2xl font-black text-gray-800">{score}</div>
              <div className="text-xs text-gray-400">Correct</div>
            </div>
            <div className="text-sm text-gray-500 font-semibold">{index + 1} / {questions.length}</div>
          </div>

          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl text-center">
            <div className="text-xs text-gray-400 mb-3 uppercase tracking-wide font-bold">True or False?</div>
            <div className="text-xl font-black text-gray-800 leading-snug">{q.q}</div>
          </div>

          <div className="flex gap-3 w-full max-w-sm">
            {([true, false] as const).map(choice => {
              const isSelected = selected === choice;
              const isCorrect = confirmed && choice === q.answer;
              const isWrong = confirmed && isSelected && choice !== q.answer;
              return (
                <button
                  key={String(choice)}
                  onClick={() => answer(choice)}
                  className={`flex-1 py-5 rounded-2xl text-xl font-black transition-all active:scale-95 ${
                    isCorrect ? 'bg-green-500 text-white' :
                    isWrong ? 'bg-red-500 text-white' :
                    isSelected ? 'bg-green-100 border-2 border-green-400 text-green-700' :
                    'bg-white border-2 border-gray-200 text-gray-700 hover:border-green-300'
                  }`}
                >
                  {choice ? '✅ True' : '❌ False'}
                </button>
              );
            })}
          </div>

          {confirmed && (
            <div className="w-full max-w-sm bg-blue-50 rounded-2xl p-4 border border-blue-200">
              <div className={`font-bold mb-1 ${selected === q.answer ? 'text-green-600' : 'text-red-600'}`}>
                {selected === q.answer ? '✓ Correct!' : `✗ The answer is ${q.answer ? 'TRUE' : 'FALSE'}`}
              </div>
              <p className="text-sm text-gray-600">{q.explanation}</p>
              <button
                onClick={next}
                className="btn-duo mt-3 w-full py-2.5 rounded-xl text-white font-black" style={{ background: '#58CC02', borderBottomColor: '#46A302' }}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {phase === 'done' && (
        <div className="flex flex-col items-center gap-4 bg-white rounded-3xl p-8 shadow-xl w-full max-w-sm text-center">
          <div className="text-5xl">{score >= 12 ? '🏆' : score >= 8 ? '🎉' : '💪'}</div>
          <h3 className="text-2xl font-black text-gray-800">All done!</h3>
          <div className="text-5xl font-black" style={{ color: '#58CC02' }}>{score} / {questions.length}</div>
          <div className="text-gray-500 text-sm">{score >= 12 ? 'Amazing! You\'re a knowledge star! 🌟' : score >= 8 ? 'Great work! Keep learning! 💪' : 'Good try! Keep practising! 📚'}</div>
          <button onClick={restart} className="btn-duo w-full py-3 rounded-2xl font-black text-white text-lg" style={{ background: '#58CC02', borderBottomColor: '#46A302' }}>Play Again</button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Game 6: Number Patterns
// ─────────────────────────────────────────────

function makePatternQuestion() {
  const patterns = [
    { seq: [2, 4, 6, 8], next: 10, rule: 'Add 2 each time (+2)' },
    { seq: [3, 6, 9, 12], next: 15, rule: 'Multiply by 3 table (+3)' },
    { seq: [5, 10, 15, 20], next: 25, rule: 'Count by 5s (+5)' },
    { seq: [1, 3, 5, 7], next: 9, rule: 'Odd numbers (+2)' },
    { seq: [10, 20, 30, 40], next: 50, rule: 'Count by 10s (+10)' },
    { seq: [100, 90, 80, 70], next: 60, rule: 'Count backwards by 10 (−10)' },
    { seq: [1, 2, 4, 8], next: 16, rule: 'Double each time (×2)' },
    { seq: [64, 32, 16, 8], next: 4, rule: 'Halve each time (÷2)' },
    { seq: [1, 4, 9, 16], next: 25, rule: 'Square numbers (1², 2², 3², 4²...)' },
    { seq: [3, 6, 12, 24], next: 48, rule: 'Double each time (×2)' },
    { seq: [50, 45, 40, 35], next: 30, rule: 'Subtract 5 each time (−5)' },
    { seq: [2, 5, 8, 11], next: 14, rule: 'Add 3 each time (+3)' },
    { seq: [0, 7, 14, 21], next: 28, rule: '7 times table (+7)' },
    { seq: [1, 1, 2, 3], next: 5, rule: 'Fibonacci: add the previous two numbers' },
    { seq: [4, 8, 12, 16], next: 20, rule: '4 times table (+4)' },
  ];
  const p = patterns[Math.floor(Math.random() * patterns.length)];
  const wrong = new Set<number>();
  while (wrong.size < 3) {
    const delta = (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
    const w = p.next + delta;
    if (w !== p.next && w >= 0) wrong.add(w);
  }
  return { seq: p.seq, next: p.next, rule: p.rule, options: shuffle([p.next, ...wrong]) };
}

function NumberPatterns({ onBack }: { onBack: () => void }) {
  const [q, setQ] = useState(makePatternQuestion);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const isCorrect = selected === q.next;

  function choose(opt: number) {
    if (confirmed) return;
    setSelected(opt);
    setConfirmed(true);
    if (opt === q.next) setScore(s => s + 1);
    setTotal(t => t + 1);
  }

  function next() {
    setQ(makePatternQuestion());
    setSelected(null);
    setConfirmed(false);
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <button onClick={onBack} className="self-start flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm font-semibold">← Back</button>

      <div className="flex items-center justify-between w-full max-w-sm">
        <div className="text-center">
          <div className="text-2xl font-black text-gray-800">{score}</div>
          <div className="text-xs text-gray-400">Correct</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-black text-gray-800">{total}</div>
          <div className="text-xs text-gray-400">Answered</div>
        </div>
      </div>

      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl text-center">
        <div className="text-xs text-gray-400 mb-3 uppercase tracking-wide font-bold">What comes next?</div>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {q.seq.map((n, i) => (
            <div key={i} className="w-14 h-14 bg-green-50 border-2 border-green-200 rounded-2xl flex items-center justify-center text-xl font-black text-green-700">
              {n}
            </div>
          ))}
          <div className="w-14 h-14 bg-yellow-50 border-2 border-dashed border-yellow-400 rounded-2xl flex items-center justify-center text-2xl font-black text-yellow-500">
            ?
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {q.options.map(opt => {
          const isThis = selected === opt;
          const isCorrectOpt = confirmed && opt === q.next;
          const isWrong = confirmed && isThis && opt !== q.next;
          return (
            <button
              key={opt}
              onClick={() => choose(opt)}
              className={`py-4 rounded-2xl text-xl font-black transition-all active:scale-95 ${
                isCorrectOpt ? 'bg-green-500 text-white' :
                isWrong ? 'bg-red-500 text-white' :
                isThis ? 'bg-green-100 border-2 border-green-400 text-green-700' :
                'bg-white border-2 border-gray-200 text-gray-700 hover:border-green-300'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {confirmed && (
        <div className="w-full max-w-sm bg-blue-50 rounded-2xl p-4 border border-blue-200">
          <div className={`font-bold mb-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? '✓ Correct!' : `✗ The answer is ${q.next}`}
          </div>
          <p className="text-sm text-gray-600">Pattern: {q.rule}</p>
          <button onClick={next} className="btn-duo mt-3 w-full py-2.5 rounded-xl text-white font-black" style={{ background: '#58CC02', borderBottomColor: '#46A302' }}>Next →</button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Game 7: Word Meaning Match
// ─────────────────────────────────────────────

const WORD_MEANINGS = [
  { word: 'enormous', meaning: 'Very, very large in size', wrong: ['Very small', 'Very fast', 'Very loud'] },
  { word: 'timid', meaning: 'Shy and easily frightened', wrong: ['Brave and bold', 'Loud and noisy', 'Tall and strong'] },
  { word: 'ancient', meaning: 'Very old, from a long time ago', wrong: ['Brand new', 'Very modern', 'Very shiny'] },
  { word: 'curious', meaning: 'Eager to learn or know something', wrong: ['Bored and sleepy', 'Angry and upset', 'Happy and excited'] },
  { word: 'fragile', meaning: 'Easily broken or damaged', wrong: ['Very strong and tough', 'Very heavy', 'Very colourful'] },
  { word: 'harvest', meaning: 'To gather crops from the land', wrong: ['To plant seeds in the ground', 'To water plants', 'To buy food from a shop'] },
  { word: 'migrate', meaning: 'To move from one place to another', wrong: ['To stay in one place', 'To sleep for winter', 'To eat a lot of food'] },
  { word: 'predict', meaning: 'To say what will happen in the future', wrong: ['To forget something', 'To draw a picture', 'To explain the past'] },
  { word: 'evidence', meaning: 'Information that proves something is true', wrong: ['A guess or opinion', 'A type of experiment', 'A book or story'] },
  { word: 'persuade', meaning: 'To convince someone to do or believe something', wrong: ['To ignore someone', 'To argue loudly', 'To teach a lesson'] },
  { word: 'tranquil', meaning: 'Calm and peaceful', wrong: ['Loud and busy', 'Dark and cold', 'Bright and colourful'] },
  { word: 'vibrant', meaning: 'Full of energy and brightness', wrong: ['Quiet and dull', 'Small and delicate', 'Old and faded'] },
];

function WordMeaning({ onBack }: { onBack: () => void }) {
  const [words] = useState(() => shuffle(WORD_MEANINGS));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [phase, setPhase] = useState<'playing' | 'done'>('playing');
  const [options] = useState(() => words.map(w => shuffle([w.meaning, ...w.wrong])));

  const w = words[index];

  function choose(opt: string) {
    if (confirmed) return;
    setSelected(opt);
    setConfirmed(true);
    if (opt === w.meaning) setScore(s => s + 1);
  }

  function next() {
    if (index + 1 >= words.length) { setPhase('done'); return; }
    setIndex(i => i + 1);
    setSelected(null);
    setConfirmed(false);
  }

  function restart() {
    setIndex(0);
    setScore(0);
    setSelected(null);
    setConfirmed(false);
    setPhase('playing');
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <button onClick={onBack} className="self-start flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm font-semibold">← Back</button>

      {phase === 'playing' && (
        <>
          <div className="flex items-center justify-between w-full max-w-sm">
            <div className="text-center">
              <div className="text-2xl font-black text-gray-800">{score}</div>
              <div className="text-xs text-gray-400">Correct</div>
            </div>
            <div className="text-sm text-gray-500 font-semibold">{index + 1} / {words.length}</div>
          </div>

          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl text-center">
            <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-bold">What does this word mean?</div>
            <div className="text-4xl font-black text-green-700 mt-2">{w.word}</div>
          </div>

          <div className="space-y-2 w-full max-w-sm">
            {options[index].map(opt => {
              const isThis = selected === opt;
              const isCorrectOpt = confirmed && opt === w.meaning;
              const isWrong = confirmed && isThis && opt !== w.meaning;
              return (
                <button
                  key={opt}
                  onClick={() => choose(opt)}
                  className={`w-full text-left p-4 rounded-2xl font-semibold transition-all active:scale-[0.99] ${
                    isCorrectOpt ? 'bg-green-500 text-white' :
                    isWrong ? 'bg-red-500 text-white' :
                    isThis ? 'bg-green-100 border-2 border-green-400 text-green-800' :
                    'bg-white border-2 border-gray-200 text-gray-700 hover:border-green-300'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {confirmed && (
            <div className="w-full max-w-sm">
              <button onClick={next} className="btn-duo w-full py-3 rounded-2xl text-white font-black" style={{ background: '#58CC02', borderBottomColor: '#46A302' }}>
                {index + 1 >= words.length ? 'See Results →' : 'Next Word →'}
              </button>
            </div>
          )}
        </>
      )}

      {phase === 'done' && (
        <div className="flex flex-col items-center gap-4 bg-white rounded-3xl p-8 shadow-xl w-full max-w-sm text-center">
          <div className="text-5xl">{score >= 10 ? '🧠' : score >= 6 ? '📚' : '💪'}</div>
          <h3 className="text-2xl font-black text-gray-800">Vocabulary Champion!</h3>
          <div className="text-5xl font-black" style={{ color: '#58CC02' }}>{score} / {words.length}</div>
          <div className="text-gray-500 text-sm">{score >= 10 ? 'Outstanding vocabulary!' : score >= 6 ? 'Great word knowledge!' : 'Keep building your vocab!'}</div>
          <button onClick={restart} className="btn-duo w-full py-3 rounded-2xl font-black text-white text-lg" style={{ background: '#58CC02', borderBottomColor: '#46A302' }}>Play Again</button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Game 8: Odd One Out
// ─────────────────────────────────────────────

const ODD_ONE_OUT_QUESTIONS = [
  { items: ['cat', 'dog', 'eagle', 'rabbit'], odd: 'eagle', reason: 'Eagle is a bird — the others are mammals.' },
  { items: ['red', 'blue', 'green', 'triangle'], odd: 'triangle', reason: 'Triangle is a shape — the others are colours.' },
  { items: ['2', '4', '7', '8'], odd: '7', reason: '7 is odd — the others are all even numbers.' },
  { items: ['apple', 'banana', 'carrot', 'mango'], odd: 'carrot', reason: 'Carrot is a vegetable — the others are fruits.' },
  { items: ['Sydney', 'Melbourne', 'London', 'Brisbane'], odd: 'London', reason: 'London is in England — the others are Australian cities.' },
  { items: ['noun', 'verb', 'adjective', 'fraction'], odd: 'fraction', reason: 'Fraction is a maths term — the others are parts of speech.' },
  { items: ['add', 'subtract', 'multiply', 'persuade'], odd: 'persuade', reason: 'Persuade is an English word — the others are maths operations.' },
  { items: ['Venus', 'Mars', 'Jupiter', 'Moon'], odd: 'Moon', reason: 'The Moon is a natural satellite — the others are planets.' },
  { items: ['piano', 'guitar', 'drum', 'trumpet'], odd: 'drum', reason: 'Drum is a percussion instrument — the others are string or brass.' },
  { items: ['oxygen', 'carbon dioxide', 'water', 'iron'], odd: 'iron', reason: 'Iron is a solid metal element — the others are gases or liquids involved in photosynthesis.' },
  { items: ['penguin', 'parrot', 'sparrow', 'eagle'], odd: 'penguin', reason: 'A penguin cannot fly — the others are all flying birds.' },
  { items: ['triangle', 'circle', 'square', 'rectangle'], odd: 'circle', reason: 'A circle has no straight sides — the others are polygons with straight edges.' },
];

function OddOneOut({ onBack }: { onBack: () => void }) {
  const [questions] = useState(() => shuffle(ODD_ONE_OUT_QUESTIONS));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [phase, setPhase] = useState<'playing' | 'done'>('playing');

  const q = questions[index];
  const isCorrect = selected === q.odd;

  function choose(item: string) {
    if (confirmed) return;
    setSelected(item);
    setConfirmed(true);
    if (item === q.odd) setScore(s => s + 1);
  }

  function next() {
    if (index + 1 >= questions.length) { setPhase('done'); return; }
    setIndex(i => i + 1);
    setSelected(null);
    setConfirmed(false);
  }

  function restart() {
    setIndex(0);
    setScore(0);
    setSelected(null);
    setConfirmed(false);
    setPhase('playing');
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <button onClick={onBack} className="self-start flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm font-semibold">← Back</button>

      {phase === 'playing' && (
        <>
          <div className="flex items-center justify-between w-full max-w-sm">
            <div className="text-center">
              <div className="text-2xl font-black text-gray-800">{score}</div>
              <div className="text-xs text-gray-400">Correct</div>
            </div>
            <div className="text-sm text-gray-500 font-semibold">{index + 1} / {questions.length}</div>
          </div>

          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl text-center">
            <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-bold">Which one doesn't belong?</div>
            <div className="text-gray-500 text-sm mt-1">Tap the odd one out!</div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
            {q.items.map(item => {
              const isThis = selected === item;
              const isCorrectOpt = confirmed && item === q.odd;
              const isWrong = confirmed && isThis && item !== q.odd;
              return (
                <button
                  key={item}
                  onClick={() => choose(item)}
                  className={`py-5 rounded-2xl text-lg font-black capitalize transition-all active:scale-95 ${
                    isCorrectOpt ? 'bg-green-500 text-white' :
                    isWrong ? 'bg-red-500 text-white' :
                    isThis ? 'bg-green-100 border-2 border-green-400 text-green-700' :
                    'bg-white border-2 border-gray-200 text-gray-700 hover:border-green-300'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          {confirmed && (
            <div className="w-full max-w-sm bg-blue-50 rounded-2xl p-4 border border-blue-200">
              <div className={`font-bold mb-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? '✓ Correct!' : `✗ The odd one out is "${q.odd}"`}
              </div>
              <p className="text-sm text-gray-600">{q.reason}</p>
              <button onClick={next} className="btn-duo mt-3 w-full py-2.5 rounded-xl text-white font-black" style={{ background: '#58CC02', borderBottomColor: '#46A302' }}>
                {index + 1 >= questions.length ? 'See Results →' : 'Next →'}
              </button>
            </div>
          )}
        </>
      )}

      {phase === 'done' && (
        <div className="flex flex-col items-center gap-4 bg-white rounded-3xl p-8 shadow-xl w-full max-w-sm text-center">
          <div className="text-5xl">{score >= 10 ? '🏆' : score >= 6 ? '🎉' : '💪'}</div>
          <h3 className="text-2xl font-black text-gray-800">All done!</h3>
          <div className="text-5xl font-black" style={{ color: '#58CC02' }}>{score} / {questions.length}</div>
          <div className="text-gray-500 text-sm">{score >= 10 ? 'Brilliant thinking! 🌟' : score >= 6 ? 'Good spotting!' : 'Keep practising — you\'ll get it!'}</div>
          <button onClick={restart} className="btn-duo w-full py-3 rounded-2xl font-black text-white text-lg" style={{ background: '#58CC02', borderBottomColor: '#46A302' }}>Play Again</button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Games Hub
// ─────────────────────────────────────────────

type GameId = 'times' | 'scramble' | 'memory' | 'maths' | 'truefalse' | 'patterns' | 'meanings' | 'oddone';

const GAMES = [
  { id: 'times' as GameId, emoji: '⚡', name: 'Times Table Blitz', desc: 'Answer times tables in 30 seconds!', color: '#6366f1', hasTimer: true },
  { id: 'scramble' as GameId, emoji: '🔤', name: 'Word Scramble', desc: 'Unscramble English words — no timer!', color: '#10b981', hasTimer: false },
  { id: 'memory' as GameId, emoji: '🧠', name: 'Memory Match', desc: 'Flip cards and find all the pairs', color: '#f59e0b', hasTimer: false },
  { id: 'maths' as GameId, emoji: '🚀', name: 'Maths Speed Round', desc: '20 maths questions, 3 seconds each', color: '#ef4444', hasTimer: true },
  { id: 'truefalse' as GameId, emoji: '✅', name: 'True or False', desc: 'Test your general knowledge — no timer!', color: '#8b5cf6', hasTimer: false },
  { id: 'patterns' as GameId, emoji: '🔢', name: 'Number Patterns', desc: 'Find what comes next in the sequence!', color: '#0ea5e9', hasTimer: false },
  { id: 'meanings' as GameId, emoji: '📖', name: 'Word Meanings', desc: 'Match words to their definitions!', color: '#d97706', hasTimer: false },
  { id: 'oddone' as GameId, emoji: '🎯', name: 'Odd One Out', desc: 'Which one doesn\'t belong? Find it!', color: '#dc2626', hasTimer: false },
];

export default function GamesHub() {
  const { setView } = useAppStore();
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  return (
    <div className="min-h-screen" style={{ background: '#F7FFF4' }}>
      {/* Header */}
      <div className="sticky top-0 z-10" style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeGame && (
              <button
                onClick={() => setActiveGame(null)}
                className="text-white/70 hover:text-white font-bold text-sm mr-1"
              >
                ← Games
              </button>
            )}
            <span className="text-2xl">🎮</span>
            <div>
              <div className="font-black text-white text-sm leading-none">Mini Games</div>
              <div className="text-xs text-white/60">Chucky</div>
            </div>
          </div>
          <button
            onClick={() => setView('home')}
            className="text-xs text-white/70 hover:text-white border border-white/30 rounded-full px-3 py-1.5"
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
                  className="card p-6 flex flex-col gap-3"
                >
                  <div className="text-5xl">{game.emoji}</div>
                  <div>
                    <h3 className="font-black text-gray-800 text-lg leading-tight">{game.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{game.desc}</p>
                    <div className="text-xs font-semibold mt-1" style={{ color: game.hasTimer ? '#FF4B4B' : '#58CC02' }}>
                      {game.hasTimer ? '⏱ Has timer' : '🕊 No timer'}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveGame(game.id)}
                    className="btn-duo mt-auto py-2.5 px-5 rounded-2xl font-black text-white text-sm"
                    style={{ background: game.color, filter: 'brightness(1.0)' }}
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
        {activeGame === 'truefalse' && <TrueOrFalse onBack={() => setActiveGame(null)} />}
        {activeGame === 'patterns' && <NumberPatterns onBack={() => setActiveGame(null)} />}
        {activeGame === 'meanings' && <WordMeaning onBack={() => setActiveGame(null)} />}
        {activeGame === 'oddone' && <OddOneOut onBack={() => setActiveGame(null)} />}
      </div>
    </div>
  );
}
