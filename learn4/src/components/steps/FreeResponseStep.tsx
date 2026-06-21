import { useState } from 'react';
import { motion } from 'framer-motion';
import { PenLine, CheckCircle } from 'lucide-react';
import type { FreeResponseStep as FreeResponseStepType } from '../../data/types';
import { useAppStore } from '../../store/appStore';

interface Props { step: FreeResponseStepType; onNext: () => void; themeColor: string; themeDark: string; mascot: string; }

export default function FreeResponseStep({ step, onNext, themeColor, themeDark, mascot }: Props) {
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
    <div className="flex flex-col min-h-[85vh]">
      <div className="flex-1 px-4 pt-5 pb-4 space-y-5">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 font-black text-xs px-3 py-1.5 rounded-full uppercase tracking-wide">
          <PenLine size={11} /> Your Turn
        </span>

        <h2 className={`font-black text-gray-800 leading-snug ${density === 'younger' ? 'text-2xl' : 'text-xl'}`}>
          {step.title}
        </h2>

        {/* Prompt */}
        <div className="rounded-2xl p-4 border-2" style={{ background: '#eff6ff', borderColor: '#93c5fd' }}>
          <p className={`text-blue-800 font-medium whitespace-pre-line ${density === 'younger' ? 'text-base' : 'text-sm'}`}>
            {step.prompt}
          </p>
        </div>

        {/* Mascot */}
        <div className="flex items-center gap-3 rounded-2xl p-4" style={{ background: '#fffbeb', border: '2px solid #fde68a' }}>
          <span className="text-2xl">{mascot === 'owl' ? '🦉' : mascot === 'fox' ? '🦊' : '🐼'}</span>
          <p className="text-yellow-800 text-sm font-medium">
            {density === 'younger'
              ? "Take your time! There's no wrong answer — just try your best."
              : "Write in full sentences where possible. Use evidence from the lesson."}
          </p>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl p-6 text-center space-y-3 border-2 border-green-200 bg-green-50"
          >
            <CheckCircle size={40} color="#22c55e" className="mx-auto" />
            <p className="font-black text-green-700 text-xl">Brilliant work!</p>
            <p className="text-green-600 text-sm font-medium">Your teacher can see your answers. Keep it up!</p>
          </motion.div>
        ) : (
          <div className="space-y-5">
            {step.fields.map(field => (
              <div key={field.id} className="space-y-2">
                <label className={`block font-black text-gray-700 ${density === 'younger' ? 'text-base' : 'text-sm'}`}>
                  {field.label}
                </label>
                <textarea
                  value={answers[field.id] ?? ''}
                  onChange={e => setAnswers(a => ({ ...a, [field.id]: e.target.value }))}
                  placeholder={field.placeholder}
                  rows={field.multiline ? (field.minRows ?? 5) : 3}
                  className="w-full rounded-2xl border-2 px-4 py-3 text-gray-700 resize-y transition-all outline-none"
                  style={{
                    fontSize: density === 'younger' ? '16px' : '14px',
                    lineHeight: '1.7',
                    borderColor: (answers[field.id] ?? '').length > 0 ? themeColor : '#e5e7eb',
                    borderBottomColor: (answers[field.id] ?? '').length > 0 ? themeDark : '#d1d5db',
                    borderBottomWidth: '3px',
                  }}
                  onFocus={e => { e.target.style.borderColor = themeColor; e.target.style.boxShadow = `0 0 0 3px ${themeColor}20`; }}
                  onBlur={e => { e.target.style.boxShadow = 'none'; }}
                />
                {(answers[field.id] ?? '').length > 0 && (
                  <div className="text-xs text-gray-400 text-right font-medium">
                    {(answers[field.id] ?? '').split(/\s+/).filter(Boolean).length} words
                  </div>
                )}
              </div>
            ))}

            <button onClick={() => setShowNote(v => !v)} className="text-xs text-gray-400 underline">
              Teacher note {showNote ? '▲' : '▼'}
            </button>
            {showNote && (
              <div className="rounded-2xl p-4 text-sm text-yellow-800" style={{ background: '#fffbeb', border: '2px solid #fde68a' }}>
                {step.teacherNote}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom button */}
      <div className="px-4 pb-8 pt-2">
        {submitted ? (
          <button
            onClick={onNext}
            className="btn-duo w-full py-4 rounded-2xl font-black text-base uppercase tracking-wide text-white"
            style={{ background: '#58CC02', borderBottomColor: '#46A302' }}
          >
            CONTINUE
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={!filled}
            className="btn-duo w-full py-4 rounded-2xl font-black text-base uppercase tracking-wide transition-all"
            style={filled
              ? { background: themeColor, borderBottomColor: themeDark, color: 'white' }
              : { background: '#e5e7eb', borderBottomColor: '#d1d5db', color: '#9ca3af' }
            }
          >
            {filled ? 'SUBMIT' : 'Fill in all fields to continue'}
          </button>
        )}
      </div>
    </div>
  );
}
