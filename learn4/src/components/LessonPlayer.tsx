import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { englishSession } from '../data/english-session';
import { mathsSession } from '../data/maths-session';
import VideoStep from './steps/VideoStep';
import WorkedExample from './steps/WorkedExample';
import QuizStep from './steps/QuizStep';
import FreeResponseStep from './steps/FreeResponseStep';
import HomeworkStep from './steps/HomeworkStep';

const MASCOT_EMOJI = { owl: '🦉', fox: '🦊', panda: '🐼' };
const THEME_COLOR = { purple: '#6366f1', blue: '#3b82f6', green: '#10b981', orange: '#f59e0b' };

export default function LessonPlayer() {
  const { activeSessionId, currentStepIndex, goToStep, finishSession, currentScore, currentAnswers, profile, setView } = useAppStore();

  if (!activeSessionId || !profile) return null;

  const session = activeSessionId.startsWith('eng') ? englishSession : mathsSession;
  const themeColor = THEME_COLOR[profile.colorTheme];
  const mascot = MASCOT_EMOJI[profile.mascot];
  const step = session.steps[currentStepIndex];
  const progress = (currentStepIndex / session.steps.length) * 100;
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
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => { if (confirm('Leave this lesson? Your progress so far is saved.')) setView('home'); }}
              className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
            >
              ← Home
            </button>
            <div className="text-center">
              <div className="font-black text-gray-800 text-sm">{session.title.split(':')[0]}</div>
              <div className="text-xs text-gray-400">Step {currentStepIndex + 1} of {session.steps.length} · {STEP_LABELS[step.type]}</div>
            </div>
            <div className="text-sm font-bold" style={{ color: themeColor }}>
              {mascot} {profile.name}
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: themeColor }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          {/* Step pills */}
          <div className="flex gap-1 mt-2 overflow-x-auto pb-1">
            {session.steps.map((s, i) => (
              <div
                key={i}
                className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold transition-all ${
                  i === currentStepIndex ? 'text-white' : i < currentStepIndex ? 'text-gray-400 bg-gray-100' : 'text-gray-300 bg-gray-50'
                }`}
                style={i === currentStepIndex ? { background: themeColor } : {}}
              >
                {STEP_LABELS[s.type]}
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
