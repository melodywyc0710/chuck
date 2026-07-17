import { useEffect, useState } from 'react';
import './index.css';
import { useAuthStore } from './store/authStore';
import AuthScreen from './components/AuthScreen';
import OnboardingFlow from './components/OnboardingFlow';
import HomeScreen from './components/HomeScreen';
import FriendsScreen from './components/FriendsScreen';

type Screen = 'home' | 'friends';

export default function App() {
  const init = useAuthStore(s => s.init);
  const loading = useAuthStore(s => s.loading);
  const user = useAuthStore(s => s.user);
  const pet = useAuthStore(s => s.pet);
  const [screen, setScreen] = useState<Screen>('home');

  useEffect(() => { init(); }, []);

  if (loading) {
    return (
      <>
        <div className="scene-bg" />
        <div className="scene-overlay" />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-5xl animate-pulse">🥚</div>
        </div>
      </>
    );
  }

  if (!user) return <AuthScreen />;
  if (!pet) return <OnboardingFlow />;
  if (screen === 'friends') return <FriendsScreen onBack={() => setScreen('home')} />;
  return <HomeScreen onFriends={() => setScreen('friends')} />;
}
