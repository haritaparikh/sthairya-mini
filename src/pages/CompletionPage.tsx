import { Flame, Star, ArrowRight } from 'lucide-react';

type Props = {
  postFeeling: string;
  streakCount: number;
  onGoHome: () => void;
};

const FEELINGS = [
  { label: 'Better',            emoji: '😊' },
  { label: 'Calm',              emoji: '🌿' },
  { label: 'Energized',         emoji: '⚡' },
  { label: 'Still tired',       emoji: '😴' },
  { label: 'Proud I showed up', emoji: '🏆' },
];

export default function CompletionPage({ postFeeling, streakCount, onGoHome }: Props) {
  const feeling = FEELINGS.find(f => f.label === postFeeling);

  return (
    <div className="min-h-screen bg-charcoal-950 flex flex-col overflow-hidden">

      {/* Ambient radial glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 right-0 h-[70vh] animate-glow-orb"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,152,15,0.10) 0%, transparent 65%)',
          }}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-14 max-w-lg mx-auto w-full text-center">

        {/* ── Flame badge ───────────────────────────── */}
        <div
          className="relative mb-8 animate-scale-in"
          style={{ animationFillMode: 'both' }}
        >
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-full bg-gold-gradient opacity-20 scale-125 blur-xl animate-breathe" />
          <div className="relative w-28 h-28 rounded-full bg-gold-gradient flex flex-col items-center justify-center shadow-gold-lg">
            <Flame size={30} className="text-charcoal-950 mb-0.5" />
            <span className="text-[10px] font-bold tracking-widest text-charcoal-900 uppercase">Day {streakCount}</span>
          </div>
        </div>

        {/* ── Main copy ─────────────────────────────── */}
        <div
          className="animate-slide-up mb-6"
          style={{ animationFillMode: 'both', animationDelay: '120ms' }}
        >
          <p className="section-label mb-4">Streak rescued</p>
          <h1 className="text-[34px] font-semibold tracking-tightest leading-snug text-charcoal-50 mb-3">
            You showed up.<br />
            <span className="gold-text">That counts.</span>
          </h1>
          <p className="text-[14px] text-charcoal-500 leading-relaxed max-w-xs mx-auto">
            Every rescued day is proof you care.<br />The habit stays alive.
          </p>
        </div>

        {/* ── Stars ─────────────────────────────────── */}
        <div
          className="flex items-center gap-2.5 mb-7 animate-fade-in"
          style={{ animationDelay: '250ms', animationFillMode: 'both' }}
        >
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={18}
              className="text-gold-400 fill-gold-400 animate-slide-up-sm"
              style={{ animationDelay: `${260 + i * 60}ms`, animationFillMode: 'both' }}
            />
          ))}
        </div>

        {/* ── Feeling card ──────────────────────────── */}
        {feeling && (
          <div
            className="glass-card px-5 py-4 w-full mb-5 animate-slide-up"
            style={{ animationDelay: '400ms', animationFillMode: 'both' }}
          >
            <p className="text-[11px] font-medium tracking-widest uppercase text-charcoal-600 mb-2.5">
              You're feeling
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl leading-none">{feeling.emoji}</span>
              <span className="text-[20px] font-semibold text-charcoal-100 tracking-tight">
                {feeling.label}
              </span>
            </div>
          </div>
        )}

        {/* ── Stat pills ────────────────────────────── */}
        <div
          className="grid grid-cols-2 gap-3 w-full mb-6 animate-slide-up"
          style={{ animationDelay: '470ms', animationFillMode: 'both' }}
        >
          <div className="glass-card p-4 text-center">
            <p className="text-[28px] font-semibold gold-text tracking-tightest leading-none">{streakCount}</p>
            <p className="text-[11px] text-charcoal-600 mt-1.5">Days rescued</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-[28px] font-semibold gold-text tracking-tightest leading-none">100%</p>
            <p className="text-[11px] text-charcoal-600 mt-1.5">Showed up</p>
          </div>
        </div>

        {/* ── Affirmation ───────────────────────────── */}
        <div
          className="w-full border border-charcoal-800/60 rounded-2xl px-5 py-4 mb-7 animate-fade-in"
          style={{ animationDelay: '540ms', animationFillMode: 'both' }}
        >
          <p className="text-[13px] text-charcoal-400 italic leading-relaxed">
            "Consistency isn't about being perfect. It's about choosing to try again."
          </p>
        </div>

        {/* ── CTA ───────────────────────────────────── */}
        <button
          onClick={onGoHome}
          className="btn-gold w-full flex items-center justify-center gap-2.5 animate-slide-up"
          style={{ animationDelay: '600ms', animationFillMode: 'both' }}
        >
          Back to Home
          <ArrowRight size={17} />
        </button>

      </div>
    </div>
  );
}
