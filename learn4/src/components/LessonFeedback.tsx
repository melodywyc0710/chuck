import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { getSession } from '../data/curriculum/index';

const THEME_COLOR = { purple: '#6366f1', blue: '#3b82f6', green: '#10b981', orange: '#f59e0b' };
const MASCOT_EMOJI = { owl: '🦉', fox: '🦊', panda: '🐼' };

// ── Homework copy per subject ─────────────────────────────────────────────────
const HOMEWORK_EN: Record<string, string> = {
  english: `Homework this week:\n• Memorise your assigned vocabulary words\n• Write your daily diary entry (7 days)\n• Complete the English exercise book up to the folded page`,
  maths: `Homework this week:\n• Complete the maths handouts (written or printed)`,
};

const HOMEWORK_ZH: Record<string, string> = {
  english: `本周作业：\n• 背诵指定单词\n• 每天写日记（共七天）\n• 英语作业书本做到折的那一页`,
  maths: `本周作业：\n• 完成数学练习单（书面或打印版）`,
};

// ── Tiered feedback ───────────────────────────────────────────────────────────
interface Tier {
  scoreLabel: { en: string; zh: string };
  teacherNote: { en: string; zh: string };
  progressNote: { en: string; zh: string };
  futureNote: { en: string; zh: string };
  recommendation: { en: string; zh: string };
}

function buildTier(pct: number, subject: string, title: string, name: string): Tier {
  const subjectEn = subject === 'english' ? 'English' : subject === 'maths' ? 'Maths' : subject === 'science' ? 'Science' : 'HASS';
  const subjectZh = subject === 'english' ? '英语' : subject === 'maths' ? '数学' : subject === 'science' ? '科学' : '人文';
  const topic = title.replace(/^(English|Maths|Math|Science|HASS):\s*/i, '');

  if (pct >= 87) {
    return {
      scoreLabel: { en: 'Excellent', zh: '优秀' },
      teacherNote: {
        en: `This week in ${subjectEn} we covered "${topic}". ${name} engaged with the material with great focus and enthusiasm throughout the lesson.`,
        zh: `这周${subjectZh}课上我们学习了"${topic}"的内容。${name}在整堂课中专注投入，表现非常出色。`,
      },
      progressNote: {
        en: `${name} demonstrated a strong understanding of the concepts, scoring ${pct}% on the lesson assessments. They completed all questions independently and correctly, showing real confidence and growth.`,
        zh: `${name}在本节课的评估中得了${pct}分，展现出对知识点的深入掌握。能够独立且正确地完成所有练习题，体现出很好的信心与成长。`,
      },
      futureNote: {
        en: `Mastering "${topic}" is an important step — it builds the analytical and problem-solving skills that connect directly to more advanced work later on. ${name} is building a very solid foundation.`,
        zh: `扎实掌握"${topic}"是非常重要的一步，这些知识将直接为未来更高难度的学习奠定基础。${name}目前打下了非常坚实的基础。`,
      },
      recommendation: {
        en: `To deepen understanding, encourage ${name} to explain today's topic in their own words — teaching others is one of the best ways to consolidate learning.`,
        zh: `为了进一步巩固，建议${name}尝试用自己的话向家人解释今天所学的内容，这是检验和加深理解的最佳方式之一。`,
      },
    };
  }

  if (pct >= 62) {
    return {
      scoreLabel: { en: 'Good', zh: '良好' },
      teacherNote: {
        en: `This week in ${subjectEn} we covered "${topic}". ${name} worked hard throughout the lesson and showed a solid understanding of most of the content.`,
        zh: `这周${subjectZh}课上我们学习了"${topic}"的内容。${name}在课堂中认真参与，对大部分内容展现出良好的掌握。`,
      },
      progressNote: {
        en: `${name} scored ${pct}% on the lesson assessments, reflecting consistent effort and a good grasp of the core ideas. There are a few areas that would benefit from further review before the next lesson.`,
        zh: `${name}在本节课评估中得了${pct}分，体现了持续的努力以及对核心概念的良好掌握。有几个知识点还需要在下节课前进一步巩固。`,
      },
      futureNote: {
        en: `The skills from "${topic}" are foundational — building confidence now will make the next steps much easier. A little extra review this week will pay off significantly.`,
        zh: `"${topic}"中的内容是基础性的，现在打好基础会让之后的学习事半功倍。本周多花一点时间复习，效果会非常显著。`,
      },
      recommendation: {
        en: `Encourage ${name} to re-read the worked examples from today's lesson, and try writing out one example in their own words. Going back to the trickier questions is also a great use of review time.`,
        zh: `建议${name}重新阅读今天课程中的例题，尝试用自己的话写出一个例子，也可以重点复习做错的题目。`,
      },
    };
  }

  return {
    scoreLabel: { en: 'Needs Review', zh: '需复习' },
    teacherNote: {
      en: `This week in ${subjectEn} we covered "${topic}". ${name} attended the full lesson and engaged with the material — this is a topic that takes practice and time to fully absorb.`,
      zh: `这周${subjectZh}课上我们学习了"${topic}"的内容。${name}完整参与了课堂，这个课题需要一定时间和练习才能真正掌握，不用担心。`,
    },
    progressNote: {
      en: `${name} scored ${pct}% on the lesson assessments. This tells us the concepts need more time and practice to consolidate. The most important thing right now is careful, patient review of the worked examples.`,
      zh: `${name}在本节课评估中得了${pct}分。这说明相关概念还需要更多时间和练习来巩固。目前最重要的是耐心、仔细地复习例题和基础知识。`,
    },
    futureNote: {
      en: `"${topic}" is an important building block. Taking the time to review it carefully now means ${name} won't need to catch up later — every step reinforces the next one.`,
      zh: `"${topic}"是重要的基础内容。现在认真复习，能让${name}在之后的学习中更加轻松，花时间打好基础非常值得。`,
    },
    recommendation: {
      en: `Please go through the worked examples from today's lesson step by step with ${name}, slowly and without rushing. If possible, ask a parent or teacher to work through them together. We will revisit this topic next week to check on progress.`,
      zh: `请与${name}一起一步步回顾今天课程中的例题，慢慢来不需要着急。如有可能，可以请家长或老师一起复习。下周我们会再看一下这部分内容的掌握情况。`,
    },
  };
}

// ── Component ─────────────────────────────────────────────────────────────────
interface Props { onContinue: () => void }

export default function LessonFeedback({ onContinue }: Props) {
  const { profile, sessionResults } = useAppStore();
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [copied, setCopied] = useState(false);
  if (!profile) return null;

  const latest = sessionResults[sessionResults.length - 1];
  if (!latest) { onContinue(); return null; }

  const session = getSession(latest.sessionId);
  const lessonTitle = session?.title ?? latest.sessionId;

  const pct = latest.total > 0 ? Math.round((latest.score / latest.total) * 100) : 100;
  const themeColor = THEME_COLOR[profile.colorTheme];
  const mascot = MASCOT_EMOJI[profile.mascot];
  const tier = buildTier(pct, latest.subject, lessonTitle, profile.name);
  const scoreColor = pct >= 87 ? '#059669' : pct >= 62 ? '#d97706' : '#dc2626';

  const hwEn = HOMEWORK_EN[latest.subject] ?? 'Complete all assigned homework before the next lesson.';
  const hwZh = HOMEWORK_ZH[latest.subject] ?? '在下节课前完成所有指定作业。';

  const reportEn = [
    `Dear parent/guardian,`,
    ``,
    tier.teacherNote.en,
    ``,
    tier.progressNote.en,
    ``,
    tier.futureNote.en,
    ``,
    tier.recommendation.en,
    ``,
    hwEn,
  ].join('\n');

  const reportZh = [
    `您好，`,
    ``,
    tier.teacherNote.zh,
    ``,
    tier.progressNote.zh,
    ``,
    tier.futureNote.zh,
    ``,
    tier.recommendation.zh,
    ``,
    hwZh,
  ].join('\n');

  const report = lang === 'en' ? reportEn : reportZh;

  const handleCopy = () => {
    navigator.clipboard.writeText(report).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const sections = [
    { label: lang === 'en' ? '📚 This week\'s lesson' : '📚 本周课程内容', text: lang === 'en' ? tier.teacherNote.en : tier.teacherNote.zh },
    { label: lang === 'en' ? '📈 Student progress' : '📈 学生进步', text: lang === 'en' ? tier.progressNote.en : tier.progressNote.zh },
    { label: lang === 'en' ? '🔭 Why it matters' : '🔭 为什么重要', text: lang === 'en' ? tier.futureNote.en : tier.futureNote.zh },
    { label: lang === 'en' ? '💡 Recommendation' : '💡 老师建议', text: lang === 'en' ? tier.recommendation.en : tier.recommendation.zh },
    { label: lang === 'en' ? '🏠 Homework' : '🏠 作业', text: lang === 'en' ? hwEn : hwZh },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-2xl mx-auto w-full px-4 py-6 space-y-5 flex-1">

        {/* Language toggle — defaults to 中文 */}
        <div className="flex justify-end">
          <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {(['zh', 'en'] as const).map(l => (
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
            {lang === 'en' ? tier.scoreLabel.en : tier.scoreLabel.zh}
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
              { label: lang === 'en' ? 'Minutes' : '分钟', value: latest.timeSpentMinutes > 0 ? latest.timeSpentMinutes : '~45' },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-2xl p-3">
                <div className="font-black text-gray-800 text-lg">{s.value}</div>
                <div className="text-xs text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Parent report */}
        <motion.div
          key={lang}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-sm space-y-3"
        >
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-black text-gray-800 text-base">
              {lang === 'en' ? '📤 Parent / Guardian Report' : '📤 家长报告'}
            </h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
              {lang === 'en' ? 'Ready to share' : '可直接发送'}
            </span>
          </div>

          {sections.map(s => (
            <div key={s.label} className="border border-gray-100 rounded-2xl p-4">
              <div className="font-bold text-gray-700 text-sm mb-1">{s.label}</div>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{s.text}</p>
            </div>
          ))}

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleCopy}
            className="w-full py-3 rounded-2xl text-white text-sm font-black transition-all mt-2"
            style={{ background: copied ? '#059669' : themeColor }}
          >
            {copied
              ? (lang === 'en' ? '✅ Copied!' : '✅ 已复制！')
              : (lang === 'en' ? '📋 Copy full report' : '📋 复制完整报告')}
          </motion.button>
        </motion.div>

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
