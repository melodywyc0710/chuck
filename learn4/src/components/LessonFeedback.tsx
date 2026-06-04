import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';

const THEME_COLOR = { purple: '#6366f1', blue: '#3b82f6', green: '#10b981', orange: '#f59e0b' };
const MASCOT_EMOJI = { owl: '🦉', fox: '🦊', panda: '🐼' };

interface FeedbackData {
  en: { headline: string; detail: string; tip: string };
  zh: { headline: string; detail: string; tip: string };
}

function generateFeedback(
  pct: number,
  subject: string,
  title: string,
  name: string,
  starsEarned: number,
): FeedbackData {
  const subjectZh = subject === 'english' ? '英语' : subject === 'maths' ? '数学' : subject === 'science' ? '科学' : '人文';

  if (pct >= 87) {
    return {
      en: {
        headline: `Excellent work, ${name}! 🌟`,
        detail: `You scored ${pct}% on "${title}" — that's outstanding! You clearly understood today's lesson and can apply the concepts with confidence.`,
        tip: `Challenge yourself further: try explaining today's topic to a friend or family member without looking at your notes.`,
      },
      zh: {
        headline: `非常出色，${name}！🌟`,
        detail: `你在"${title}"中得了${pct}分——真是太棒了！你显然很好地理解了今天的${subjectZh}课，并且能够自信地运用这些概念。`,
        tip: `继续挑战自己：试着在不看笔记的情况下，向家人或朋友解释今天学到的内容。`,
      },
    };
  }
  if (pct >= 62) {
    return {
      en: {
        headline: `Good effort, ${name}! 👍`,
        detail: `You scored ${pct}% on "${title}" — solid work! You've got a good grasp of most of today's content. A little review of the trickier questions will help cement your understanding.`,
        tip: `Go back and re-read the worked examples for any questions you found difficult. Try writing one example in your own words.`,
      },
      zh: {
        headline: `很好的努力，${name}！👍`,
        detail: `你在"${title}"中得了${pct}分——干得不错！你对今天大部分${subjectZh}内容都有很好的掌握。对较难的题目稍作复习，有助于巩固理解。`,
        tip: `回去重新阅读那些你觉得困难的例题，尝试用自己的话写出一个例子。`,
      },
    };
  }
  return {
    en: {
      headline: `Keep going, ${name}! 💪`,
      detail: `You scored ${pct}% on "${title}". This topic takes practice — don't worry! Review the worked examples again carefully before the next lesson.`,
      tip: `Focus on the two worked examples in today's lesson. Read them slowly, step by step. Ask your teacher or a parent to go through them with you.`,
    },
    zh: {
      headline: `继续加油，${name}！💪`,
      detail: `你在"${title}"中得了${pct}分。这个${subjectZh}课题需要练习——不要担心！在下次上课前，请仔细复习例题。`,
      tip: `专注于今天课程中的两个例题。慢慢地、一步一步地阅读它们。可以请老师或家长陪你一起复习。`,
    },
  };
}

interface Props { onContinue: () => void }

export default function LessonFeedback({ onContinue }: Props) {
  const { profile, sessionResults, currentScore } = useAppStore();
  const [lang, setLang] = useState<'en' | 'zh'>('en');
  if (!profile) return null;

  const latest = sessionResults[sessionResults.length - 1];
  if (!latest) { onContinue(); return null; }

  const pct = latest.total > 0 ? Math.round((latest.score / latest.total) * 100) : 100;
  const themeColor = THEME_COLOR[profile.colorTheme];
  const mascot = MASCOT_EMOJI[profile.mascot];
  const feedback = generateFeedback(pct, latest.subject, latest.sessionId, profile.name, latest.starsEarned);
  const f = feedback[lang];

  const scoreColor = pct >= 87 ? '#059669' : pct >= 62 ? '#d97706' : '#dc2626';
  const scoreLabel = pct >= 87 ? 'Excellent' : pct >= 62 ? 'Good' : 'Needs review';
  const scoreZh = pct >= 87 ? '优秀' : pct >= 62 ? '良好' : '需复习';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-2xl mx-auto w-full px-4 py-6 space-y-5 flex-1">
        {/* Language toggle */}
        <div className="flex justify-end">
          <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {(['en', 'zh'] as const).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-4 py-2 text-sm font-bold transition-all ${lang === l ? 'text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                style={lang === l ? { background: themeColor } : {}}
              >
                {l === 'en' ? '🇦🇺 English' : '🇨🇳 中文'}
              </button>
            ))}
          </div>
        </div>

        {/* Score card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-6 shadow-lg text-center"
        >
          <div className="text-6xl mb-3">{mascot}</div>
          <div className="text-5xl font-black mb-1" style={{ color: scoreColor }}>{pct}%</div>
          <div className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: scoreColor }}>
            {lang === 'en' ? scoreLabel : scoreZh}
          </div>
          <div className="flex justify-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`text-2xl transition-all ${i < latest.starsEarned ? 'opacity-100' : 'opacity-20'}`}>⭐</span>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: lang === 'en' ? 'Correct' : '正确', value: `${latest.score}/${latest.total}` },
              { label: lang === 'en' ? 'Stars' : '星星', value: `+${latest.starsEarned}` },
              { label: lang === 'en' ? 'Minutes' : '分钟', value: latest.timeSpentMinutes ?? '~45' },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-2xl p-3">
                <div className="font-black text-gray-800 text-lg">{s.value}</div>
                <div className="text-xs text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Feedback message */}
        <motion.div
          key={lang}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-sm space-y-4"
        >
          <h2 className="font-black text-gray-800 text-xl">{f.headline}</h2>
          <p className="text-gray-600 leading-relaxed">{f.detail}</p>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="font-bold text-amber-800 text-sm mb-1">
              {lang === 'en' ? '💡 Next step' : '💡 下一步'}
            </div>
            <p className="text-amber-700 text-sm">{f.tip}</p>
          </div>
        </motion.div>

        {/* Parent share section */}
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="font-bold text-gray-700 mb-3 text-sm">
            {lang === 'en' ? '📤 Share with parent / guardian' : '📤 分享给家长'}
          </div>
          <div className="text-sm text-gray-500 bg-gray-50 rounded-xl p-3 leading-relaxed">
            {lang === 'en'
              ? `${profile.name} completed a lesson today and scored ${pct}%. ${f.headline.split('!')[0].replace(`, ${profile.name}`, '')}! ${f.tip}`
              : `${profile.name}今天完成了一节课，得分为${pct}%。${f.headline.split('！')[0]}！${f.tip}`}
          </div>
          <button
            onClick={() => {
              const msg = lang === 'en'
                ? `${profile.name} completed a Learn4 lesson and scored ${pct}%.\n\n${f.headline}\n${f.detail}\n\nNext step: ${f.tip}`
                : `${profile.name}完成了一节Learn4课程，得分${pct}%。\n\n${f.headline}\n${f.detail}\n\n下一步：${f.tip}`;
              navigator.clipboard.writeText(msg).then(() => alert(lang === 'en' ? 'Copied to clipboard!' : '已复制到剪贴板！'));
            }}
            className="mt-3 w-full py-2.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90"
            style={{ background: themeColor }}
          >
            {lang === 'en' ? '📋 Copy message' : '📋 复制消息'}
          </button>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          className="w-full py-4 rounded-2xl text-white font-black text-lg"
          style={{ background: themeColor }}
        >
          {lang === 'en' ? 'See Full Summary →' : '查看完整摘要 →'}
        </motion.button>
      </div>
    </div>
  );
}
