import { useAppStore } from '../store/appStore';
import { getSession } from '../data/curriculum/index';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-AU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

const SUBJECT_LABEL: Record<string, string> = { english: 'English', maths: 'Maths', science: 'Science', hass: 'HASS' };

export default function TeacherDashboard() {
  const { profile, sessionResults, totalStars, currentStreak, setView, previewFeedback } = useAppStore();
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
              { label: 'Lessons Done', value: String(sessionResults.length) },
              { label: 'Week Streak', value: `${currentStreak} 🔥` },
              { label: 'Total Stars', value: String(totalStars) },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-gray-400 font-semibold">{item.label}</div>
                <div className="font-black text-gray-800 mt-0.5">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Parent reports for each completed session */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-black text-gray-800 mb-1">📋 Parent Reports</h3>
          <p className="text-xs text-gray-400 mb-4">Tap "View Report" to open the full bilingual report — copy and paste to send to parents.</p>

          {sessionResults.length === 0 ? (
            <p className="text-gray-400 text-sm">No lessons completed yet.</p>
          ) : (
            <div className="space-y-3">
              {[...sessionResults].reverse().map(result => {
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

        {/* Student writing samples */}
        {sessionResults.some(r => Object.keys(r.freeResponses ?? {}).length > 0) && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-black text-gray-800 mb-4">✏️ Student Written Responses</h3>
            <div className="space-y-5">
              {sessionResults.map(result => {
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

        {/* Curriculum alignment */}
        {sessionResults.length > 0 && (
          <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
            <h3 className="font-black text-indigo-800 mb-3">📋 Victorian Curriculum Coverage</h3>
            <div className="space-y-2">
              {sessionResults.map(result => {
                const session = getSession(result.sessionId);
                if (!session) return null;
                return (
                  <div key={result.sessionId} className="flex items-start gap-2">
                    <span>{session.icon}</span>
                    <div>
                      <span className="font-bold text-indigo-800 text-xs">{session.victorianCode}</span>
                      <span className="text-indigo-600 text-xs"> — {session.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <button
          onClick={() => { if (confirm('Reset all student data?')) { useAppStore.getState().reset(); setView('setup'); } }}
          className="text-xs text-gray-400 hover:text-red-400 underline transition-colors"
        >
          Reset student data (new student)
        </button>
      </div>
    </div>
  );
}
