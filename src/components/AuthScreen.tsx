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
      if (err) { setError(err); }
    }
    setLoading(false);
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdf6ee] px-6 text-center">
        <div className="text-6xl mb-4">📬</div>
        <h2 className="text-xl font-semibold text-[#4a3728] mb-2">Check your email</h2>
        <p className="text-[#7a6255] text-sm max-w-xs">
          We sent a confirmation link to <strong>{email}</strong>. Click it, then come back and sign in.
        </p>
        <button
          onClick={() => { setMode('signin'); setDone(false); }}
          className="mt-6 text-[#c07850] text-sm underline"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdf6ee] px-6">
      {/* Logo area */}
      <div className="mb-8 text-center">
        <div className="text-7xl mb-3">🥚</div>
        <h1 className="text-2xl font-bold text-[#4a3728] tracking-wide">Nagi</h1>
        <p className="text-[#9a8070] text-sm mt-1">your accountability companion</p>
      </div>

      {/* Tab toggle */}
      <div className="flex bg-[#ede3d8] rounded-full p-1 mb-6 w-full max-w-xs">
        {(['signin', 'signup'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(''); }}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
              mode === m
                ? 'bg-white text-[#4a3728] shadow-sm'
                : 'text-[#9a8070]'
            }`}
          >
            {m === 'signin' ? 'Sign in' : 'Sign up'}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-3">
        {mode === 'signup' && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-white border border-[#e8ddd3] text-[#4a3728] placeholder-[#bca99a] text-sm outline-none focus:border-[#c07850]"
            autoComplete="username"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl bg-white border border-[#e8ddd3] text-[#4a3728] placeholder-[#bca99a] text-sm outline-none focus:border-[#c07850]"
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl bg-white border border-[#e8ddd3] text-[#4a3728] placeholder-[#bca99a] text-sm outline-none focus:border-[#c07850]"
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
        />

        {error && (
          <p className="text-red-400 text-xs text-center px-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-2xl bg-[#c07850] text-white font-semibold text-sm shadow-md active:scale-95 transition-transform disabled:opacity-60"
        >
          {loading ? '...' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <p className="text-[#bca99a] text-xs mt-8 text-center max-w-xs">
        By continuing you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
}
