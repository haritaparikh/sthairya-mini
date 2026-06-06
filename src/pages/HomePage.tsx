import { useEffect, useState } from 'react';
import { Flame, ChevronRight, LogOut, Leaf } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { RescuePlan } from '../lib/supabase';

type Props = { onRescue: () => void };

const TIME_GREETINGS: Record<number, string> = {
  5:  'Good morning.',
  12: 'Good afternoon.',
  17: 'Good evening.',
  21: 'Quiet time.',
};

function greeting() {
  const h = new Date().getHours();
  if (h < 5)  return 'Still up?';
  if (h < 12) return 'Good morning.';
  if (h < 17) return 'Good afternoon.';
  if (h < 21) return 'Good evening.';
  return 'Quiet time.';
}

// keep TS happy
void TIME_GREETINGS;

export default function HomePage({ onRescue }: Props) {
  const { user, signOut } = useAuth();
  const [lastPlan, setLastPlan]     = useState<RescuePlan | null>(null);
  const [totalRescued, setTotal]    = useState(0);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase
        .from('rescue_plans').select('*')
        .eq('completed', true)
        .order('created_at', { ascending: false })
        .limit(1).maybeSingle(),
      supabase
        .from('rescue_plans').select('id', { count: 'exact', head: true })
        .eq('completed', true),
    ])
      .then(([last, count]) => {
        setLastPlan(last.data ?? null);
        setTotal(count.count ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const initial = (user?.email?.[0] ?? 'U').toUpperCase();

  return (
    <div className="page-container">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="bg-orb-top-right animate-glow-orb" />
      </div>

      <div className="relative z-10 page-inner">

        {/* ── Header ───────────────────────────────── */}
        <header className="flex items-center justify-between pt-10 pb-7">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold-gradient flex items-center justify-center shadow-gold-sm text-[15px] font-bold text-charcoal-950">
              {initial}
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-widest uppercase text-charcoal-600">Sthairya Mini</p>
              <p className="text-[14px] font-medium text-charcoal-200 mt-0.5">{greeting()}</p>
            </div>
          </div>
          <button onClick={signOut} className="btn-icon" aria-label="Sign out">
            <LogOut size={15} />
          </button>
        </header>

        {/* ── Hero card ─────────────────────────────── */}
        <div
          className="glass-card p-6 mb-5 animate-fade-in"
          style={{ animationFillMode: 'both' }}
        >
          {/* Inner glow orb */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/5 rounded-full blur-2xl translate-x-1/2 -translate-y-1/3 pointer-events-none" />

          <div className="relative">
            <p className="section-label mb-4">Today's rescue</p>
            <h2 className="text-[22px] font-semibold tracking-tight leading-snug text-charcoal-50 mb-1.5">
              Rescue your habit<br />
              <span className="gold-text">in 5 minutes.</span>
            </h2>
            <p className="text-[13px] text-charcoal-500 mb-6 leading-relaxed">
              You are safe. Just restart gently.
            </p>
            <button
              onClick={onRescue}
              className="btn-gold inline-flex items-center gap-2 text-[14px] px-5 py-3"
            >
              <Flame size={14} />
              Start Rescue
            </button>
          </div>
        </div>

        {/* ── Stats ─────────────────────────────────── */}
        {!loading && (
          <div
            className="grid grid-cols-2 gap-3 mb-5 animate-slide-up"
            style={{ animationFillMode: 'both', animationDelay: '80ms' }}
          >
            <StatMini value={String(totalRescued)} label="Habits rescued" />
            <StatMini
              value={lastPlan ? `${lastPlan.duration_minutes}m` : '—'}
              label="Last session"
            />
          </div>
        )}

        {/* ── Last rescue ───────────────────────────── */}
        {!loading && lastPlan && (
          <div
            className="mb-5 animate-slide-up"
            style={{ animationFillMode: 'both', animationDelay: '150ms' }}
          >
            <p className="section-label mb-3">Last rescue</p>
            <div className="glass-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-charcoal-100 tracking-tight truncate mb-1">
                    {lastPlan.title}
                  </p>
                  <p className="text-[12px] text-charcoal-600">
                    {lastPlan.duration_minutes} min &nbsp;·&nbsp; {lastPlan.steps.length} steps
                  </p>
                  <span className="badge-success mt-2">✓ Completed</span>
                </div>
                <button
                  onClick={onRescue}
                  className="btn-icon shrink-0"
                  aria-label="Start new rescue"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Tip ───────────────────────────────────── */}
        <div
          className="animate-fade-in"
          style={{ animationDelay: '220ms', animationFillMode: 'both' }}
        >
          <div className="flex items-start gap-3 border border-charcoal-800/70 rounded-2xl px-4 py-4 bg-charcoal-900/20">
            <Leaf size={14} className="text-gold-600 shrink-0 mt-0.5" />
            <p className="text-[12px] text-charcoal-500 leading-relaxed">
              <span className="text-charcoal-300 font-medium">Tiny habits win. </span>
              A 2-minute session keeps the chain alive better than a skipped day.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatMini({ value, label }: { value: string; label: string }) {
  return (
    <div className="glass-card p-4">
      <p className="text-[26px] font-semibold gold-text tracking-tightest leading-none mb-1.5">{value}</p>
      <p className="text-[11px] text-charcoal-600 leading-tight">{label}</p>
    </div>
  );
}
