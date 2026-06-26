import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { allSessions } from '../data/curriculum/index';
import type { QuizQuestion } from '../data/types';

const THEME_COLOR = { purple: '#A855F7', blue: '#1CB0F6', green: '#58CC02', orange: '#F97316' };
const THEME_DARK  = { purple: '#7C3AED', blue: '#0E8FC4', green: '#46A302', orange: '#EA580C' };

const SUBJECT_COLOR: Record<string, string> = {
  english: '#A855F7', maths: '#58CC02', science: '#1CB0F6', hass: '#FFC800', vcd: '#F97316',
};

function renderMd(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type SubjectFilter = 'all' | 'english' | 'maths' | 'science' | 'hass' | 'vcd';
type YearFilter = 'all' | 4 | 5 | 6 | 8 | 9 | 10 | 11;
const SET_SIZES = [10, 15, 20] as const;

interface EnrichedQuestion extends QuizQuestion {
  subject: string;
  yearLevel: number;
  sessionId: string;
  sessionTitle: string;
}

export default function RevisionMode() {
  const { profile, setView, addStars } = useAppStore();
  const density = useAppStore(s => s.profile?.density ?? 'younger');
  if (!profile) return null;

  const themeColor = THEME_COLOR[profile.colorTheme];
  const themeDark = THEME_DARK[profile.colorTheme];

  // Filters
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>('all');
  const [yearFilter, setYearFilter] = useState<YearFilter>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [setSize, setSetSize] = useState<10 | 15 | 20>(10);

  // Session state
  const [started, setStarted] = useState(false);
  const [pool, setPool] = useState<EnrichedQuestion[]>([]);
  const [currentSet, setCurrentSet] = useState<EnrichedQuestion[]>([]);
  const [posInSet, setPosInSet] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [setResults, setSetResults] = useState<boolean[]>([]);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [setNumber, setSetNumber] = useState(1);
  const [showScore, setShowScore] = useState(false);

  const allQuestions: EnrichedQuestion[] = useMemo(() => {
    const qs: EnrichedQuestion[] = [];
    for (const session of allSessions) {
      for (const step of session.steps) {
        if (step.type === 'quiz') {
          for (const q of step.questions) {
            qs.push({ ...q, subject: session.subject, yearLevel: session.yearLevel, sessionId: session.id, sessionTitle: session.title });
          }
        }
      }
    }
    return qs;
  }, []);

  // All sessions matching subject+year filters (for topic picker)
  const filteredSessions = useMemo(() => {
    const seen = new Set<string>();
    const sessions: { id: string; title: string; subject: string }[] = [];
    for (const q of allQuestions) {
      const subjectMatch = subjectFilter === 'all' || q.subject === subjectFilter;
      const yearMatch = yearFilter === 'all' || q.yearLevel === yearFilter;
      if (subjectMatch && yearMatch && !seen.has(q.sessionId)) {
        seen.add(q.sessionId);
        sessions.push({ id: q.sessionId, title: q.sessionTitle, subject: q.subject });
      }
    }
    return sessions;
  }, [allQuestions, subjectFilter, yearFilter]);

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter(q => {
      const subjectMatch = subjectFilter === 'all' || q.subject === subjectFilter;
      const yearMatch = yearFilter === 'all' || q.yearLevel === yearFilter;
      const topicMatch = topicFilter === 'all' || q.sessionId === topicFilter;
      return subjectMatch && yearMatch && topicMatch;
    });
  }, [allQuestions, subjectFilter, yearFilter, topicFilter]);

  // Reset topic when subject/year changes
  const handleSubjectChange = (s: SubjectFilter) => { setSubjectFilter(s); setTopicFilter('all'); };
  const handleYearChange = (y: YearFilter) => { setYearFilter(y); setTopicFilter('all'); };

  function buildSet(questionPool: EnrichedQuestion[]): EnrichedQuestion[] {
    if (questionPool.length === 0) return [];
    // If pool smaller than setSize, repeat with reshuffles
    let combined: EnrichedQuestion[] = [];
    while (combined.length < setSize) {
      combined = [...combined, ...shuffle(questionPool)];
    }
    return combined.slice(0, setSize);
  }

  const handleStart = () => {
    const shuffled = shuffle(filteredQuestions);
    setPool(shuffled);
    const firstSet = buildSet(shuffled);
    setCurrentSet(firstSet);
    setPosInSet(0);
    setSelected(null);
    setConfirmed(false);
    setSetResults([]);
    setTotalCorrect(0);
    setTotalAnswered(0);
    setSetNumber(1);
    setShowScore(false);
    setStarted(true);
  };

  const q = currentSet[posInSet];
  const isCorrect = q ? selected === q.correct : false;

  const handleConfirm = () => {
    if (selected === null) return;
    setConfirmed(true);
  };

  const handleNext = () => {
    if (isCorrect) addStars(1);
    const newSetResults = [...setResults, isCorrect];
    setSetResults(newSetResults);
    setTotalCorrect(c => c + (isCorrect ? 1 : 0));
    setTotalAnswered(a => a + 1);

    if (posInSet < setSize - 1) {
      setPosInSet(p => p + 1);
      setSelected(null);
      setConfirmed(false);
    } else {
      setShowScore(true);
    }
  };

  const handleNextSet = () => {
    const nextSet = buildSet(pool.length > 0 ? pool : filteredQuestions);
    setCurrentSet(nextSet);
    setPosInSet(0);
    setSelected(null);
    setConfirmed(false);
    setSetResults([]);
    setSetNumber(n => n + 1);
    setShowScore(false);
  };

  // Score screen
  if (showScore) {
    const correct = setResults.filter(Boolean).length;
    const pct = Math.round((correct / setSize) * 100);
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#F7FFF4' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 shadow-xl max-w-sm w-full text-center space-y-4"
        >
          <div className="text-5xl">{pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '💪'}</div>
          <h2 className="font-black text-gray-800 text-2xl">
            {pct >= 80 ? 'Brilliant!' : pct >= 60 ? 'Good effort!' : 'Keep going!'}
          </h2>
          <div className="text-6xl font-black" style={{ color: themeColor }}>{pct}%</div>

          {/* Dot results */}
          <div className="flex gap-1.5 justify-center flex-wrap">
            {setResults.map((r, i) => (
              <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center ${r ? 'bg-green-500' : 'bg-red-400'}`}>
                {r ? <CheckCircle size={14} color="white" /> : <XCircle size={14} color="white" />}
              </div>
            ))}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-2 text-yellow-700 font-black">
            ⭐ +{correct} stars this set!
          </div>
          <p className="text-xs text-gray-400">
            Set {setNumber} · Overall: {totalCorrect + (isCorrect ? 0 : 0)} of {totalAnswered} correct
          </p>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleNextSet}
              className="btn-duo w-full py-3 rounded-2xl font-black text-white"
              style={{ background: themeColor, borderBottomColor: themeDark }}
            >
              Next Set →
            </button>
            <button
              onClick={() => { setStarted(false); setShowScore(false); }}
              className="w-full py-3 rounded-2xl font-bold text-gray-500 bg-gray-100"
            >
              Change Filters
            </button>
            <button onClick={() => setView('home')} className="w-full py-3 rounded-2xl font-bold text-gray-400 text-sm">
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Setup screen
  if (!started) {
    return (
      <div className="min-h-screen" style={{ background: '#F7FFF4' }}>
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('home')}
              className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500"
            >
              ←
            </button>
            <div>
              <h1 className="font-black text-gray-800 text-2xl">Revision Mode</h1>
              <p className="text-sm text-gray-400">Infinite practice — targeted by topic</p>
            </div>
          </div>

          <div className="card p-5 space-y-5">
            {/* Subject filter */}
            <div>
              <div className="text-xs font-black text-gray-500 uppercase tracking-wide mb-2">Subject</div>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'english', 'maths', 'science', 'hass', 'vcd'] as SubjectFilter[]).map(s => (
                  <button
                    key={s}
                    onClick={() => handleSubjectChange(s)}
                    className="btn-duo py-2 px-3 rounded-xl font-black text-sm"
                    style={subjectFilter === s
                      ? { background: s !== 'all' ? SUBJECT_COLOR[s] : themeColor, color: 'white', borderBottomColor: themeDark }
                      : { background: '#f3f4f6', color: '#6b7280', borderBottomColor: '#d1d5db' }}
                  >
                    {s === 'all' ? 'All' : s === 'hass' ? 'HASS' : s === 'vcd' ? 'VCD' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Year filter */}
            <div>
              <div className="text-xs font-black text-gray-500 uppercase tracking-wide mb-2">Year Level</div>
              <div className="flex gap-2 flex-wrap">
                {(['all', 4, 5, 6, 8, 9, 10, 11] as YearFilter[]).map(y => (
                  <button
                    key={y}
                    onClick={() => handleYearChange(y)}
                    className="btn-duo py-2 px-3 rounded-xl font-black text-sm"
                    style={yearFilter === y
                      ? { background: themeColor, color: 'white', borderBottomColor: themeDark }
                      : { background: '#f3f4f6', color: '#6b7280', borderBottomColor: '#d1d5db' }}
                  >
                    {y === 'all' ? 'All Years' : y === 11 ? 'VCE' : `Year ${y}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic filter */}
            {filteredSessions.length > 0 && (
              <div>
                <div className="text-xs font-black text-gray-500 uppercase tracking-wide mb-2">Topic</div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  <button
                    onClick={() => setTopicFilter('all')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-all ${topicFilter === 'all' ? 'text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                    style={topicFilter === 'all' ? { background: themeColor } : {}}
                  >
                    All Topics ({filteredQuestions.length} Qs)
                  </button>
                  {filteredSessions.map(session => {
                    const count = allQuestions.filter(q => q.sessionId === session.id).length;
                    const isActive = topicFilter === session.id;
                    return (
                      <button
                        key={session.id}
                        onClick={() => setTopicFilter(session.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-between gap-2 ${isActive ? 'text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                        style={isActive ? { background: SUBJECT_COLOR[session.subject] ?? themeColor } : {}}
                      >
                        <span className="truncate">{session.title}</span>
                        <span className={`flex-shrink-0 text-xs font-black px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-500'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Set size */}
            <div>
              <div className="text-xs font-black text-gray-500 uppercase tracking-wide mb-2">Questions per Set</div>
              <div className="flex gap-3">
                {SET_SIZES.map(n => (
                  <button
                    key={n}
                    onClick={() => setSetSize(n)}
                    className="btn-duo flex-1 py-3 rounded-2xl font-black text-lg"
                    style={setSize === n
                      ? { background: themeColor, color: 'white', borderBottomColor: themeDark }
                      : { background: '#f3f4f6', color: '#6b7280', borderBottomColor: '#d1d5db' }}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1.5 text-center">Score shown after each set · keeps going forever ♾️</p>
            </div>

            {/* Q count badge */}
            <div className="rounded-2xl p-3 text-center" style={{ background: themeColor + '12' }}>
              <span className="font-black text-2xl" style={{ color: themeColor }}>{filteredQuestions.length}</span>
              <span className="text-sm font-semibold text-gray-500 ml-2">unique questions in pool</span>
            </div>

            <button
              onClick={handleStart}
              disabled={filteredQuestions.length === 0}
              className="btn-duo w-full py-4 rounded-2xl text-white font-black text-lg uppercase tracking-wide disabled:opacity-30"
              style={{ background: themeColor, borderBottomColor: themeDark }}
            >
              START {setSize} QUESTIONS →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Question screen
  const posInSetDisplay = posInSet + 1;
  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#F7FFF4' }}>
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => { setStarted(false); setShowScore(false); }}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 font-bold"
          >
            ←
          </button>
          <div className="text-center">
            <div className="font-black text-gray-800 text-sm">Set {setNumber} · Q {posInSetDisplay}/{setSize}</div>
            <div className="text-xs text-gray-400">
              {topicFilter === 'all'
                ? `${subjectFilter === 'all' ? 'All subjects' : subjectFilter}`
                : currentSet[posInSet]?.sessionTitle ?? ''}
            </div>
          </div>
          <div className="bg-white rounded-full px-3 py-1.5 shadow-sm text-sm font-black" style={{ color: '#FFC800' }}>
            ⭐ {totalCorrect + setResults.filter(Boolean).length}
          </div>
        </div>

        {/* Progress dots for this set */}
        <div className="flex gap-1">
          {Array.from({ length: setSize }).map((_, i) => (
            <div
              key={i}
              className="h-2 flex-1 rounded-full transition-all duration-300"
              style={{
                background: i < setResults.length
                  ? (setResults[i] ? '#58CC02' : '#FF4B4B')
                  : i === posInSet ? themeColor : '#e5e7eb',
              }}
            />
          ))}
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={posInSet + '-' + setNumber}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-3"
          >
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-black px-2 py-0.5 rounded-full text-white capitalize" style={{ background: SUBJECT_COLOR[q?.subject] ?? themeColor }}>
                  {q?.subject}
                </span>
                <span className="text-xs text-gray-400">Year {q?.yearLevel}</span>
                <span className="text-xs text-gray-300">·</span>
                <span className="text-xs text-gray-400 truncate max-w-[140px]">{q?.sessionTitle}</span>
              </div>
              <p
                className={`font-semibold text-gray-800 ${density === 'younger' ? 'text-lg' : 'text-base'}`}
                dangerouslySetInnerHTML={{ __html: renderMd(q?.text ?? '') }}
              />
            </div>

            {/* Options */}
            <div className="space-y-2">
              {q?.options.map((opt, i) => {
                const isCorrectOpt = confirmed && i === q.correct;
                const isWrongOpt   = confirmed && i === selected && !isCorrect;
                const isOther      = confirmed && i !== q.correct && i !== selected;
                const isChosen     = !confirmed && selected === i;

                let border = '#e5e7eb', bg = '#ffffff', textColor = '#374151', bottomBorder = '#d1d5db';
                if (isChosen)     { border = themeColor; bg = themeColor + '10'; bottomBorder = themeDark; }
                if (isCorrectOpt) { border = '#58CC02'; bg = '#f0fff4'; bottomBorder = '#46A302'; textColor = '#166534'; }
                if (isWrongOpt)   { border = '#FF4B4B'; bg = '#fff5f5'; bottomBorder = '#D93D3D'; textColor = '#991b1b'; }
                if (isOther)      { border = '#f3f4f6'; bg = '#fafafa'; textColor = '#9ca3af'; }

                return (
                  <motion.button
                    key={i}
                    whileTap={!confirmed ? { scale: 0.98 } : {}}
                    onClick={() => !confirmed && setSelected(i)}
                    className="w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-3 font-semibold"
                    style={{ borderColor: border, borderBottomColor: bottomBorder, borderBottomWidth: '3px', background: bg, color: textColor }}
                  >
                    <span
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0"
                      style={{
                        background: isChosen ? themeColor : isCorrectOpt ? '#58CC02' : isWrongOpt ? '#FF4B4B' : '#f3f4f6',
                        color: (isChosen || isCorrectOpt || isWrongOpt) ? 'white' : '#6b7280',
                      }}
                    >
                      {['A','B','C','D'][i]}
                    </span>
                    <span className={`flex-1 ${density === 'younger' ? 'text-base' : 'text-sm'}`} dangerouslySetInnerHTML={{ __html: renderMd(opt) }} />
                    {isCorrectOpt && <CheckCircle size={18} color="#58CC02" />}
                    {isWrongOpt   && <XCircle    size={18} color="#FF4B4B" />}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation panel */}
            <AnimatePresence>
              {confirmed && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-4 border-2"
                  style={{ background: isCorrect ? '#f0fff4' : '#fff5f5', borderColor: isCorrect ? '#86efac' : '#fca5a5' }}
                >
                  <div className={`flex items-center gap-2 font-black mb-1 ${isCorrect ? 'text-green-700' : 'text-red-600'}`}>
                    {isCorrect ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    {isCorrect ? 'Correct!' : 'Not quite!'}
                  </div>
                  <p
                    className={`${density === 'younger' ? 'text-sm' : 'text-xs'} font-medium`}
                    style={{ color: isCorrect ? '#166534' : '#991b1b' }}
                    dangerouslySetInnerHTML={{ __html: renderMd(q?.explanation ?? '') }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sticky bottom button */}
      <div className="px-4 pb-8 pt-2 max-w-2xl mx-auto w-full">
        {!confirmed ? (
          <button
            onClick={handleConfirm}
            disabled={selected === null}
            className="btn-duo w-full py-4 rounded-2xl font-black text-base uppercase tracking-wide"
            style={selected !== null
              ? { background: themeColor, borderBottomColor: themeDark, color: 'white' }
              : { background: '#e5e7eb', borderBottomColor: '#d1d5db', color: '#9ca3af' }
            }
          >
            CHECK
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="btn-duo w-full py-4 rounded-2xl font-black text-base uppercase tracking-wide text-white"
            style={{ background: isCorrect ? '#58CC02' : '#FF4B4B', borderBottomColor: isCorrect ? '#46A302' : '#D93D3D' }}
          >
            {posInSet < setSize - 1 ? 'NEXT QUESTION →' : 'SEE RESULTS'}
          </button>
        )}
      </div>
    </div>
  );
}
