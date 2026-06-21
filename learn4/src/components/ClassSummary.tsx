import { motion } from 'framer-motion';
import { Star, Target, Clock, CheckCircle, Copy, Printer, Trophy, Home } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { englishSession } from '../data/english-session';
import { mathsSession } from '../data/maths-session';
import { getSession } from '../data/curriculum/index';
import { lessonSummaries } from '../data/lessonSummaries';

const THEME_COLOR = { purple: '#A855F7', blue: '#1CB0F6', green: '#58CC02', orange: '#F97316' };
const THEME_DARK  = { purple: '#7C3AED', blue: '#0E8FC4', green: '#46A302', orange: '#EA580C' };
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
  const themeDark  = THEME_DARK[profile.colorTheme];
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

— Chucky · chucky.app`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(parentMessage).then(() => alert('Copied! Paste it into an email or message.'));
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #f0fff4 0%, #fafff7 100%)' }}>
      {/* Celebration header */}
      <div className="text-white py-10 px-4 text-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${themeColor}, ${themeColor}cc)`, boxShadow: `0 6px 0 ${themeDark}` }}>
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20" style={{ background: 'white' }} />
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
            { value: `+${latest.starsEarned}`, label: 'Stars earned', Icon: Star, color: '#FFC800' },
            { value: `${pct}%`, label: 'Quiz score', Icon: Target, color: '#58CC02' },
            { value: `${latest.timeSpentMinutes || '~45'}m`, label: 'Time spent', Icon: Clock, color: '#1CB0F6' },
          ].map(s => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="card p-4 text-center"
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: s.color + '20' }}>
                <s.Icon size={18} style={{ color: s.color }} />
              </div>
              <div className="font-black text-xl text-gray-800">{s.value}</div>
              <div className="text-xs text-gray-400 font-medium">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* What was covered */}
        <div className="card p-5">
          <h3 className="font-black text-gray-800 mb-3">What we covered</h3>
          <div className="text-xs font-black uppercase tracking-wide mb-1" style={{ color: themeColor }}>{session.victorianCode}</div>
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
          <div key={s.id} className="card p-5 border-yellow-300" style={{ borderBottomColor: '#E0A800', borderBottomWidth: '3px' }}>
            <h3 className="font-black text-yellow-700 mb-3 flex items-center gap-2"><Home size={16} /> Homework due next class</h3>
            <div className="space-y-2">
              {s.tasks.map((task: any) => (
                <div key={task.id} className="flex items-start gap-2 text-sm text-gray-700">
                  <span>□</span>
                  <span>{task.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Parent summary — printable */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-black text-gray-800">Send to Parents</h3>
            <div className="flex gap-2">
              <button onClick={copyToClipboard} className="btn-duo btn-green px-3 py-1.5 text-xs rounded-xl no-print flex items-center gap-1"><Copy size={12} /> Copy</button>
              <button onClick={() => window.print()} className="btn-duo btn-ghost px-3 py-1.5 text-xs rounded-xl no-print flex items-center gap-1"><Printer size={12} /> Print</button>
            </div>
          </div>
          <div className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 rounded-xl p-4 leading-relaxed">
            {parentMessage}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 no-print pb-6">
          <button onClick={() => setView('rewards')} className="btn-duo btn-yellow flex-1 py-4 text-base rounded-2xl flex items-center justify-center gap-2">
            <Trophy size={18} /> Rewards Room
          </button>
          <button
            onClick={() => setView('home')}
            className="btn-duo flex-1 py-4 text-base rounded-2xl text-white flex items-center justify-center gap-2"
            style={{ background: themeColor, borderBottomColor: themeDark }}
          >
            <Home size={18} /> Back Home
          </button>
        </div>
      </div>
    </div>
  );
}
