import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export default function AuthScreen() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

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
      if (err) setError(err);
    }
    setLoading(false);
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0e0c0a] px-6 text-center">
        <div className="text-6xl mb-6 hero-anim hero-reveal" style={{ animationDelay: '0s', opacity: 0 }}>📬</div>
        <h2 className="font-playfair italic text-3xl text-white mb-3 hero-anim hero-reveal" style={{ animationDelay: '0.15s', opacity: 0 }}>
          Check your email
        </h2>
        <p className="text-white/50 text-sm max-w-xs leading-relaxed hero-anim hero-fade" style={{ animationDelay: '0.3s', opacity: 0 }}>
          We sent a link to <span className="text-white/80">{email}</span>. Click it, then come back and sign in.
        </p>
        <button
          onClick={() => { setMode('signin'); setDone(false); }}
          className="mt-8 text-[#e8a87c] text-sm underline underline-offset-4 hero-anim hero-fade"
          style={{ animationDelay: '0.45s', opacity: 0 }}
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0e0c0a] px-6 tracking-[-0.02em]" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(200,130,80,0.12)_0%,transparent_65%)] pointer-events-none" />

      {/* Logo */}
      <div className="flex flex-col items-center mb-12 hero-anim hero-reveal" style={{ animationDelay: '0s', opacity: 0 }}>
        <div className="text-6xl mb-5">🥚</div>
        <h1 className="font-playfair italic text-white text-4xl leading-none" style={{ letterSpacing: '-0.04em' }}>
          Nagi
        </h1>
        <p className="text-white/40 text-xs mt-2 tracking-widest uppercase">your accountability companion</p>
      </div>

      {/* Tab toggle */}
      <div
        className="flex bg-white/8 border border-white/10 rounded-full p-1 mb-8 w-full max-w-xs hero-anim hero-fade"
        style={{ animationDelay: '0.2s', opacity: 0 }}
      >
        {(['signin', 'signup'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(''); }}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              mode === m
                ? 'bg-white text-[#1a1410] shadow-sm'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            {m === 'signin' ? 'Sign in' : 'Sign up'}
          </button>
        ))}
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs space-y-3 hero-anim hero-fade"
        style={{ animationDelay: '0.32s', opacity: 0 }}
      >
        {mode === 'signup' && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-4 py-3.5 rounded-2xl bg-white/6 border border-white/10 text-white placeholder-white/25 text-sm outline-none focus:border-[#e8a87c]/60 focus:bg-white/8 transition-all"
            autoComplete="username"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-3.5 rounded-2xl bg-white/6 border border-white/10 text-white placeholder-white/25 text-sm outline-none focus:border-[#e8a87c]/60 focus:bg-white/8 transition-all"
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-3.5 rounded-2xl bg-white/6 border border-white/10 text-white placeholder-white/25 text-sm outline-none focus:border-[#e8a87c]/60 focus:bg-white/8 transition-all"
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
        />

        {error && (
          <p className="text-red-400/80 text-xs text-center px-2 pt-1">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 mt-1 rounded-2xl bg-[#e8702a] hover:bg-[#d2611f] text-white font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-[#e8702a]/25 disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? '…' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <p className="text-white/20 text-xs mt-10 text-center max-w-xs leading-relaxed hero-anim hero-fade" style={{ animationDelay: '0.5s', opacity: 0 }}>
        By continuing you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
}
