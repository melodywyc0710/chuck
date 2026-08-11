import { useEffect, useState } from 'react';
import './index.css';
import { useAuthStore } from './store/authStore';
import { initRevenueCat } from './lib/revenuecat';
import type { Habit } from './lib/habitTypes';
import AuthScreen from './components/AuthScreen';
import OnboardingFlow from './components/OnboardingFlow';
import HomeScreen from './components/HomeScreen';
import FriendsScreen from './components/FriendsScreen';
import PaymentScreen from './components/PaymentScreen';
import StatsScreen from './components/StatsScreen';
import WorkoutScreen from './components/WorkoutScreen';
import DiaryScreen from './components/DiaryScreen';
import HabitDetailScreen from './components/HabitDetailScreen';

type Screen = 'home' | 'friends' | 'payment' | 'stats' | 'workout' | 'diary' | { habit: Habit };

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
  if (typeof screen === 'object' && 'habit' in screen) {
    if (screen.habit.tracking_type === 'workout') {
      return <WorkoutScreen onClose={() => setScreen('home')} />;
    }
    if (screen.habit.tracking_type === 'journal') {
      return <DiaryScreen onClose={() => setScreen('home')} />;
    }
    return (
      <HabitDetailScreen
        habit={screen.habit}
        onBack={() => setScreen('home')}
        onWorkout={() => setScreen('workout')}
        onJournal={() => setScreen('diary')}
      />
    );
  }
  return (
    <HomeScreen
      onFriends={() => setScreen('friends')}
      onPayment={() => setScreen('payment')}
      onStats={() => setScreen('stats')}
      onHabit={(habit) => setScreen({ habit })}
    />
  );
}
