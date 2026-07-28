import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

export default function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const signIn = useAuthStore(s => s.signIn);
  const signUp = useAuthStore(s => s.signUp);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (mode === 'signup') {
      if (!username.trim()) { setError('Username is required'); setLoading(false); return; }
      const err = await signUp(email, password, username.trim());
      if (err) { setError(err); setLoading(false); return; }
      setDone(true);
    } else {
      const err = await signIn(email, password);
      if (err) { setError(err); }
    }
    setLoading(false);
  }

  async function handleForgot() {
    if (!email.trim()) { setError('Enter your email first'); return; }
    await supabase.auth.resetPasswordForEmail(email.trim());
    setForgotSent(true);
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
  }

  if (done) {
    return (
      <section className="min-h-screen bg-[#111] flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="text-5xl">📬</div>
          <h2 className="text-white text-xl font-semibold">Check your email</h2>
          <p className="text-white/50 text-sm leading-relaxed">
            We sent a confirmation link to <span className="text-white/80">{email}</span>. Click it, then come back to sign in.
          </p>
          <button onClick={() => { setMode('login'); setDone(false); }} className="text-sm text-white/40 underline underline-offset-4 hover:text-white/70 transition-colors mt-2">
            Back to sign in
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#111] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm flex flex-col gap-8">

        {/* Logo + heading */}
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            {/* Dot grid behind logo */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-40" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '8px 8px' }} />
            <span className="relative text-2xl">🌿</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <h1 className="text-white text-2xl font-semibold tracking-tight">
              {mode === 'login' ? 'Log in to your account' : 'Create your account'}
            </h1>
            <p className="text-white/45 text-sm">
              {mode === 'login' ? 'Welcome back! Please enter your details.' : 'Start your accountability journey.'}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="w-full flex rounded-lg p-1" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {(['signup', 'login'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className="flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200"
                style={{
                  background: mode === m ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: mode === m ? 'white' : 'rgba(255,255,255,0.4)',
                  border: mode === m ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
                }}
              >
                {m === 'signup' ? 'Sign up' : 'Log in'}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-4">
            {mode === 'signup' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-white/70 text-sm font-medium">Username</label>
                <input
                  type="text"
                  placeholder="your_username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="auth-input-wrap auth-input w-full"
                  style={{ paddingLeft: 14, paddingRight: 14 }}
                />
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="text-white/70 text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="auth-input"
                style={{ padding: '12px 14px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box' }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-white/70 text-sm font-medium">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="auth-input"
                style={{ padding: '12px 14px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Remember + forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="hidden"
                id="remember"
              />
              <div
                className="w-4 h-4 rounded flex items-center justify-center transition-all duration-200"
                style={{ background: remember ? 'white' : 'transparent', border: `1.5px solid ${remember ? 'white' : 'rgba(255,255,255,0.25)'}` }}
              >
                {remember && <svg viewBox="0 0 10 10" className="w-2.5 h-2.5"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
              </div>
              <span className="text-white/55 text-sm">Remember for 30 days</span>
            </label>
            <button
              type="button"
              onClick={handleForgot}
              className="text-sm font-medium transition-colors"
              style={{ color: '#60a5fa' }}
            >
              {forgotSent ? 'Sent!' : 'Forgot password'}
            </button>
          </div>

          {error && <p className="text-red-400/80 text-xs text-center">{error}</p>}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-[#111] transition-all active:scale-[0.98]"
              style={{ background: loading ? 'rgba(255,255,255,0.6)' : 'white' }}
            >
              {loading ? '…' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
            <button
              type="button"
              onClick={handleGoogle}
              className="w-full py-3 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-center gap-1 text-center">
          <span className="text-sm text-white/35">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          </span>
          <button
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
            className="text-sm font-medium transition-colors"
            style={{ color: '#60a5fa' }}
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </div>

      </div>
    </section>
  );
}
