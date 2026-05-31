import { useAppStore } from '../store/appStore';
import { englishSession } from '../data/english-session';
import { mathsSession } from '../data/maths-session';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-AU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function TeacherDashboard() {
  const { profile, sessionResults, completedSessions, totalStars, currentAnswers, setView } = useAppStore();
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => setView('home')} className="text-gray-400 hover:text-gray-600 text-sm">← Student View</button>
          <h2 className="font-black text-gray-800">👩‍🏫 Teacher Dashboard</h2>
          <div className="text-xs text-gray-400">Learn4</div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Student overview */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-black text-gray-800 mb-4">👤 Student Profile</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Name', value: profile.name },
              { label: 'Year Level', value: '4' },
              { label: 'Lesson Style', value: profile.density === 'younger' ? 'Easier' : 'Standard' },
              { label: 'Total Stars', value: String(totalStars) },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-gray-400 font-semibold">{item.label}</div>
                <div className="font-black text-gray-800 mt-0.5">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress overview */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-black text-gray-800 mb-4">📊 Session Progress</h3>
          {[englishSession, mathsSession].map(session => {
            const done = completedSessions.includes(session.id);
            const result = sessionResults.find(r => r.sessionId === session.id);
            const pct = result && result.total > 0 ? Math.round((result.score / result.total) * 100) : null;
            return (
              <div key={session.id} className="mb-4 last:mb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{session.icon}</span>
                    <div>
                      <div className="font-bold text-gray-800 text-sm">{session.title}</div>
                      <div className="text-xs text-gray-400">{session.victorianCode}</div>
                    </div>
                  </div>
                  <div className={`text-xs font-bold px-2 py-1 rounded-full ${done ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {done ? '✓ Complete' : 'Not started'}
                  </div>
                </div>
                {result && (
                  <div className="bg-gray-50 rounded-xl p-3 text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quiz score:</span>
                      <span className="font-bold" style={{ color: (pct ?? 0) >= 70 ? '#10b981' : '#f59e0b' }}>
                        {result.score}/{result.total} ({pct}%)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stars earned:</span>
                      <span className="font-bold text-yellow-600">⭐ {result.starsEarned}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-bold text-gray-700">{formatDate(result.completedAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Homework set:</span>
                      <span className="font-bold text-gray-700">{result.homeworkSet ? '✓ Yes' : 'No'}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Student writing samples */}
        {Object.keys(currentAnswers).length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-black text-gray-800 mb-4">✏️ Student Responses</h3>
            <div className="space-y-4">
              {Object.entries(currentAnswers)
                .filter(([, v]) => typeof v === 'string' && v.length > 5)
                .map(([key, value]) => (
                  <div key={key} className="border border-gray-100 rounded-xl p-4">
                    <div className="text-xs text-gray-400 font-semibold uppercase mb-2">{key.replace(/-/g, ' ')}</div>
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{String(value)}</p>
                    <div className="text-xs text-gray-400 mt-2">
                      {String(value).split(/\s+/).filter(Boolean).length} words
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Homework tracking */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-black text-gray-800 mb-4">🏠 Homework Tracking</h3>
          {sessionResults.length === 0 ? (
            <p className="text-gray-400 text-sm">No sessions completed yet.</p>
          ) : (
            sessionResults.map(result => {
              const session = result.subject === 'english' ? englishSession : mathsSession;
              const hwStep = session.steps.find(s => s.type === 'homework') as any;
              return hwStep ? (
                <div key={result.sessionId} className="mb-4">
                  <div className="font-bold text-gray-700 text-sm mb-2">{session.title}</div>
                  <div className="space-y-1">
                    {hwStep.tasks.map((task: any) => (
                      <div key={task.id} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-gray-300">□</span>
                        <span>{task.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;
            })
          )}
        </div>

        {/* Curriculum alignment */}
        <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
          <h3 className="font-black text-indigo-800 mb-3">📋 Victorian Curriculum Alignment</h3>
          <div className="space-y-3">
            {[englishSession, mathsSession].map(session => (
              <div key={session.id}>
                <div className="flex items-center gap-2 mb-1">
                  <span>{session.icon}</span>
                  <span className="font-bold text-indigo-800 text-sm">{session.victorianCode}</span>
                </div>
                <p className="text-indigo-700 text-xs">{session.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={() => { if (confirm('Reset all student data?')) useAppStore.getState().reset(); setView('setup'); }}
          className="text-xs text-gray-400 hover:text-red-400 underline transition-colors"
        >
          Reset student data (new student)
        </button>
      </div>
    </div>
  );
}
