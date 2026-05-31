import { useState } from 'react';
import { motion } from 'framer-motion';
import type { VideoStep as VideoStepType } from '../../data/types';
import { useAppStore } from '../../store/appStore';

function renderMarkdown(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

interface Props { step: VideoStepType; onNext: () => void; themeColor: string; mascot: string; }

export default function VideoStep({ step, onNext, themeColor, mascot }: Props) {
  const [watched, setWatched] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const profile = useAppStore(s => s.profile);
  const density = profile?.density ?? 'younger';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm" style={{ background: themeColor }}>
          ▶
        </div>
        <div>
          <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Video Lesson · {step.duration}</div>
          <h2 className="font-black text-gray-800 text-xl">{step.title}</h2>
        </div>
      </div>

      {/* Description */}
      <p className={`text-gray-600 ${density === 'younger' ? 'text-lg' : 'text-base'}`}>{step.description}</p>

      {/* Video embed */}
      <div className="rounded-2xl overflow-hidden shadow-lg bg-black aspect-video relative">
        <iframe
          src={`https://www.youtube.com/embed/${step.youtubeId}?rel=0&modestbranding=1`}
          title={step.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          onLoad={() => {}}
        />
      </div>

      {/* Key points */}
      <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
        <div className="font-bold text-indigo-800 mb-3">📌 Key things to remember:</div>
        <ul className="space-y-2">
          {step.keyPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-indigo-700">
              <span className="mt-0.5">✦</span>
              <span
                className={density === 'younger' ? 'text-base' : 'text-sm'}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(point) }}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Mascot prompt */}
      <div className="flex items-start gap-3 bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
        <span className="text-3xl">{mascot}</span>
        <div className="text-yellow-800 text-sm font-medium">
          {density === 'younger'
            ? "Watched the video? Tick the box below and we'll move on!"
            : "Once you've watched the video and feel confident about the key points, you're ready to continue."}
        </div>
      </div>

      {/* Teacher note toggle */}
      <button
        onClick={() => setShowNote(v => !v)}
        className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
      >
        👩‍🏫 Teacher note {showNote ? '▲' : '▼'}
      </button>
      {showNote && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
          {step.teacherNote}
        </div>
      )}

      {/* Watched checkbox + continue */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="watched"
          checked={watched}
          onChange={e => setWatched(e.target.checked)}
          className="w-5 h-5 rounded"
        />
        <label htmlFor="watched" className="text-gray-700 font-medium cursor-pointer select-none">
          I've watched the video ✅
        </label>
      </div>

      <motion.button
        whileHover={watched ? { scale: 1.03 } : {}}
        whileTap={watched ? { scale: 0.97 } : {}}
        onClick={() => watched && onNext()}
        disabled={!watched}
        className="w-full py-4 rounded-2xl text-white font-black text-lg transition-all disabled:opacity-30"
        style={{ background: themeColor }}
      >
        Continue →
      </motion.button>
    </motion.div>
  );
}
