import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { englishSession } from '../data/english-session';
import { mathsSession } from '../data/maths-session';
import { getSession } from '../data/curriculum/index';
import { lessonSummaries } from '../data/lessonSummaries';

const THEME_COLOR = { purple: '#6366f1', blue: '#3b82f6', green: '#10b981', orange: '#f59e0b' };
const MASCOT_EMOJI = { owl: '🦉', fox: '🦊', panda: '🐼' };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ClassSummary() {
  const { sessionResults, profile, setView, totalStars, currentAnswers, currentStreak } = useAppStore();
  if (!profile) return null;

  const latest = sessionResults[sessionResults.length - 1];
  if (!latest) { setView('home'); return null; }

  const session = getSession(latest.sessionId) ?? (latest.subject === 'english' ? englishSession : mathsSession);
  const coveredText = lessonSummaries[latest.sessionId]?.en ?? session.description;
  const themeColor = THEME_COLOR[profile.colorTheme];
  const mascot = MASCOT_EMOJI[profile.mascot];
  const pct = latest.total > 0 ? Math.round((latest.score / latest.total) * 100) : 100;

  // Build parent message
  const freeRespSummary = Object.values(currentAnswers)
    .filter(v => typeof v === 'string' && v.length > 30)
    .slice(0, 2)
    .map(v => `"${String(v).slice(0, 120)}${String(v).length > 120 ? '...' : ''}"`)
    .join('\n');

  const parentMessage = `📚 LEARN4 — Class Summary for ${profile.name}
Date: ${formatDate(latest.completedAt)}
Subject: ${session.subject === 'english' ? 'English' : 'Mathematics'} — ${session.title}
Victorian Curriculum: ${session.victorianCode}

✅ Session Completed in approximately ${latest.timeSpentMinutes || '~45'} minutes
⭐ Stars Earned: ${latest.starsEarned} (Total: ${totalStars})
📊 Quiz Score: ${latest.score}/${latest.total} (${pct}%)

📝 WHAT WE LEARNED TODAY:
${session.description}

✏️ STUDENT WRITING SAMPLE:
${freeRespSummary || '(Responses saved — ask your child to share their work!)'}

🏠 HOMEWORK DUE NEXT CLASS:
${session.steps.filter(s => s.type === 'homework').flatMap((s: any) => s.tasks.map((t: any) => `• ${t.label}`)).join('\n')}

💬 HOW YOU CAN HELP AT HOME:
${session.subject === 'english'
  ? '• Ask your child to read their story to you\n• Encourage them to add more descriptive words\n• Celebrate their creativity!'
  : '• Ask your child to explain what equivalent fractions are\n• Look for fractions together (recipes, measuring cups)\n• Praise their effort — fractions are tricky!'}

Well done, ${profile.name}! Keep up the amazing work! ${mascot}

— Learn4 Platform · learn4.edu.au`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(parentMessage).then(() => alert('Copied! Paste it into an email or message.'));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Celebration header */}
      <div className="text-white py-10 px-4 text-center" style={{ background: `linear-gradient(135deg, ${themeColor}, ${themeColor}cc)` }}>
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-7xl font-black mb-2"
        >
          {pct}%
        </motion.div>
        <h1 className="text-3xl font-black mb-1">Session Complete!</h1>
        <p className="opacity-80 text-lg">You finished: <strong>{session.title}</strong></p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <span className="text-3xl">{mascot}</span>
          <span className="font-bold text-xl">Well done, {profile.name}!</span>
        </div>
        {currentStreak > 0 && (
          <div className="mt-3 inline-block bg-white/20 rounded-full px-4 py-1 font-bold text-sm">
            🔥 {currentStreak} day streak
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: `+${latest.starsEarned}`, label: 'Stars earned' },
            { value: `${pct}%`, label: 'Quiz score' },
            { value: `${latest.timeSpentMinutes || '~45'}m`, label: 'Time spent' },
          ].map(s => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-4 text-center shadow-sm"
            >
              <div className="font-black text-2xl text-gray-800">{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* What was covered */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-black text-gray-800 mb-3">What we covered</h3>
          <div className="text-xs text-indigo-600 font-semibold mb-1">{session.victorianCode}</div>
          <p className="text-gray-600 text-sm">{coveredText}</p>
          <div className="mt-3 space-y-1">
            {session.steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-green-500">✓</span>
                <span>{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Homework reminder */}
        {session.steps.filter(s => s.type === 'homework').map((s: any) => (
          <div key={s.id} className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <h3 className="font-black text-amber-800 mb-3">Homework due next class</h3>
            <div className="space-y-2">
              {s.tasks.map((task: any) => (
                <div key={task.id} className="flex items-start gap-2 text-sm text-amber-700">
                  <span>□</span>
                  <span>{task.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Parent summary — printable */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-black text-gray-800">Send to Parents</h3>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="text-xs bg-indigo-100 text-indigo-700 font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-200 transition-colors no-print"
              >
                📋 Copy
              </button>
              <button
                onClick={() => window.print()}
                className="text-xs bg-gray-100 text-gray-700 font-bold px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors no-print"
              >
                🖨️ Print
              </button>
            </div>
          </div>
          <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono bg-gray-50 rounded-xl p-4 leading-relaxed">
            {parentMessage}
          </pre>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 no-print">
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setView('rewards')}
            className="flex-1 py-4 rounded-2xl font-black text-lg bg-yellow-400 text-yellow-900"
          >
            🛋️ Decorate Room
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setView('home')}
            className="flex-1 py-4 rounded-2xl text-white font-black text-lg"
            style={{ background: themeColor }}
          >
            🏠 Back Home
          </motion.button>
        </div>
      </div>
    </div>
  );
}
