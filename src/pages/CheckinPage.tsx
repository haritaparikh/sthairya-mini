import { useState } from 'react';
import { ChevronRight, Loader2 } from 'lucide-react';

type CheckinData = { mood: string; timeAvailable: string; rescueGoal: string };
type Props = { onGenerate: (data: CheckinData) => void; loading?: boolean };

const MOODS = [
  { label: 'Low energy',     emoji: '🪫' },
  { label: 'Stressed',       emoji: '😤' },
  { label: 'Busy',           emoji: '⏳' },
  { label: 'Travelling',     emoji: '✈️' },
  { label: 'Sore body',      emoji: '💪' },
  { label: 'Missed workout', emoji: '❌' },
  { label: 'Feeling guilty', emoji: '😔' },
  { label: 'Good and ready', emoji: '✨' },
];

const TIMES = ['2 minutes', '5 minutes', '10 minutes', '20 minutes'];

const GOALS = [
  { label: 'Fitness',      emoji: '🏋️' },
  { label: 'Meditation',   emoji: '🧘' },
  { label: 'Weight loss',  emoji: '🔥' },
  { label: 'Strength',     emoji: '💪' },
  { label: 'Flexibility',  emoji: '🤸' },
  { label: 'Mental calm',  emoji: '🌊' },
];

export default function CheckinPage({ onGenerate, loading = false }: Props) {
  const [mood, setMood] = useState('');
  const [time, setTime] = useState('');
  const [goal, setGoal] = useState('');

  const answered = [mood, time, goal].filter(Boolean).length;
  const canSubmit = answered === 3;

  return (
    <div className="page-container">
      <div className="page-inner">

        {/* ── Header ───────────────────────────────── */}
        <div
          className="pt-10 pb-7 animate-fade-in"
          style={{ animationFillMode: 'both' }}
        >
          <p className="section-label mb-3">Daily check-in</p>
          <h1 className="heading-lg mb-1.5">Let's rescue your day.</h1>
          <p className="text-[13px] text-charcoal-500">Three quick questions. That's all.</p>
        </div>

        {/* ── Progress bar ─────────────────────────── */}
        <div className="flex gap-2 mb-8">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-0.5 flex-1 rounded-full overflow-hidden bg-charcoal-800">
              <div
                className="h-full bg-gold-gradient transition-all duration-500 rounded-full"
                style={{ width: answered > i ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>

        {/* ── Q1 — Mood ────────────────────────────── */}
        <Question
          number="01"
          title="How are you feeling today?"
          delay={60}
        >
          <div className="grid grid-cols-2 gap-2">
            {MOODS.map(m => (
              <button
                key={m.label}
                onClick={() => setMood(m.label)}
                className={mood === m.label ? 'chip-selected' : 'chip-default'}
              >
                <span className="mr-2 text-base leading-none">{m.emoji}</span>
                {m.label}
              </button>
            ))}
          </div>
        </Question>

        {/* ── Q2 — Time ────────────────────────────── */}
        <Question
          number="02"
          title="How much time do you have?"
          delay={140}
        >
          <div className="grid grid-cols-2 gap-2">
            {TIMES.map(t => (
              <button
                key={t}
                onClick={() => setTime(t)}
                className={time === t ? 'chip-selected' : 'chip-default'}
              >
                {t}
              </button>
            ))}
          </div>
        </Question>

        {/* ── Q3 — Goal ────────────────────────────── */}
        <Question
          number="03"
          title="What do you want to rescue today?"
          delay={220}
        >
          <div className="grid grid-cols-2 gap-2">
            {GOALS.map(g => (
              <button
                key={g.label}
                onClick={() => setGoal(g.label)}
                className={goal === g.label ? 'chip-selected' : 'chip-default'}
              >
                <span className="mr-2 text-base leading-none">{g.emoji}</span>
                {g.label}
              </button>
            ))}
          </div>
        </Question>

        {/* ── CTA ──────────────────────────────────── */}
        <div
          className="pb-4 animate-slide-up"
          style={{ animationFillMode: 'both', animationDelay: '300ms' }}
        >
          <button
            onClick={() => { if (canSubmit) onGenerate({ mood, timeAvailable: time, rescueGoal: goal }); }}
            disabled={!canSubmit || loading}
            className="btn-gold w-full flex items-center justify-center gap-2.5 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-gold"
          >
            {loading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <>
                Generate My Rescue Plan
                <ChevronRight size={17} />
              </>
            )}
          </button>

          {!canSubmit && (
            <p className="text-center text-[12px] text-charcoal-600 mt-3">
              Answer all 3 questions to continue
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

function Question({
  number, title, delay = 0, children,
}: {
  number: string; title: string; delay?: number; children: React.ReactNode;
}) {
  return (
    <div
      className="mb-8 animate-slide-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-baseline gap-2.5 mb-4">
        <span className="text-[11px] font-bold tracking-widest text-gold-700">{number}</span>
        <h2 className="text-[15px] font-semibold text-charcoal-100 tracking-tight">{title}</h2>
      </div>
      {children}
    </div>
  );
}
