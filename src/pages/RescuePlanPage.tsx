import { useState } from 'react';
import { Play, CheckCircle2, Clock3, Sparkles } from 'lucide-react';
import type { RescuePlan } from '../lib/supabase';

type Props = {
  plan: RescuePlan;
  onComplete: (postFeeling: string) => void;
};

const POST_FEELINGS = [
  { label: 'Better',           emoji: '😊' },
  { label: 'Calm',             emoji: '🌿' },
  { label: 'Energized',        emoji: '⚡' },
  { label: 'Still tired',      emoji: '😴' },
  { label: 'Proud I showed up',emoji: '🏆' },
];

export default function RescuePlanPage({ plan, onComplete }: Props) {
  const [started, setStarted]             = useState(false);
  const [completedSteps, setCompleted]    = useState<Set<number>>(new Set());
  const [postFeeling, setPostFeeling]     = useState('');

  const toggle = (i: number) =>
    setCompleted(prev => {
      const n = new Set(prev);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });

  const allDone   = started && completedSteps.size === plan.steps.length;
  const progress  = plan.steps.length > 0 ? completedSteps.size / plan.steps.length : 0;

  return (
    <div className="page-container">
      <div className="page-inner">

        {/* ── Duration badge ────────────────────────── */}
        <div
          className="pt-10 mb-6 flex items-center gap-3 animate-fade-in"
          style={{ animationFillMode: 'both' }}
        >
          <div className="badge-gold">
            <Clock3 size={11} />
            {plan.duration_minutes} min rescue
          </div>
          {started && (
            <div className="flex-1 h-0.5 rounded-full bg-charcoal-800 overflow-hidden">
              <div
                className="h-full bg-gold-gradient rounded-full transition-all duration-700"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* ── Title & motivational message ──────────── */}
        <div
          className="mb-7 animate-slide-up"
          style={{ animationFillMode: 'both', animationDelay: '60ms' }}
        >
          <h1 className="heading-md mb-4">{plan.title}</h1>
          <div className="glass-card px-5 py-4">
            <div className="flex items-start gap-3">
              <Sparkles size={14} className="text-gold-500 shrink-0 mt-0.5" />
              <p className="text-[14px] text-charcoal-300 leading-relaxed italic">
                {plan.motivational_message}
              </p>
            </div>
          </div>
        </div>

        {/* ── Steps ─────────────────────────────────── */}
        <div className="mb-7">
          <p className="section-label mb-4">Your plan</p>
          <div className="space-y-2.5">
            {plan.steps.map((step, i) => {
              const done = completedSteps.has(i);
              return (
                <button
                  key={i}
                  onClick={() => { if (started) toggle(i); }}
                  className={[
                    'w-full text-left rounded-2xl border px-4 py-4 flex items-start gap-3.5',
                    'transition-all duration-250',
                    'animate-slide-up',
                    started ? 'cursor-pointer' : 'cursor-default',
                    done
                      ? 'border-gold-700/30 bg-gold-950/20'
                      : 'border-charcoal-700/40 bg-charcoal-800/20 hover:border-charcoal-600/50',
                  ].join(' ')}
                  style={{ animationDelay: `${80 + i * 50}ms`, animationFillMode: 'both' }}
                >
                  {/* Checkbox */}
                  <div className={[
                    'mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0',
                    'transition-all duration-300',
                    done
                      ? 'bg-gold-500 border-gold-500 scale-110'
                      : 'border-charcoal-600',
                  ].join(' ')}>
                    {done && <CheckCircle2 size={11} className="text-charcoal-950" />}
                  </div>

                  <div className="min-w-0">
                    <span className="text-[10px] font-bold tracking-widest text-gold-700 uppercase">
                      Step {i + 1}
                    </span>
                    <p className={[
                      'text-[13px] mt-0.5 leading-relaxed transition-colors duration-200',
                      done ? 'text-charcoal-600 line-through' : 'text-charcoal-200',
                    ].join(' ')}>
                      {step}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Progress counter (active, not all done) ── */}
        {started && !allDone && (
          <div className="glass-card px-5 py-4 mb-6 animate-fade-in-fast">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-charcoal-500">Progress</span>
              <span className="text-[12px] font-semibold text-gold-400">
                {completedSteps.size} / {plan.steps.length}
              </span>
            </div>
            <div className="h-1 rounded-full bg-charcoal-800 overflow-hidden">
              <div
                className="h-full bg-gold-gradient rounded-full transition-all duration-700"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* ── Post-completion feeling ────────────────── */}
        {allDone && (
          <div className="animate-slide-up mb-5">
            <div className="divider" />
            <p className="section-label mb-4">How do you feel now?</p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {POST_FEELINGS.map(f => (
                <button
                  key={f.label}
                  onClick={() => setPostFeeling(f.label)}
                  className={postFeeling === f.label ? 'chip-selected' : 'chip-default'}
                >
                  <span className="mr-2 text-base leading-none">{f.emoji}</span>
                  {f.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => { if (postFeeling) onComplete(postFeeling); }}
              disabled={!postFeeling}
              className="btn-gold w-full flex items-center justify-center gap-2.5 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-gold"
            >
              Complete Plan
              <CheckCircle2 size={17} />
            </button>
          </div>
        )}

        {/* ── Start CTA ─────────────────────────────── */}
        {!started && (
          <div className="pb-4 animate-slide-up" style={{ animationFillMode: 'both', animationDelay: `${80 + plan.steps.length * 50}ms` }}>
            <button
              onClick={() => setStarted(true)}
              className="btn-gold w-full flex items-center justify-center gap-2.5"
            >
              <Play size={16} className="fill-charcoal-950" />
              Start Plan
            </button>
            <p className="text-center text-[12px] text-charcoal-600 mt-3">
              Tap each step to mark it complete
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export { POST_FEELINGS };
