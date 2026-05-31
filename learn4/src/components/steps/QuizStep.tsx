import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { QuizStep as QuizStepType } from '../../data/types';
import { useAppStore } from '../../store/appStore';

function renderMd(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
}

interface Props { step: QuizStepType; onNext: () => void; themeColor: string; mascot: string; }

export default function QuizStep({ step, onNext, themeColor, mascot }: Props) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [showNote, setShowNote] = useState(false);
  const { recordAnswer, recordScore } = useAppStore();
  const density = useAppStore(s => s.profile?.density ?? 'younger');

  const q = step.questions[current];
  const isCorrect = selected === q.correct;
  const allDone = results.length === step.questions.length;

  const confirm = () => {
    if (selected === null) return;
    const correct = selected === q.correct;
    setConfirmed(true);
    recordAnswer(q.id, String(selected));
    recordScore(correct);
  };

  const next = () => {
    setResults(r => [...r, isCorrect]);
    if (current < step.questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setConfirmed(false);
    }
  };

  const score = results.filter(Boolean).length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm" style={{ background: themeColor }}>
          ❓
        </div>
        <div>
          <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Practice Questions</div>
          <h2 className="font-black text-gray-800 text-xl">{step.title}</h2>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2">
        {step.questions.map((_, i) => (
          <div
            key={i}
            className="h-2 flex-1 rounded-full transition-all duration-500"
            style={{
              background: i < results.length
                ? results[i] ? '#10b981' : '#ef4444'
                : i === current ? themeColor : '#e5e7eb'
            }}
          />
        ))}
      </div>

      {/* All done — summary */}
      {allDone ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4 py-6">
          <div className="text-6xl">{score === step.questions.length ? '🏆' : score >= step.questions.length / 2 ? '⭐' : '💪'}</div>
          <h3 className="text-2xl font-black text-gray-800">
            {score}/{step.questions.length} correct!
          </h3>
          <p className="text-gray-500">
            {score === step.questions.length
              ? "Perfect score! You really know this stuff!"
              : score >= step.questions.length * 0.7
              ? "Great work! Keep it up!"
              : "Good try! Review the explanations and you'll get it next time."}
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={onNext}
            className="w-full py-4 rounded-2xl text-white font-black text-lg"
            style={{ background: themeColor }}
          >
            Continue →
          </motion.button>
        </motion.div>
      ) : (
        <>
          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="text-xs text-gray-400 font-semibold mb-2">Question {current + 1} of {step.questions.length}</div>
                <p
                  className={`font-semibold text-gray-800 ${density === 'younger' ? 'text-lg' : 'text-base'}`}
                  dangerouslySetInnerHTML={{ __html: renderMd(q.text) }}
                />
              </div>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((opt, i) => {
                  let style = 'border-gray-200 bg-white hover:border-gray-300';
                  if (confirmed) {
                    if (i === q.correct) style = 'border-green-400 bg-green-50';
                    else if (i === selected && !isCorrect) style = 'border-red-400 bg-red-50';
                    else style = 'border-gray-100 bg-gray-50 opacity-50';
                  } else if (selected === i) {
                    style = 'border-indigo-400 bg-indigo-50';
                  }

                  return (
                    <motion.button
                      key={i}
                      whileHover={!confirmed ? { scale: 1.01 } : {}}
                      whileTap={!confirmed ? { scale: 0.99 } : {}}
                      onClick={() => !confirmed && setSelected(i)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all font-medium ${style}`}
                    >
                      <span className="text-gray-500 font-bold mr-2">{['A', 'B', 'C', 'D'][i]}.</span>
                      <span className={density === 'younger' ? 'text-base' : 'text-sm'} dangerouslySetInnerHTML={{ __html: renderMd(opt) }} />
                      {confirmed && i === q.correct && <span className="ml-2 text-green-600">✓</span>}
                      {confirmed && i === selected && !isCorrect && <span className="ml-2 text-red-500">✗</span>}
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {confirmed && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl p-4 border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}
                  >
                    <div className={`font-bold mb-1 ${isCorrect ? 'text-green-700' : 'text-blue-700'}`}>
                      {isCorrect ? '🎉 Correct!' : '💡 Here\'s the explanation:'}
                    </div>
                    <p
                      className={`${isCorrect ? 'text-green-700' : 'text-blue-700'} ${density === 'younger' ? 'text-sm' : 'text-xs'}`}
                      dangerouslySetInnerHTML={{ __html: renderMd(q.explanation) }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mascot */}
              {!confirmed && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="text-2xl">{mascot}</span>
                  <span>{density === 'younger' ? "Pick one answer, then check it!" : "Choose the best answer."}</span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Action buttons */}
          {!confirmed ? (
            <motion.button
              whileHover={selected !== null ? { scale: 1.03 } : {}}
              whileTap={selected !== null ? { scale: 0.97 } : {}}
              onClick={confirm}
              disabled={selected === null}
              className="w-full py-4 rounded-2xl text-white font-black text-lg disabled:opacity-30"
              style={{ background: themeColor }}
            >
              Check Answer
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={next}
              className="w-full py-4 rounded-2xl text-white font-black text-lg"
              style={{ background: themeColor }}
            >
              {current < step.questions.length - 1 ? 'Next Question →' : 'See Results →'}
            </motion.button>
          )}
        </>
      )}

      <button onClick={() => setShowNote(v => !v)} className="text-xs text-gray-400 hover:text-gray-600 underline">
        👩‍🏫 Teacher note {showNote ? '▲' : '▼'}
      </button>
      {showNote && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">{step.teacherNote}</div>
      )}
    </motion.div>
  );
}
