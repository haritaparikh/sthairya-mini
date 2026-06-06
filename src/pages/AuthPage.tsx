import { useState } from 'react';
import { Flame, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Props = {
  onBack: () => void;
  onSuccess: () => void;
};

type Mode = 'login' | 'signup';

export default function AuthPage({ onBack, onSuccess }: Props) {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        onSuccess();
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onSuccess();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(
        message.includes('Invalid login credentials')
          ? 'Incorrect email or password.'
          : message.includes('already registered')
          ? 'This email is already registered. Sign in instead.'
          : message,
      );
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => { setMode(m => m === 'login' ? 'signup' : 'login'); setError(''); };

  return (
    <div className="min-h-screen bg-charcoal-950 flex flex-col">

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="bg-orb-top-right opacity-70 animate-glow-orb" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center gap-3 px-5 pt-8 pb-4 max-w-lg mx-auto w-full">
        <button onClick={onBack} className="btn-icon" aria-label="Back">
          <ArrowLeft size={17} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold-sm">
            <Flame size={13} className="text-charcoal-950" />
          </div>
          <span className="text-[14px] font-semibold text-charcoal-200 tracking-tight">Sthairya Mini</span>
        </div>
      </header>

      {/* Body */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-5 max-w-lg mx-auto w-full pb-10">
        <div
          className="animate-slide-up"
          style={{ animationFillMode: 'both' }}
        >
          {/* Title */}
          <div className="mb-8">
            <p className="section-label mb-3">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </p>
            <h1 className="heading-lg mb-2">
              {mode === 'login' ? 'Your streak is waiting.' : 'Start gently.'}
            </h1>
            <p className="text-[14px] text-charcoal-500">
              {mode === 'login'
                ? 'No guilt. Just show up again.'
                : 'A few seconds to begin your rescue journey.'}
            </p>
          </div>

          {/* Card */}
          <div className="glass-card p-6 mb-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="input-label">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="input-field"
                  autoComplete="email"
                  autoCapitalize="none"
                />
              </div>

              <div>
                <label className="input-label">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="input-field pr-12"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-600 hover:text-charcoal-400 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 text-[13px] text-red-300 bg-red-950/30 border border-red-800/30 rounded-2xl px-4 py-3">
                  <span className="mt-0.5 shrink-0">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-gold mt-1"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-charcoal-800/50 border-t-charcoal-950 rounded-full animate-spin-slow" />
                ) : (
                  <>
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Toggle */}
          <p className="text-center text-[13px] text-charcoal-500">
            {mode === 'login' ? "Don't have an account? " : 'Already registered? '}
            <button
              onClick={switchMode}
              className="text-gold-400 font-medium hover:text-gold-300 transition-colors duration-150 underline-offset-2 hover:underline"
            >
              {mode === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
