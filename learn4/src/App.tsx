import { useEffect } from 'react';
import './index.css';
import { useAppStore } from './store/appStore';
import { supabase } from './lib/supabase';
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

export default function App() {
  const { view, setView, activeSessionId, userId, setUserId, loadStudentData } = useAppStore();

  useEffect(() => {
    // Check existing session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return;
      const profile = await fetchProfile(session.user.id);
      if (!profile) return;
      setUserId(session.user.id, profile.role);
      if (profile.role === 'student') {
        await loadStudentData(session.user.id);
        // Only navigate to home if profile exists (name set), else setup
        if (profile.name) {
          setView('home');
        }
      } else {
        setView('teacher');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session?.user) {
        setUserId(null, null);
        setView('setup');
        return;
      }
      if (event === 'SIGNED_IN') {
        const profile = await fetchProfile(session.user.id);
        if (!profile) return;
        setUserId(session.user.id, profile.role);
        if (profile.role === 'student') {
          await loadStudentData(session.user.id);
          setView('home');
        } else {
          setView('teacher');
        }
      }
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auth gate
  if (userId === null) {
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
