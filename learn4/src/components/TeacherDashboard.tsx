import { useEffect, useState } from 'react';
import { useAppStore } from '../store/appStore';
import { supabase } from '../lib/supabase';
import { fetchAllStudents, fetchStudentResults, saveSessionResult, fetchProfile, saveGameState } from '../lib/db';
import type { DbProfile, GameState } from '../lib/db';
import type { SessionResult } from '../store/appStore';
import { getSession, sessionsByYear } from '../data/curriculum/index';
import type { Session } from '../data/types';

const SUBJECT_COLOR: Record<string, string> = {
  english: '#A855F7',
  maths: '#58CC02',
  science: '#1CB0F6',
  hass: '#FFC800',
  vcd: '#F97316',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-AU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

const SUBJECT_LABEL: Record<string, string> = { english: 'English', maths: 'Maths', science: 'Science', hass: 'HASS', vcd: 'VCD' };

type Tab = 'students' | 'curriculum' | 'reports' | 'homework';

export default function TeacherDashboard() {
  const { setView, loadStudentData, setUserId, previewFeedback, startSession, classPin, setClassPin } = useAppStore();
  const [tab, setTab] = useState<Tab>('students');
  const [students, setStudents] = useState<DbProfile[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<DbProfile | null>(null);
  const [studentResults, setStudentResults] = useState<SessionResult[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);
  const [currYear, setCurrYear] = useState<4 | 5 | 6 | 8 | 9 | 10 | 11>(4);
  const [currSubject, setCurrSubject] = useState<string>('english');

  useEffect(() => {
    fetchAllStudents().then(data => {
      setStudents(data);
      setLoadingStudents(false);
    });
  }, []);

  async function selectStudent(student: DbProfile) {
    setSelectedStudent(student);
    setLoadingResults(true);
    const results = await fetchStudentResults(student.id);
    setStudentResults(results);
    setLoadingResults(false);
  }

  async function playForStudent(student: DbProfile) {
    await loadStudentData(student.id);
    setView('home');
  }

  const [markingSession, setMarkingSession] = useState<string | null>(null);

  async function markComplete(student: DbProfile, session: Session) {
    setMarkingSession(session.id);
    const stars = session.starsAvailable ?? 3;
    const result: SessionResult = {
      sessionId: session.id,
      subject: session.subject,
      completedAt: new Date().toISOString(),
      score: session.steps.filter((s: { type: string }) => s.type === 'quiz').length * 4,
      total: session.steps.filter((s: { type: string }) => s.type === 'quiz').length * 4,
      starsEarned: stars,
      freeResponses: {},
      homeworkSet: false,
      timeSpentMinutes: session.estimatedMinutes ?? 30,
    };
    await saveSessionResult(student.id, result);

    // Update the student's game_state so their star balance reflects the award
    const dbProfile = await fetchProfile(student.id);
    const gs: GameState = dbProfile?.game_state ?? {
      totalStars: 0, lifetimeStarsEarned: 0,
      ownedItems: [], itemQuantities: {}, placedItems: [], itemPositions: {},
      farmPlots: Array.from({ length: 10 }, (_, i) => ({ id: `plot-${i}`, animalId: null, placedAt: '' })),
      lastFarmCollect: '', farmDailyStars: 0, farmLastDay: '',
      petNames: {}, currentStreak: 0, lastActiveDate: '',
      completedSessions: [], unlockedBadges: [],
      weeklyLessonsCount: 0, weeklyLessonsWeek: '', weeklyChallengeCollected: '',
      lastLoginBonus: '', firstLoginDate: '',
    };
    gs.totalStars = (gs.totalStars ?? 0) + stars;
    gs.lifetimeStarsEarned = (gs.lifetimeStarsEarned ?? 0) + stars;
    if (!gs.completedSessions.includes(result.sessionId)) {
      gs.completedSessions = [...gs.completedSessions, result.sessionId];
    }
    await saveGameState(student.id, gs);

    // Refresh results
    const updated = await fetchStudentResults(student.id);
    setStudentResults(updated);
    setMarkingSession(null);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUserId(null, null);
  }

  const curriculumSessions: Session[] = (sessionsByYear[currYear] ?? []).filter(
    s => s.subject === currSubject,
  );

  return (
    <div className="min-h-screen" style={{ background: '#F7FFF4' }}>
      {/* Header */}
      <div className="sticky top-0 z-10" style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <h2 className="font-black text-white whitespace-nowrap">👩‍🏫 Teacher</h2>
          {/* Tab switcher */}
          <div className="flex bg-white/20 rounded-xl overflow-hidden">
            {([['students', '👤 Students'], ['curriculum', '📚 Curriculum'], ['reports', '📊 Reports'], ['homework', '📋 Homework']] as [Tab, string][]).map(([t, label]) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-bold transition-all ${tab === t ? 'bg-white text-purple-700' : 'text-white/70 hover:text-white'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={handleSignOut}
            className="text-xs text-white/70 hover:text-white border border-white/30 rounded-xl px-3 py-1.5 transition-colors whitespace-nowrap"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Curriculum tab */}
      {tab === 'curriculum' && (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
          {/* Class PIN */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
            <h3 className="font-bold text-gray-800 mb-1">🔐 Class PIN (for lesson unlocks)</h3>
            <p className="text-sm text-gray-500 mb-3">Set a 4-digit PIN. Students tap a locked lesson, then you type the PIN on their device to unlock it.</p>
            <div className="flex gap-3 items-center">
              <input
                type="text"
                maxLength={4}
                value={classPin}
                onChange={e => setClassPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="e.g. 1234"
                className="border-2 border-gray-200 rounded-xl px-4 py-2 text-center text-xl tracking-widest font-bold w-32 focus:outline-none focus:border-yellow-400"
              />
              <span className="text-sm text-gray-500">{classPin.length === 4 ? '✅ PIN set' : 'Enter 4 digits'}</span>
            </div>
          </div>

          {/* Year + Subject filters */}
          <div className="flex flex-wrap gap-3">
            <div className="flex bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              {([4, 5, 6, 8, 9, 10, 11] as const).map(y => (
                <button
                  key={y}
                  onClick={() => setCurrYear(y)}
                  className={`px-4 py-2 text-sm font-bold transition-all ${currYear === y ? 'text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                  style={currYear === y ? { background: '#58CC02' } : {}}
                >
                  Year {y}
                </button>
              ))}
            </div>
            <div className="flex bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              {(['english', 'maths', 'science', 'hass', 'vcd'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setCurrSubject(s)}
                  className={`px-4 py-2 text-sm font-bold capitalize transition-all ${currSubject === s ? 'text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                  style={currSubject === s ? { background: SUBJECT_COLOR[s] } : {}}
                >
                  {s === 'hass' ? 'HASS' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Class PIN */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6">
            <h3 className="font-bold text-gray-800 mb-2">🔐 Class PIN (for lesson unlocks)</h3>
            <p className="text-sm text-gray-500 mb-3">Set a 4-digit PIN. Students enter this to unlock new lessons with your help.</p>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                maxLength={4}
                value={classPin}
                onChange={e => setClassPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="e.g. 1234"
                className="border-2 border-gray-200 rounded-xl px-4 py-2 text-center text-xl tracking-widest font-bold w-32 focus:outline-none focus:border-yellow-400"
              />
              <span className="text-sm text-gray-500">{classPin.length === 4 ? '✅ PIN set' : 'Enter 4 digits'}</span>
            </div>
          </div>

          {/* Session cards */}
          {curriculumSessions.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-400 shadow-sm">No sessions available.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {curriculumSessions.map(session => (
                <div key={session.id} className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{session.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-gray-800 text-sm leading-tight">{session.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{session.victorianCode}</div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">{session.description}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => { startSession(session.id); setView('lesson'); }}
                    className="w-full py-2 rounded-xl text-white text-sm font-bold transition-colors"
                    style={{ background: SUBJECT_COLOR[session.subject] }}
                  >
                    ▶ Preview lesson
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'reports' && (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
          <h3 className="font-black text-gray-800 text-xl">Curriculum Reports — All Classes</h3>
          <p className="text-sm text-gray-500">Overview of all curriculum sessions organised by year level.</p>
          {([4, 5, 6, 8, 9, 10, 11] as const).map(yr => {
            const yrSessions = sessionsByYear[yr] ?? [];
            if (yrSessions.length === 0) return null;
            return (
              <div key={yr}>
                <h4 className="font-bold text-gray-700 text-lg mb-3">Year {yr === 11 ? 'VCE (11)' : yr}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {yrSessions.map(session => (
                    <div key={session.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
                      <span className="text-2xl">{session.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-800 text-sm leading-tight truncate">{session.title}</div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          <span className="capitalize" style={{ color: SUBJECT_COLOR[session.subject] }}>{SUBJECT_LABEL[session.subject]}</span>
                          {(session as Session & { term?: number }).term ? ` · Term ${(session as Session & { term?: number }).term}` : ''}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'homework' && (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
          <h3 className="font-black text-gray-800 text-xl">All Homework</h3>
          <p className="text-sm text-gray-500">Homework tasks from all curriculum sessions, organised by year and subject.</p>
          {([4, 5, 6, 8, 9, 10, 11] as const).map(yr => {
            const yrSessions = (sessionsByYear[yr] ?? []).filter(s =>
              s.steps.some((step: { type: string; tasks?: unknown[] }) => step.type === 'homework')
            );
            if (yrSessions.length === 0) return null;
            return (
              <div key={yr}>
                <h4 className="font-bold text-gray-700 text-lg mb-3">Year {yr === 11 ? 'VCE (11)' : yr}</h4>
                <div className="space-y-3">
                  {yrSessions.map(session => {
                    const hwStep = session.steps.find((step: { type: string }) => step.type === 'homework') as { type: string; title?: string; tasks?: Array<{ id: string; label: string }> } | undefined;
                    if (!hwStep) return null;
                    return (
                      <div key={session.id} className="bg-white rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{session.icon}</span>
                          <div className="font-bold text-gray-800 text-sm">{session.title}</div>
                          <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ background: SUBJECT_COLOR[session.subject] }}>
                            {SUBJECT_LABEL[session.subject]}
                          </span>
                        </div>
                        {hwStep.tasks && hwStep.tasks.length > 0 && (
                          <ul className="space-y-1 ml-2">
                            {hwStep.tasks.map((task) => (
                              <li key={task.id} className="text-xs text-gray-600 flex gap-2">
                                <span className="text-gray-300">•</span>
                                <span>{task.label}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'students' && <div className="max-w-5xl mx-auto px-4 py-6 flex gap-6 flex-col md:flex-row">
        {/* Left: Student list */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <h3 className="font-black text-gray-800 mb-3 text-sm">All Students</h3>
            {loadingStudents ? (
              <div className="text-gray-400 text-sm py-4 text-center">Loading…</div>
            ) : students.length === 0 ? (
              <div className="space-y-3">
                <p className="text-gray-500 text-sm font-semibold">No students yet.</p>
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-800 space-y-1">
                  <p className="font-bold">How students join:</p>
                  <p>1. Student signs up at this app</p>
                  <p>2. They use their school email</p>
                  <p>3. They appear here automatically</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {students.map(student => (
                  <button
                    key={student.id}
                    onClick={() => selectStudent(student)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all ${
                      selectedStudent?.id === student.id
                        ? 'border-2 border-green-400 bg-green-50'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="font-bold text-sm text-gray-800">{student.name}</div>
                    <div className="text-xs text-gray-400 capitalize">{student.density} · {student.mascot}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Student detail */}
        <div className="flex-1 space-y-5">
          {!selectedStudent ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-gray-400">
              <div className="text-4xl mb-3">👈</div>
              <p className="text-sm">Select a student from the list to view their data.</p>
            </div>
          ) : (
            <>
              {/* Student header card */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="font-black text-gray-800 text-lg">{selectedStudent.name}</h3>
                    <div className="text-xs text-gray-400 mt-0.5 capitalize">
                      {selectedStudent.density} mode · {selectedStudent.mascot} mascot · {selectedStudent.color_theme} theme
                    </div>
                  </div>
                  <button
                    onClick={() => playForStudent(selectedStudent)}
                    className="btn-duo text-white text-sm font-black px-5 py-2.5 rounded-2xl" style={{ background: '#58CC02', borderBottomColor: '#46A302' }}
                  >
                    ▶ Play lesson for this student
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xs text-gray-400 font-semibold">Lessons Done</div>
                    <div className="font-black text-gray-800 mt-0.5">{studentResults.length}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xs text-gray-400 font-semibold">Total Stars</div>
                    <div className="font-black text-gray-800 mt-0.5">
                      {studentResults.reduce((sum, r) => sum + r.starsEarned, 0)} ⭐
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xs text-gray-400 font-semibold">Last Active</div>
                    <div className="font-black text-gray-800 mt-0.5">
                      {studentResults.length > 0
                        ? formatDate([...studentResults].sort((a,b) => b.completedAt.localeCompare(a.completedAt))[0].completedAt)
                        : '—'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Session results */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-black text-gray-800 mb-1">📋 Lesson Results</h3>
                <p className="text-xs text-gray-400 mb-4">Tap "View Report" to open the full bilingual report.</p>
                {loadingResults ? (
                  <div className="text-gray-400 text-sm py-4 text-center">Loading results…</div>
                ) : studentResults.length === 0 ? (
                  <p className="text-gray-400 text-sm">No lessons completed yet.</p>
                ) : (
                  <div className="space-y-3">
                    {[...studentResults].reverse().map(result => {
                      const session = getSession(result.sessionId);
                      const pct = result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;
                      const scoreColor = pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444';
                      return (
                        <div key={result.sessionId + result.completedAt} className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{session?.icon ?? '📖'}</span>
                            <div>
                              <div className="font-bold text-gray-800 text-sm leading-tight">
                                {session?.title ?? result.sessionId}
                              </div>
                              <div className="text-xs text-gray-400 mt-0.5">
                                {SUBJECT_LABEL[result.subject]} · {formatDate(result.completedAt)}
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs font-bold" style={{ color: scoreColor }}>
                                  {result.score}/{result.total} ({pct}%)
                                </span>
                                <span className="text-xs text-yellow-600 font-bold">⭐ {result.starsEarned}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => previewFeedback(result.sessionId, result.score, result.total)}
                            className="btn-duo flex-shrink-0 text-white text-xs font-bold px-4 py-2 rounded-xl" style={{ background: '#58CC02', borderBottomColor: '#46A302' }}
                          >
                            View Report
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Written responses */}
              {studentResults.some(r => Object.keys(r.freeResponses ?? {}).length > 0) && (
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <h3 className="font-black text-gray-800 mb-4">✏️ Written Responses</h3>
                  <div className="space-y-5">
                    {studentResults.map(result => {
                      const entries = Object.entries(result.freeResponses ?? {}).filter(([, v]) => v && v.length > 5);
                      if (entries.length === 0) return null;
                      const session = getSession(result.sessionId);
                      return (
                        <div key={result.sessionId}>
                          <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                            {session?.title ?? result.sessionId} — {formatDate(result.completedAt)}
                          </div>
                          <div className="space-y-2">
                            {entries.map(([key, value]) => (
                              <div key={key} className="border border-gray-100 rounded-xl p-3">
                                <div className="text-xs text-gray-400 mb-1">{key.replace(/-/g, ' ')}</div>
                                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* Mark lessons complete */}
              {selectedStudent && (
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <h3 className="font-black text-gray-800 mb-1">✅ Mark Lessons Complete</h3>
                  <p className="text-xs text-gray-400 mb-4">Award completion + full stars to this student for any lesson. They'll see it as done when they next open the app.</p>
                  {([4, 5, 6, 8, 9, 10, 11] as const).map(yr => {
                    const yrSessions = (sessionsByYear[yr] ?? []).filter(s =>
                      ['english', 'maths', 'vcd'].includes(s.subject)
                    );
                    if (yrSessions.length === 0) return null;
                    return (
                      <div key={yr} className="mb-4">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                          Year {yr === 11 ? 'VCE' : yr}
                        </div>
                        <div className="space-y-1.5">
                          {yrSessions.map(session => {
                            const done = studentResults.some(r => r.sessionId === session.id);
                            const isMarking = markingSession === session.id;
                            return (
                              <div key={session.id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2">
                                <span className="text-lg">{session.icon}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-semibold text-gray-800 truncate">{session.title}</div>
                                  <div className="text-xs" style={{ color: SUBJECT_COLOR[session.subject] }}>{SUBJECT_LABEL[session.subject]}</div>
                                </div>
                                {done ? (
                                  <span className="text-xs font-bold text-green-600 flex-shrink-0">✅ Done</span>
                                ) : (
                                  <button
                                    onClick={() => markComplete(selectedStudent, session)}
                                    disabled={isMarking}
                                    className="btn-duo flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-xl text-white disabled:opacity-50" style={{ background: '#58CC02', borderBottomColor: '#46A302' }}
                                  >
                                    {isMarking ? '…' : `✅ Award ${session.starsAvailable}⭐`}
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>}
    </div>
  );
}
