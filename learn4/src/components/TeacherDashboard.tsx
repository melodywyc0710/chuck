import { useEffect, useState } from 'react';
import { useAppStore } from '../store/appStore';
import { supabase } from '../lib/supabase';
import { fetchAllStudents, fetchStudentResults } from '../lib/db';
import type { DbProfile } from '../lib/db';
import type { SessionResult } from '../store/appStore';
import { getSession } from '../data/curriculum/index';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-AU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

const SUBJECT_LABEL: Record<string, string> = { english: 'English', maths: 'Maths', science: 'Science', hass: 'HASS' };

export default function TeacherDashboard() {
  const { setView, loadStudentData, setUserId, previewFeedback } = useAppStore();
  const [students, setStudents] = useState<DbProfile[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<DbProfile | null>(null);
  const [studentResults, setStudentResults] = useState<SessionResult[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);

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

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUserId(null, null);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h2 className="font-black text-gray-800">👩‍🏫 Teacher Dashboard</h2>
          <button
            onClick={handleSignOut}
            className="text-xs text-gray-500 hover:text-red-500 border border-gray-200 rounded-xl px-3 py-1.5 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 flex gap-6 flex-col md:flex-row">
        {/* Left: Student list */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <h3 className="font-black text-gray-800 mb-3 text-sm">All Students</h3>
            {loadingStudents ? (
              <div className="text-gray-400 text-sm py-4 text-center">Loading…</div>
            ) : students.length === 0 ? (
              <div className="text-gray-400 text-sm">No students yet.</div>
            ) : (
              <div className="space-y-2">
                {students.map(student => (
                  <button
                    key={student.id}
                    onClick={() => selectStudent(student)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all ${
                      selectedStudent?.id === student.id
                        ? 'bg-indigo-50 border-2 border-indigo-300'
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
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black px-5 py-2.5 rounded-2xl transition-colors"
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
                            className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
