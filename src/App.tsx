import { useEffect } from 'react';
import './index.css';
import { useAuthStore } from './store/authStore';
import AuthScreen from './components/AuthScreen';
import OnboardingFlow from './components/OnboardingFlow';
import HomeScreen from './components/HomeScreen';

export default function App() {
  const init = useAuthStore(s => s.init);
  const loading = useAuthStore(s => s.loading);
  const user = useAuthStore(s => s.user);
  const pet = useAuthStore(s => s.pet);

  useEffect(() => { init(); }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf6ee]">
        <div className="text-5xl animate-pulse">🥚</div>
      </div>
    );
  }

  if (!user) return <AuthScreen />;
  if (!pet) return <OnboardingFlow />;
  return <HomeScreen />;
}
