import { useEffect, useState } from 'react';
import './index.css';
import { useAuthStore } from './store/authStore';
import type { GoalCategory } from './lib/supabase';
import AuthScreen from './components/AuthScreen';
import OnboardingFlow from './components/OnboardingFlow';
import HomeScreen from './components/HomeScreen';
import FriendsScreen from './components/FriendsScreen';
import DailyEgg from './components/DailyEgg';
import CategoryHub from './components/CategoryHub';

type Screen = 'home' | 'friends' | 'egg' | { category: GoalCategory };

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
  if (screen === 'egg') return <DailyEgg onClose={() => setScreen('home')} />;
  if (typeof screen === 'object' && 'category' in screen) {
    return <CategoryHub category={screen.category} onClose={() => setScreen('home')} />;
  }
  return (
    <HomeScreen
      onFriends={() => setScreen('friends')}
      onEgg={() => setScreen('egg')}
      onCategory={(c) => setScreen({ category: c })}
    />
  );
}
