import { useEffect, useState } from 'react';
import './index.css';
import { useAuthStore } from './store/authStore';
import type { GoalCategory } from './lib/supabase';
import { initRevenueCat } from './lib/revenuecat';
import AuthScreen from './components/AuthScreen';
import OnboardingFlow from './components/OnboardingFlow';
import HomeScreen from './components/HomeScreen';
import FriendsScreen from './components/FriendsScreen';
import PaymentScreen from './components/PaymentScreen';
import CategoryHub from './components/CategoryHub';
import StatsScreen from './components/StatsScreen';
import WorkoutScreen from './components/WorkoutScreen';
import DiaryScreen from './components/DiaryScreen';
import HabitsScreen from './components/HabitsScreen';

type Screen = 'home' | 'friends' | 'payment' | 'stats' | 'workout' | 'diary' | 'habits' | { category: GoalCategory };

export default function App() {
  const init = useAuthStore(s => s.init);
  const loading = useAuthStore(s => s.loading);
  const user = useAuthStore(s => s.user);
  const pet = useAuthStore(s => s.pet);
  const [screen, setScreen] = useState<Screen>('home');

  useEffect(() => { init(); }, []);
  useEffect(() => { if (user) initRevenueCat(user.id); }, [user?.id]);

  if (loading) {
    return (
      <>
        <div className="scene-bg" />
        <div className="scene-overlay" />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="bounce-loader">
            <div className="dot" /><div className="dot" /><div className="dot" />
            <div className="shadow" /><div className="shadow" /><div className="shadow" />
          </div>
        </div>
      </>
    );
  }

  if (!user) return <AuthScreen />;
  if (!pet) return <OnboardingFlow />;
  if (screen === 'friends') return <FriendsScreen onBack={() => setScreen('home')} />;
  if (screen === 'payment') return <PaymentScreen onBack={() => setScreen('home')} />;
  if (screen === 'stats') return <StatsScreen onBack={() => setScreen('home')} />;
  if (screen === 'workout') return <WorkoutScreen onClose={() => setScreen('home')} />;
  if (screen === 'diary') return <DiaryScreen onClose={() => setScreen('home')} />;
  if (screen === 'habits') return (
    <HabitsScreen
      onClose={() => setScreen('home')}
      onWorkout={() => setScreen('workout')}
      onJournal={() => setScreen('diary')}
    />
  );
  if (typeof screen === 'object' && 'category' in screen) {
    return <CategoryHub category={screen.category} onClose={() => setScreen('home')} />;
  }
  return (
    <HomeScreen
      onFriends={() => setScreen('friends')}
      onPayment={() => setScreen('payment')}
      onStats={() => setScreen('stats')}
      onCategory={(c) => setScreen({ category: c })}
      onWorkout={() => setScreen('workout')}
      onDiary={() => setScreen('diary')}
      onHabits={() => setScreen('habits')}
    />
  );
}
