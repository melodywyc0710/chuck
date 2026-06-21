import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { englishSession } from '../data/english-session';
import { mathsSession } from '../data/maths-session';
import { getSession } from '../data/curriculum/index';
import VideoStep from './steps/VideoStep';
import WorkedExample from './steps/WorkedExample';
import QuizStep from './steps/QuizStep';
import FreeResponseStep from './steps/FreeResponseStep';
import HomeworkStep from './steps/HomeworkStep';

const MASCOT_EMOJI = { owl: '🦉', fox: '🦊', panda: '🐼' };
const THEME_COLOR = { purple: '#A855F7', blue: '#1CB0F6', green: '#58CC02', orange: '#F97316' };
const THEME_DARK  = { purple: '#7C3AED', blue: '#0E8FC4', green: '#46A302', orange: '#EA580C' };

export default function LessonPlayer() {
  const { activeSessionId, currentStepIndex, goToStep, finishSession, currentScore, currentAnswers, profile, setView } = useAppStore();

  if (!activeSessionId || !profile) return null;

  const session = getSession(activeSessionId)
    ?? (activeSessionId.startsWith('eng') ? englishSession : mathsSession);
  const themeColor = THEME_COLOR[profile.colorTheme];
  const themeDark  = THEME_DARK[profile.colorTheme];
  const mascot = MASCOT_EMOJI[profile.mascot];
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
        starsEarned: Math.max(starsEarned, 3), // minimum 3 stars for completing
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

  const STEP_LABELS: Record<string, string> = {
    'video': '📹 Video',
    'worked-example': '💡 Example',
    'quiz': '❓ Quiz',
    'free-response': '✏️ Writing',
    'homework': '🏠 Homework',
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #f0fff4 0%, #fafff7 100%)' }}>
      {/* Top bar */}
      <div className="bg-white sticky top-0 z-10" style={{ boxShadow: '0 3px 0 #e5e7eb' }}>
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => { if (confirm('Leave this lesson? Your progress so far is saved.')) setView('home'); }}
              className="btn-duo btn-ghost px-3 py-2 text-sm rounded-xl"
            >
              ✕ Quit
            </button>
            {/* Progress bar centre */}
            <div className="flex-1 mx-4">
              <div className="progress-track">
                <motion.div
                  className="progress-fill"
                  style={{ background: themeColor }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
            <div className="flex items-center gap-1.5 font-black text-sm" style={{ color: themeColor }}>
              {mascot}
              <span className="text-gray-700">{currentStepIndex + 1}/{session.steps.length}</span>
            </div>
          </div>
          {/* Step pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {session.steps.map((s, i) => (
              <div
                key={i}
                className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-black transition-all ${
                  i === currentStepIndex ? 'text-white' :
                  i < currentStepIndex ? 'bg-green-100 text-green-600' :
                  'text-gray-300 bg-gray-100'
                }`}
                style={i === currentStepIndex ? { background: themeColor, boxShadow: `0 2px 0 ${themeDark}` } : {}}
              >
                {i < currentStepIndex ? '✓' : ''} {STEP_LABELS[s.type]}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {step.type === 'video' && (
          <VideoStep step={step} onNext={handleNext} themeColor={themeColor} mascot={mascot} />
        )}
        {step.type === 'worked-example' && (
          <WorkedExample step={step} onNext={handleNext} themeColor={themeColor} mascot={mascot} />
        )}
        {step.type === 'quiz' && (
          <QuizStep step={step} onNext={handleNext} themeColor={themeColor} mascot={mascot} />
        )}
        {step.type === 'free-response' && (
          <FreeResponseStep step={step} onNext={handleNext} themeColor={themeColor} mascot={mascot} />
        )}
        {step.type === 'homework' && (
          <HomeworkStep step={step} onNext={handleNext} themeColor={themeColor} mascot={mascot} />
        )}
      </div>
    </div>
  );
}
