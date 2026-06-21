import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import type { QuizStep as QuizStepType } from '../../data/types';
import { useAppStore } from '../../store/appStore';
import { sounds } from '../../utils/sounds';

function renderMd(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
}

interface Props { step: QuizStepType; onNext: () => void; themeColor: string; themeDark: string; mascot: string; }

export default function QuizStep({ step, onNext, themeColor, themeDark, mascot: _mascot }: Props) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const { recordAnswer, recordScore } = useAppStore();
  const density = useAppStore(s => s.profile?.density ?? 'younger');

  const q = step.questions[current];
  const isCorrect = selected === q.correct;
  const allDone = results.length === step.questions.length;
  const score = results.filter(Boolean).length;

  const confirm = () => {
    if (selected === null) return;
    const correct = selected === q.correct;
    setConfirmed(true);
    recordAnswer(q.id, String(selected));
    recordScore(correct);
    if (correct) { sounds.correct(); } else { sounds.wrong(); }
  };

  const next = () => {
    setResults(r => [...r, isCorrect]);
    if (current < step.questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setConfirmed(false);
    }
  };

  if (allDone) {
    const pct = Math.round((score / step.questions.length) * 100);
    const great = pct >= 80;
    return (
      <div className="flex flex-col min-h-[70vh]">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 gap-6">
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-8xl"
          >
            {great ? '🏆' : '💪'}
          </motion.div>
          <div className="text-center">
            <div className="font-black text-5xl mb-2" style={{ color: themeColor }}>{pct}%</div>
            <p className="text-gray-500 font-bold text-lg">{score} of {step.questions.length} correct</p>
          </div>
          {/* Results dots */}
          <div className="flex gap-2">
            {results.map((r, i) => (
              <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center ${r ? 'bg-green-500' : 'bg-red-400'}`}>
                {r ? <CheckCircle size={16} color="white" /> : <XCircle size={16} color="white" />}
              </div>
            ))}
          </div>
        </div>
        <div className="px-4 pb-8">
          <button
            onClick={onNext}
            className="btn-duo w-full py-4 rounded-2xl text-white font-black text-lg"
            style={{ background: themeColor, borderBottomColor: themeDark }}
          >
            CONTINUE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[85vh]">
      {/* Content */}
      <div className="flex-1 px-4 pt-5 pb-4 space-y-5">
        {/* Step type badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-700 font-black text-xs px-3 py-1.5 rounded-full uppercase tracking-wide">
            ✦ Practice Quiz
          </span>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5">
          {step.questions.map((_, i) => (
            <div
              key={i}
              className="h-2 flex-1 rounded-full transition-all duration-500"
              style={{
                background: i < results.length
                  ? results[i] ? '#58CC02' : '#FF4B4B'
                  : i === current ? themeColor : '#e5e7eb'
              }}
            />
          ))}
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <h2
              className={`font-black text-gray-800 leading-snug ${density === 'younger' ? 'text-2xl' : 'text-xl'}`}
              dangerouslySetInnerHTML={{ __html: renderMd(q.text) }}
            />

            {/* Options */}
            <div className="space-y-3">
              {q.options.map((opt, i) => {
                const isCorrectOpt = confirmed && i === q.correct;
                const isWrongOpt   = confirmed && i === selected && !isCorrect;
                const isOther      = confirmed && i !== q.correct && i !== selected;
                const isChosen     = !confirmed && selected === i;

                let border = '#e5e7eb';
                let bg = '#ffffff';
                let textColor = '#374151';
                let bottomBorder = '#d1d5db';

                if (isChosen)      { border = themeColor; bg = themeColor + '10'; bottomBorder = themeDark; }
                if (isCorrectOpt)  { border = '#58CC02'; bg = '#f0fff4'; bottomBorder = '#46A302'; textColor = '#166534'; }
                if (isWrongOpt)    { border = '#FF4B4B'; bg = '#fff5f5'; bottomBorder = '#D93D3D'; textColor = '#991b1b'; }
                if (isOther)       { border = '#f3f4f6'; bg = '#fafafa'; textColor = '#9ca3af'; }

                return (
                  <motion.button
                    key={i}
                    whileTap={!confirmed ? { scale: 0.98 } : {}}
                    onClick={() => !confirmed && setSelected(i)}
                    className="w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-3 font-semibold"
                    style={{
                      borderColor: border,
                      borderBottomColor: bottomBorder,
                      borderBottomWidth: '3px',
                      background: bg,
                      color: textColor,
                    }}
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
                    <span
                      className={`flex-1 ${density === 'younger' ? 'text-base' : 'text-sm'}`}
                      dangerouslySetInnerHTML={{ __html: renderMd(opt) }}
                    />
                    {isCorrectOpt && <CheckCircle size={20} color="#58CC02" />}
                    {isWrongOpt   && <XCircle    size={20} color="#FF4B4B" />}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── FEEDBACK PANEL + BOTTOM BUTTON (Duolingo-style) ── */}
      <AnimatePresence>
        {confirmed && (
          <motion.div
            key="feedback"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="px-4 pt-4 pb-2 rounded-t-3xl border-t-2"
            style={{
              background: isCorrect ? '#f0fff4' : '#fff5f5',
              borderColor: isCorrect ? '#86efac' : '#fca5a5',
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              {isCorrect
                ? <CheckCircle size={22} color="#22c55e" />
                : <XCircle    size={22} color="#ef4444" />
              }
              <span className={`font-black text-lg ${isCorrect ? 'text-green-700' : 'text-red-600'}`}>
                {isCorrect ? 'Correct!' : 'Not quite!'}
              </span>
            </div>
            <p
              className="text-sm font-medium mb-4"
              style={{ color: isCorrect ? '#166534' : '#991b1b' }}
              dangerouslySetInnerHTML={{ __html: renderMd(q.explanation) }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 pb-8 pt-2 bg-white">
        {!confirmed ? (
          <button
            onClick={confirm}
            disabled={selected === null}
            className="btn-duo w-full py-4 rounded-2xl font-black text-base uppercase tracking-wide transition-all"
            style={selected !== null
              ? { background: themeColor, borderBottomColor: themeDark, color: 'white' }
              : { background: '#e5e7eb', borderBottomColor: '#d1d5db', color: '#9ca3af' }
            }
          >
            CHECK
          </button>
        ) : (
          <button
            onClick={next}
            className="btn-duo w-full py-4 rounded-2xl font-black text-base uppercase tracking-wide text-white"
            style={{ background: isCorrect ? '#58CC02' : '#FF4B4B', borderBottomColor: isCorrect ? '#46A302' : '#D93D3D' }}
          >
            {current < step.questions.length - 1 ? 'CONTINUE' : 'SEE RESULTS'}
          </button>
        )}
      </div>
    </div>
  );
}
