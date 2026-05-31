import { useState } from 'react';
import { motion } from 'framer-motion';
import type { FreeResponseStep as FreeResponseStepType } from '../../data/types';
import { useAppStore } from '../../store/appStore';

interface Props { step: FreeResponseStepType; onNext: () => void; themeColor: string; mascot: string; }

export default function FreeResponseStep({ step, onNext, themeColor, mascot }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const { recordAnswer } = useAppStore();
  const density = useAppStore(s => s.profile?.density ?? 'younger');

  const filled = step.fields.every(f => (answers[f.id] ?? '').trim().length > 0);

  const submit = () => {
    step.fields.forEach(f => recordAnswer(f.id, answers[f.id] ?? ''));
    setSubmitted(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm" style={{ background: themeColor }}>
          ✏️
        </div>
        <div>
          <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Your Turn</div>
          <h2 className="font-black text-gray-800 text-xl">{step.title}</h2>
        </div>
      </div>

      {/* Prompt */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
        <p
          className={`text-indigo-800 font-medium whitespace-pre-line ${density === 'younger' ? 'text-base' : 'text-sm'}`}
        >
          {step.prompt}
        </p>
      </div>

      {/* Mascot */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">{mascot}</span>
        <span className="text-sm text-gray-500">
          {density === 'younger'
            ? "Take your time! There's no wrong answer here — just try your best."
            : "Write in full sentences where possible. Use evidence from the lesson."}
        </span>
      </div>

      {/* Fields */}
      <div className="space-y-5">
        {step.fields.map(field => (
          <div key={field.id} className="space-y-2">
            <label className={`block font-semibold text-gray-700 ${density === 'younger' ? 'text-base' : 'text-sm'}`}>
              {field.label}
            </label>
            {field.multiline ? (
              <textarea
                value={answers[field.id] ?? ''}
                onChange={e => setAnswers(a => ({ ...a, [field.id]: e.target.value }))}
                placeholder={field.placeholder}
                rows={field.minRows ?? 5}
                disabled={submitted}
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-gray-700 focus:outline-none focus:border-indigo-400 transition-colors resize-y disabled:bg-gray-50 disabled:text-gray-500"
                style={{ fontSize: density === 'younger' ? '16px' : '14px', lineHeight: '1.7' }}
              />
            ) : (
              <textarea
                value={answers[field.id] ?? ''}
                onChange={e => setAnswers(a => ({ ...a, [field.id]: e.target.value }))}
                placeholder={field.placeholder}
                rows={3}
                disabled={submitted}
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-gray-700 focus:outline-none focus:border-indigo-400 transition-colors resize-y disabled:bg-gray-50 disabled:text-gray-500"
                style={{ fontSize: density === 'younger' ? '16px' : '14px', lineHeight: '1.7' }}
              />
            )}
            {(answers[field.id] ?? '').length > 0 && !submitted && (
              <div className="text-xs text-gray-400 text-right">
                {(answers[field.id] ?? '').split(/\s+/).filter(Boolean).length} words
              </div>
            )}
          </div>
        ))}
      </div>

      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center space-y-3"
        >
          <div className="text-4xl">🎉</div>
          <p className="font-bold text-green-700 text-lg">Brilliant work, saved!</p>
          <p className="text-green-600 text-sm">Your teacher can see your answers. Keep up the great effort!</p>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={onNext}
            className="w-full py-3 rounded-2xl text-white font-black text-lg"
            style={{ background: themeColor }}
          >
            Continue →
          </motion.button>
        </motion.div>
      ) : (
        <>
          <button onClick={() => setShowNote(v => !v)} className="text-xs text-gray-400 hover:text-gray-600 underline">
            👩‍🏫 Teacher note {showNote ? '▲' : '▼'}
          </button>
          {showNote && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">{step.teacherNote}</div>
          )}
          <motion.button
            whileHover={filled ? { scale: 1.03 } : {}}
            whileTap={filled ? { scale: 0.97 } : {}}
            onClick={submit}
            disabled={!filled}
            className="w-full py-4 rounded-2xl text-white font-black text-lg disabled:opacity-30"
            style={{ background: themeColor }}
          >
            {filled ? 'Submit My Answers ✓' : 'Fill in all boxes to continue'}
          </motion.button>
        </>
      )}
    </motion.div>
  );
}
