import './index.css';
import { useAppStore } from './store/appStore';
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
  const { view, setView, activeSessionId } = useAppStore();

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
