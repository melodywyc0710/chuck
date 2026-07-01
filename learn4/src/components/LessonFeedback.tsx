import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { sounds } from '../utils/sounds';
import { getSession } from '../data/curriculum/index';
import { lessonSummaries } from '../data/lessonSummaries';
import type { LessonStep, VideoStep } from '../data/types';

const THEME_COLOR = { purple: '#A855F7', blue: '#1CB0F6', green: '#58CC02', orange: '#F97316' };
const MASCOT_EMOJI = { owl: '🦉', fox: '🦊', panda: '🐼' };

const HW_EN: Record<string, string> = {
  english: `For homework this week: please memorise the assigned vocabulary words, write a diary entry each day (seven days total), and complete the English exercise book up to the folded page.`,
  maths: `For homework this week: please complete the maths handouts (written or printed).`,
};
const HW_ZH: Record<string, string> = {
  english: `英语作业书本做到折的那一页，准备两本空的练习册作为专门的单词本以及日记本，并背指定的单词，以及写这周的日记（共七天）。`,
  maths: `数学作业：完成数学练习单（书面或打印版）。`,
};

function extractVocabulary(steps: LessonStep[]): string[] {
  const vocab = new Set<string>();
  for (const step of steps) {
    if (step.type === 'video') {
      for (const kp of (step as VideoStep).keyPoints) {
        const matches = kp.match(/\*\*([^*]+)\*\*/g);
        if (matches) matches.forEach(m => vocab.add(m.replace(/\*\*/g, '')));
      }
    }
  }
  return Array.from(vocab).slice(0, 12);
}

function buildDetailedReport(
  pct: number,
  name: string,
  subject: string,
  sessionId: string,
  freeResponses: Record<string, string>,
  lang: 'en' | 'zh',
): string {
  const session = getSession(sessionId);
  const summary = lessonSummaries[sessionId];
  const hw = lang === 'en'
    ? (HW_EN[subject] ?? 'Please complete all assigned homework before the next lesson.')
    : (HW_ZH[subject] ?? '在下节课前完成所有指定作业。');

  const writtenWork = Object.values(freeResponses)
    .filter(v => typeof v === 'string' && v.length > 20)
    .slice(0, 3)
    .map(v => `  "${String(v).slice(0, 200)}${String(v).length > 200 ? '…' : ''}"`)
    .join('\n');

  if (lang === 'zh') {
    const coverageZh = summary?.zh ?? `这周${subject === 'maths' ? '数学' : '英语'}课上，我们完成了本节课的学习内容。`;
    const futureZh = summary?.futureZh ?? '';

    const topicsZh = session
      ? session.steps
          .filter(s => s.type !== 'homework')
          .map((s, i) => `  ${i + 1}. ${s.title}`)
          .join('\n')
      : '';

    const vocab = session ? extractVocabulary(session.steps) : [];
    const vocabZh = vocab.length > 0 ? `\n关键词汇：${vocab.join(' · ')}` : '';

    let progressZh: string;
    let recommendationZh: string;
    if (pct >= 87) {
      progressZh = `${name}在本节课的练习评估中得了${pct}分，能够独立完成并正确解答了所有题目，展现出非常好的理解能力与信心。`;
      recommendationZh = `建议${name}在课后尝试用自己的语言向家人解释今天所学的内容——能够清楚地讲给别人听，是真正掌握知识最好的证明。`;
    } else if (pct >= 62) {
      progressZh = `${name}在本节课的练习评估中得了${pct}分，对大部分核心内容有良好的掌握。有几个地方还需要在下节课前再巩固一下。`;
      recommendationZh = `建议${name}课后再回顾一遍今天的例题，尝试用自己的话写出一个例子，对于做错的题目也可以重新思考一遍原因。`;
    } else {
      progressZh = `${name}在本节课的练习评估中得了${pct}分。这个课题需要时间和反复练习才能真正吸收，这是完全正常的。`;
      recommendationZh = `建议与${name}一起一步步回顾今天课程中的例题，慢慢来。下周我们会再确认一下这部分内容的掌握情况。`;
    }

    const lines = [
      `您好，`,
      ``,
      session ? `本节课：${session.title}（${session.victorianCode}）` : '',
      ``,
      `【本节课内容】`,
      coverageZh,
      ``,
      topicsZh ? `【课堂活动】\n${topicsZh}${vocabZh}` : '',
      ``,
      futureZh ? `【为何重要】\n${futureZh}` : '',
      ``,
      `【学生表现】`,
      progressZh,
      ``,
      writtenWork ? `【学生书面作业节选】\n${writtenWork}` : '',
      writtenWork ? `` : '',
      `【建议】`,
      recommendationZh,
      ``,
      `【家庭作业】`,
      hw,
    ].filter(s => s !== undefined);

    return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  }

  // English
  const coverageEn = summary?.en ?? `This week we completed the lesson content in ${subject === 'maths' ? 'Maths' : 'English'}.`;
  const futureEn = summary?.futureEn ?? '';

  const topicsEn = session
    ? session.steps
        .filter(s => s.type !== 'homework')
        .map((s, i) => `  ${i + 1}. ${s.title}`)
        .join('\n')
    : '';

  const vocab = session ? extractVocabulary(session.steps) : [];
  const vocabEn = vocab.length > 0 ? `\nKey vocabulary introduced: ${vocab.join(' · ')}` : '';

  let progressEn: string;
  let recommendationEn: string;
  if (pct >= 87) {
    progressEn = `${name} scored ${pct}% on the practice assessments, completing all questions independently and correctly. This reflects genuine understanding and real confidence with the material.`;
    recommendationEn = `To deepen the learning, encourage ${name} to explain today's topic in their own words to someone at home — being able to teach it clearly is the best sign of true mastery.`;
  } else if (pct >= 62) {
    progressEn = `${name} scored ${pct}% on the practice assessments, showing a solid grasp of most of the core content. There are a few areas that would benefit from another look before the next lesson.`;
    recommendationEn = `It would help to go back through the worked examples from today's lesson, try writing out one example in ${name}'s own words, and revisit any questions that were tricky.`;
  } else {
    progressEn = `${name} scored ${pct}% on the practice assessments — this is a topic that takes time and repeated practice to absorb, and that is completely normal. The priority right now is patient, careful review of the worked examples rather than moving on quickly.`;
    recommendationEn = `Please go through the worked examples from today's lesson step by step with ${name}, without rushing. We will revisit this topic next week to check where things stand and decide how much more time to spend on it.`;
  }

  const lines = [
    `Dear parent / guardian,`,
    ``,
    session ? `Lesson: ${session.title} (${session.victorianCode})` : '',
    ``,
    `WHAT WE COVERED TODAY`,
    coverageEn,
    ``,
    topicsEn ? `ACTIVITIES AND TOPICS\n${topicsEn}${vocabEn}` : '',
    ``,
    futureEn ? `WHY THIS MATTERS\n${futureEn}` : '',
    ``,
    `STUDENT PERFORMANCE`,
    progressEn,
    ``,
    writtenWork ? `STUDENT'S WRITTEN WORK\n${writtenWork}` : '',
    writtenWork ? `` : '',
    `RECOMMENDATIONS`,
    recommendationEn,
    ``,
    `HOMEWORK`,
    hw,
  ].filter(s => s !== undefined);

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

interface Props { onContinue: () => void }

interface StarParticle {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
}

export default function LessonFeedback({ onContinue }: Props) {
  const { profile, sessionResults, activeSessionId, setView } = useAppStore();
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [copied, setCopied] = useState(false);
  const [stars, setStars] = useState<StarParticle[]>([]);

  const resultBySession = activeSessionId
    ? [...sessionResults].reverse().find(r => r.sessionId === activeSessionId)
    : undefined;
  const latest = resultBySession ?? sessionResults[sessionResults.length - 1];
  const isTeacherPreview = !!(resultBySession && resultBySession !== sessionResults[sessionResults.length - 1]);

  useEffect(() => {
    if (!isTeacherPreview) sounds.starEarned();
    if (isTeacherPreview) return;
    const count = 7;
    const particles: StarParticle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 50,
      y: 50,
      angle: (360 / count) * i,
      distance: 120 + Math.random() * 80,
    }));
    setStars(particles);
    const timer = setTimeout(() => setStars([]), 1400);
    return () => clearTimeout(timer);
  }, []);

  if (!profile) return null;
  if (!latest) { onContinue(); return null; }

  const session = getSession(latest.sessionId);
  const pct = latest.total > 0 ? Math.round((latest.score / latest.total) * 100) : 100;
  const themeColor = THEME_COLOR[profile.colorTheme];
  const mascot = MASCOT_EMOJI[profile.mascot];
  const scoreColor = pct >= 87 ? '#059669' : pct >= 62 ? '#d97706' : '#dc2626';
  const scoreLabel = { en: pct >= 87 ? 'Excellent' : pct >= 62 ? 'Good' : 'Needs Review', zh: pct >= 87 ? '优秀' : pct >= 62 ? '良好' : '需复习' };

  const report = buildDetailedReport(pct, profile.name, latest.subject, latest.sessionId, latest.freeResponses ?? {}, lang);

  const handleCopy = () => {
    navigator.clipboard.writeText(report).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #f0fff4 0%, #fafff7 100%)' }}>
      {/* Star burst fly-in */}
      {stars.map(star => {
        const rad = (star.angle * Math.PI) / 180;
        const dx = Math.cos(rad) * star.distance;
        const dy = Math.sin(rad) * star.distance;
        return (
          <motion.div
            key={star.id}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: dx, y: dy, opacity: 0, scale: 0.5 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              left: `${star.x}%`,
              top: `${star.y}%`,
              pointerEvents: 'none',
              zIndex: 50,
              fontSize: '1.5rem',
            }}
          >
            ⭐
          </motion.div>
        );
      })}

      <div className="max-w-2xl mx-auto w-full px-4 py-6 space-y-5 flex-1">

        {/* Teacher preview back button */}
        {isTeacherPreview && (
          <button
            onClick={() => setView('teacher')}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Back to Dashboard
          </button>
        )}

        {/* Score card — shown to everyone */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-6 shadow-lg text-center"
        >
          <div className="text-6xl mb-3">{mascot}</div>
          <div className="text-5xl font-black mb-1" style={{ color: scoreColor }}>{pct}%</div>
          <div className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: scoreColor }}>
            {scoreLabel[lang === 'en' ? 'en' : 'zh']}
          </div>
          {session && (
            <div className="text-sm text-gray-500 mb-4 font-medium">{session.title}</div>
          )}
          <div className="flex justify-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`text-2xl ${i < latest.starsEarned ? 'opacity-100' : 'opacity-20'}`}>⭐</span>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Correct', value: `${latest.score}/${latest.total}` },
              { label: 'Stars', value: `+${latest.starsEarned}` },
              { label: 'Minutes', value: latest.timeSpentMinutes > 0 ? latest.timeSpentMinutes : '~45' },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-2xl p-3">
                <div className="font-black text-gray-800 text-lg">{s.value}</div>
                <div className="text-xs text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Teacher-only: detailed parent/guardian report */}
        {isTeacherPreview && (
          <>
            {/* Language toggle */}
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

            <motion.div
              key={lang}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-gray-500">
                  {lang === 'en' ? 'Parent / guardian report — Teacher view' : '家长报告 — 教师视图'}
                </p>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                  {lang === 'en' ? 'Ready to share' : '可直接发送'}
                </span>
              </div>

              <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {report}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleCopy}
                className="w-full py-3 rounded-2xl text-white text-sm font-black transition-all mt-5"
                style={{ background: copied ? '#059669' : themeColor }}
              >
                {copied
                  ? (lang === 'en' ? '✅ Copied!' : '✅ 已复制！')
                  : (lang === 'en' ? 'Copy report' : '复制报告')}
              </motion.button>
            </motion.div>
          </>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={isTeacherPreview ? () => setView('teacher') : onContinue}
          className="w-full py-4 rounded-2xl text-white font-black text-lg"
          style={{ background: themeColor }}
        >
          {isTeacherPreview
            ? '← Back to Dashboard'
            : 'Continue →'}
        </motion.button>

      </div>
    </div>
  );
}
