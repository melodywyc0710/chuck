import { useEffect } from 'react';
import './index.css';
import { useAppStore } from './store/appStore';
import { supabase, supabaseConfigured } from './lib/supabase';
import { fetchProfile } from './lib/db';
import AuthScreen from './components/AuthScreen';
import Setup from './components/Setup';
import Home from './components/Home';
import LessonPlayer from './components/LessonPlayer';
import LessonFeedback from './components/LessonFeedback';
import ClassSummary from './components/ClassSummary';
import RewardsRoom from './components/RewardsRoom';
import TeacherDashboard from './components/TeacherDashboard';
import RevisionMode from './components/RevisionMode';
import GamesHub from './components/GamesHub';
import PrintableHomework from './components/PrintableHomework';

const TEACHER_EMAIL = 'anxufangchuck@gmail.com';

export default function App() {
  const { view, setView, activeSessionId, userId, setUserId, loadStudentData } = useAppStore();

  useEffect(() => {
    const isTeacherEmail = (email?: string | null) => email === TEACHER_EMAIL;

    async function handleSession(session: { user: { id: string; email?: string } } | null) {
      if (!session?.user) return;
      const role = isTeacherEmail(session.user.email) ? 'teacher' : 'student';
      let dbProfile = await fetchProfile(session.user.id);
      if (!dbProfile) {
        const localProfile = useAppStore.getState().profile;
        await supabase.from('profiles').upsert({
          id: session.user.id,
          name: localProfile?.name ?? '',
          role,
          mascot: localProfile?.mascot ?? 'owl',
          density: localProfile?.density ?? 'younger',
          color_theme: localProfile?.colorTheme ?? 'purple',
          teacher_id: null,
        });
        dbProfile = await fetchProfile(session.user.id);
        if (!dbProfile) {
          setUserId(session.user.id, role);
          if (role === 'teacher') { setView('teacher'); } else { setView('setup'); }
          return;
        }
      }
      // Always enforce teacher email → teacher role
      const effectiveRole = isTeacherEmail(session.user.email) ? 'teacher' : dbProfile.role;
      if (effectiveRole !== dbProfile.role) {
        await supabase.from('profiles').update({ role: 'teacher' }).eq('id', session.user.id);
      }
      setUserId(session.user.id, effectiveRole);
      if (effectiveRole === 'teacher') {
        setView('teacher');
      } else {
        await loadStudentData(session.user.id);
        setView(dbProfile.name ? 'home' : 'setup');
      }
    }

    // Check existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => handleSession(session));

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session?.user) {
        setUserId(null, null);
        setView('setup');
        return;
      }
      if (event === 'SIGNED_IN') {
        await handleSession(session);
      }
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auth gate
  if (userId === null) {
    if (!supabaseConfigured) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 shadow-lg max-w-sm w-full text-center space-y-4">
            <div className="text-5xl">⚙️</div>
            <h1 className="font-black text-gray-800 text-xl">Almost ready!</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              The app needs Supabase environment variables to be set in Vercel before it can load.
              Please add <code className="bg-gray-100 px-1 rounded text-xs">VITE_SUPABASE_URL</code> and <code className="bg-gray-100 px-1 rounded text-xs">VITE_SUPABASE_ANON_KEY</code> in your Vercel project settings, then redeploy.
            </p>
          </div>
        </div>
      );
    }
    return <AuthScreen />;
  }

  return (
    <>
      {view === 'setup' && <Setup />}
      {view === 'home' && <Home />}
      {view === 'lesson' && <LessonPlayer />}
      {view === 'feedback' && <LessonFeedback onContinue={() => setView('summary')} />}
      {view === 'summary' && <ClassSummary />}
      {view === 'rewards' && <RewardsRoom />}
      {view === 'teacher' && <TeacherDashboard />}
      {view === 'revision' && <RevisionMode />}
      {view === 'games' && <GamesHub />}
      {view === 'homework' && <PrintableHomework sessionId={activeSessionId ?? ''} />}
    </>
  );
}
