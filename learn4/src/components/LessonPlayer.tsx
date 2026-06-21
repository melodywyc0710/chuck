import { motion } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { englishSession } from '../data/english-session';
import { mathsSession } from '../data/maths-session';
import { getSession } from '../data/curriculum/index';
import VideoStep from './steps/VideoStep';
import WorkedExample from './steps/WorkedExample';
import QuizStep from './steps/QuizStep';
import FreeResponseStep from './steps/FreeResponseStep';
import HomeworkStep from './steps/HomeworkStep';

const THEME_COLOR = { purple: '#A855F7', blue: '#1CB0F6', green: '#58CC02', orange: '#F97316' };
const THEME_DARK  = { purple: '#7C3AED', blue: '#0E8FC4', green: '#46A302', orange: '#EA580C' };

export default function LessonPlayer() {
  const { activeSessionId, currentStepIndex, goToStep, finishSession, currentScore, currentAnswers, profile, setView } = useAppStore();

  if (!activeSessionId || !profile) return null;

  const session = getSession(activeSessionId)
    ?? (activeSessionId.startsWith('eng') ? englishSession : mathsSession);
  const themeColor = THEME_COLOR[profile.colorTheme];
  const themeDark  = THEME_DARK[profile.colorTheme];
  const step = session.steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / session.steps.length) * 100;
  const isLast = currentStepIndex === session.steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      const starsEarned = Math.round((currentScore.correct / Math.max(currentScore.total, 1)) * session.starsAvailable);
      finishSession({
        sessionId: session.id,
        subject: session.subject,
        score: currentScore.correct,
        total: currentScore.total,
        starsEarned: Math.max(starsEarned, 3),
        freeResponses: Object.fromEntries(
          Object.entries(currentAnswers).map(([k, v]) => [k, String(v)])
        ),
        homeworkSet: true,
        timeSpentMinutes: 0,
      });
    } else {
      goToStep(currentStepIndex + 1);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-lg mx-auto">
      {/* ── TOP BAR ── */}
      <div className="flex items-center gap-3 px-4 pt-10 pb-4 sticky top-0 bg-white z-10 border-b border-gray-100">
        <button
          onClick={() => { if (confirm('Leave this lesson?')) setView('home'); }}
          className="p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors flex-shrink-0"
        >
          <X size={20} />
        </button>

        {/* Progress bar */}
        <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: themeColor, boxShadow: `0 3px 0 ${themeDark}` }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* Hearts */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Heart size={20} fill="#FF4B4B" color="#FF4B4B" />
          <span className="font-black text-gray-500 text-sm">∞</span>
        </div>
      </div>

      {/* ── STEP CONTENT (scrollable) ── */}
      <div className="flex-1 overflow-y-auto">
        {step.type === 'video' && (
          <VideoStep step={step} onNext={handleNext} themeColor={themeColor} themeDark={themeDark} mascot={profile.mascot} />
        )}
        {step.type === 'worked-example' && (
          <WorkedExample step={step} onNext={handleNext} themeColor={themeColor} themeDark={themeDark} mascot={profile.mascot} />
        )}
        {step.type === 'quiz' && (
          <QuizStep step={step} onNext={handleNext} themeColor={themeColor} themeDark={themeDark} mascot={profile.mascot} />
        )}
        {step.type === 'free-response' && (
          <FreeResponseStep step={step} onNext={handleNext} themeColor={themeColor} themeDark={themeDark} mascot={profile.mascot} />
        )}
        {step.type === 'homework' && (
          <HomeworkStep step={step} onNext={handleNext} themeColor={themeColor} mascot={profile.mascot} />
        )}
      </div>
    </div>
  );
}
