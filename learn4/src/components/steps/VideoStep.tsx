import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle } from 'lucide-react';
import type { VideoStep as VideoStepType } from '../../data/types';
import { useAppStore } from '../../store/appStore';

function renderMarkdown(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

interface Props { step: VideoStepType; onNext: () => void; themeColor: string; themeDark: string; mascot: string; }

export default function VideoStep({ step, onNext, themeColor, themeDark, mascot }: Props) {
  const [watched, setWatched] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const density = useAppStore(s => s.profile?.density ?? 'younger');

  return (
    <div className="flex flex-col min-h-[85vh]">
      <div className="flex-1 px-4 pt-5 pb-4 space-y-5">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 font-black text-xs px-3 py-1.5 rounded-full uppercase tracking-wide">
          <Play size={11} fill="currentColor" /> Video Lesson
        </span>

        <h2 className={`font-black text-gray-800 leading-snug ${density === 'younger' ? 'text-2xl' : 'text-xl'}`}>
          {step.title}
        </h2>

        <p className={`text-gray-500 font-medium ${density === 'younger' ? 'text-base' : 'text-sm'}`}>
          {step.description}
        </p>

        {/* Video */}
        {step.youtubeId ? (
          <div className="rounded-2xl overflow-hidden shadow-lg bg-black aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${step.youtubeId}?rel=0&modestbranding=1`}
              title={step.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden bg-gray-900 aspect-video flex flex-col items-center justify-center gap-4">
            <div className="text-5xl">🎬</div>
            <p className="text-gray-300 text-sm text-center px-6">Find a video on this topic below.</p>
            {step.youtubeSearchQuery && (
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(step.youtubeSearchQuery)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors"
              >
                <Play size={14} fill="white" /> Search YouTube
              </a>
            )}
          </div>
        )}

        {/* Key points */}
        <div className="card p-4 space-y-3" style={{ borderLeftWidth: '4px', borderLeftColor: themeColor }}>
          <div className="font-black text-gray-700 text-sm uppercase tracking-wide">Key points</div>
          <ul className="space-y-2">
            {step.keyPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: themeColor }}>
                  <span className="text-white font-black text-xs">{i + 1}</span>
                </span>
                <span
                  className={`text-gray-700 ${density === 'younger' ? 'text-base' : 'text-sm'}`}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(point) }}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Mascot tip */}
        <div className="flex items-start gap-3 rounded-2xl p-4" style={{ background: '#fffbeb', border: '2px solid #fde68a' }}>
          <span className="text-2xl">{mascot === 'owl' ? '🦉' : mascot === 'fox' ? '🦊' : '🐼'}</span>
          <p className="text-yellow-800 text-sm font-medium">
            {density === 'younger'
              ? "Watch the video, then tick the box below to continue!"
              : "Watch the video and make sure you understand the key points before continuing."}
          </p>
        </div>

        {/* Watched checkbox */}
        <label className="flex items-center gap-3 cursor-pointer select-none p-4 rounded-2xl border-2 transition-all"
          style={watched
            ? { borderColor: '#58CC02', borderBottomColor: '#46A302', borderBottomWidth: '3px', background: '#f0fff4' }
            : { borderColor: '#e5e7eb' }
          }
        >
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
            watched ? 'border-green-500 bg-green-500' : 'border-gray-300'
          }`}>
            {watched && <CheckCircle size={14} color="white" fill="white" />}
          </div>
          <input type="checkbox" className="sr-only" checked={watched} onChange={e => setWatched(e.target.checked)} />
          <span className={`font-bold ${density === 'younger' ? 'text-base' : 'text-sm'} ${watched ? 'text-green-700' : 'text-gray-600'}`}>
            I've watched the video
          </span>
        </label>

        {/* Teacher note */}
        <button onClick={() => setShowNote(v => !v)} className="text-xs text-gray-400 underline">
          Teacher note {showNote ? '▲' : '▼'}
        </button>
        {showNote && (
          <div className="rounded-2xl p-4 text-sm text-yellow-800" style={{ background: '#fffbeb', border: '2px solid #fde68a' }}>
            {step.teacherNote}
          </div>
        )}
      </div>

      {/* Bottom button */}
      <div className="px-4 pb-8 pt-2">
        <button
          onClick={() => watched && onNext()}
          disabled={!watched}
          className="btn-duo w-full py-4 rounded-2xl font-black text-base uppercase tracking-wide transition-all"
          style={watched
            ? { background: themeColor, borderBottomColor: themeDark, color: 'white' }
            : { background: '#e5e7eb', borderBottomColor: '#d1d5db', color: '#9ca3af' }
          }
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
}
