import { useState, useRef } from 'react';
import { Timer, ArrowRight, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

function SlideToConfirm({ onConfirm, label }: { onConfirm: () => void; label: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [x, setX] = useState(0);
  const startX = useRef(0);

  function getTrackWidth() {
    return (trackRef.current?.offsetWidth ?? 300) - 52 - 8; // track - thumb - padding
  }

  function onPointerDown(e: React.PointerEvent) {
    setDragging(true);
    startX.current = e.clientX - x;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    const nx = Math.max(0, Math.min(e.clientX - startX.current, getTrackWidth()));
    setX(nx);
  }

  function onPointerUp() {
    if (!dragging) return;
    setDragging(false);
    if (x / getTrackWidth() > 0.85) {
      setX(getTrackWidth());
      setTimeout(onConfirm, 200);
    } else {
      setX(0);
    }
  }

  return (
    <div ref={trackRef} className="relative liquid-glass rounded-full h-14 flex items-center px-1 select-none">
      {/* Thumb */}
      <div
        className="absolute left-1 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md z-10 cursor-grab active:cursor-grabbing touch-none"
        style={{ transform: `translateX(${x}px)`, transition: dragging ? 'none' : 'transform 0.35s cubic-bezier(0.22,1,0.36,1)' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <ArrowRight size={18} className="text-gray-800" />
      </div>
      {/* Label */}
      <span className="flex-1 text-center text-white/60 text-sm font-medium pointer-events-none">{label}</span>
      {/* Chevrons */}
      <div className="flex items-center gap-0.5 pr-3 pointer-events-none">
        <ChevronRight size={14} className="text-white/40" />
        <ChevronRight size={14} className="text-white/50" />
        <ChevronRight size={14} className="text-white/60" />
      </div>
    </div>
  );
}

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

  async function handleSubmit() {
    setError('');
    setLoading(true);
    if (mode === 'signup') {
      if (!username.trim()) { setError('Username is required'); setLoading(false); return; }
      const err = await signUp(email, password, username.trim());
      if (err) { setError(err); setLoading(false); return; }
      setDone(true);
    } else {
      const err = await signIn(email, password);
      if (err) { setError(err); setLoading(false); return; }
    }
    setLoading(false);
  }

  if (done) {
    return (
      <>
        <div className="scene-bg" />
        <div className="scene-overlay" />
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <div className="text-6xl mb-6 fade-up" style={{ animationDelay: '0.1s' }}>📬</div>
          <h2 className="font-playfair italic text-white text-3xl mb-3 fade-up" style={{ animationDelay: '0.25s', letterSpacing: '-0.04em' }}>
            Check your email
          </h2>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs fade-up" style={{ animationDelay: '0.4s' }}>
            We sent a link to <span className="text-white/80">{email}</span>. Click it then come back to sign in.
          </p>
          <button
            onClick={() => { setMode('signin'); setDone(false); }}
            className="mt-8 text-white/50 text-sm underline underline-offset-4 hover:text-white/80 transition-colors fade-up"
            style={{ animationDelay: '0.55s' }}
          >
            Back to sign in
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="scene-bg" />
      <div className="scene-overlay" />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

        {/* Badge */}
        <div className="fade-up mb-10" style={{ animationDelay: '0.1s' }}>
          <div className="liquid-glass flex items-center gap-2 px-3 py-2.5 rounded-full">
            <Timer size={12} className="text-white/80" />
            <span className="text-white/90 text-xs font-medium">Nagi · accountability companion</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8 fade-up" style={{ animationDelay: '0.25s' }}>
          <p className="text-white/60 text-sm mb-2">Welcome back</p>
          <h1 className="font-playfair italic text-white text-4xl leading-tight" style={{ letterSpacing: '-0.04em' }}>
            {mode === 'signin' ? 'Sign in to\nyour companion' : 'Meet your\ncompanion'}
          </h1>
        </div>

        {/* Tab toggle */}
        <div className="liquid-glass rounded-full p-1 flex w-full max-w-xs mb-6 fade-up" style={{ animationDelay: '0.32s' }}>
          {(['signin', 'signup'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                mode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-white/50 hover:text-white/80'
              }`}
            >
              {m === 'signin' ? 'Sign in' : 'Sign up'}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="w-full max-w-xs space-y-2.5 mb-6 fade-up" style={{ animationDelay: '0.4s' }}>
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl text-white placeholder-white/30 text-sm outline-none transition-all liquid-glass focus:bg-white/10"
              style={{ background: 'rgba(255,255,255,0.07)' }}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3.5 rounded-2xl text-white placeholder-white/30 text-sm outline-none transition-all liquid-glass focus:bg-white/10"
            style={{ background: 'rgba(255,255,255,0.07)' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3.5 rounded-2xl text-white placeholder-white/30 text-sm outline-none transition-all liquid-glass focus:bg-white/10"
            style={{ background: 'rgba(255,255,255,0.07)' }}
          />
          {error && <p className="text-red-400/80 text-xs text-center pt-1">{error}</p>}
        </div>

        {/* Slide to confirm */}
        <div className="w-full max-w-xs fade-up" style={{ animationDelay: '0.55s' }}>
          <SlideToConfirm
            onConfirm={handleSubmit}
            label={loading ? '…' : mode === 'signin' ? 'Slide to sign in' : 'Slide to create'}
          />
        </div>

        <p className="text-white/20 text-xs mt-8 text-center max-w-xs leading-relaxed fade-up" style={{ animationDelay: '0.7s' }}>
          By continuing you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </>
  );
}
