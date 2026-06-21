import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { upsertProfile } from '../lib/db';
import { useAppStore } from '../store/appStore';

type Tab = 'login' | 'signup';

export default function AuthScreen() {
  const [tab, setTab] = useState<Tab>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { setUserId, setView } = useAppStore();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError || !data.user) {
      setError(authError?.message ?? 'Login failed');
      setLoading(false);
      return;
    }
    setLoading(false);
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError('Please enter your name'); return; }
    setLoading(true);
    setError('');
    const { data, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError || !data.user) {
      setError(authError?.message ?? 'Sign up failed');
      setLoading(false);
      return;
    }
    await upsertProfile({
      id: data.user.id,
      name: name.trim(),
      role,
      mascot: 'owl',
      density: 'younger',
      color_theme: 'purple',
      teacher_id: null,
    });
    setUserId(data.user.id, role);
    setView(role === 'teacher' ? 'teacher' : 'setup');
    setLoading(false);
  }

  return (
    <div className="min-h-screen leaf-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #58CC02, transparent)', transform: 'translate(-30%, -30%)' }} />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #1CB0F6, transparent)', transform: 'translate(30%, 30%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        className="w-full max-w-sm relative"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            className="text-7xl mb-3 inline-block"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            🌿
          </motion.div>
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">Chucky</h1>
          <p className="text-gray-500 text-sm mt-2 font-semibold">Level up your learning every day</p>
          {/* XP row */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <span className="xp-badge">⭐ Earn stars</span>
            <span className="streak-badge">🔥 Build streaks</span>
            <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-600 font-bold text-xs px-3 py-1 rounded-full border border-purple-100">🏆 Unlock rewards</span>
          </div>
        </div>

        {/* Card */}
        <div className="card p-6">
          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6 gap-1">
            {(['login', 'signup'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all ${
                  tab === t ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {t === 'login' ? 'Log in' : 'Sign up'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={tab}
              initial={{ opacity: 0, x: tab === 'login' ? -16 : 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onSubmit={tab === 'login' ? handleLogin : handleSignup}
              className="space-y-4"
            >
              {tab === 'signup' && (
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-2">Your name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="First name"
                    className="input-duo"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-duo"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-duo"
                  required
                  minLength={6}
                />
              </div>

              {tab === 'signup' && (
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-2">I am a…</label>
                  <div className="flex gap-3">
                    {(['student', 'teacher'] as const).map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`flex-1 py-3 rounded-2xl text-sm font-black border-2 transition-all ${
                          role === r
                            ? 'border-green-400 bg-green-50 text-green-700'
                            : 'border-gray-200 text-gray-400 hover:border-gray-300'
                        }`}
                        style={role === r ? { borderBottomWidth: '3px', borderBottomColor: '#46A302' } : {}}
                      >
                        {r === 'student' ? '🎒 Student' : '🍎 Teacher'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 bg-red-50 border-2 border-red-100 rounded-2xl px-4 py-3"
                >
                  <span>❌</span>
                  <p className="text-red-600 text-sm font-semibold">{error}</p>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-duo btn-green w-full py-4 text-base rounded-2xl mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    {tab === 'login' ? 'Logging in…' : 'Creating account…'}
                  </span>
                ) : tab === 'login' ? 'Log in →' : 'Create account →'}
              </button>
            </motion.form>
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6 font-medium">
          🌱 Your learning adventure awaits
        </p>
      </motion.div>
    </div>
  );
}
