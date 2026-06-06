import { useCallback, useEffect, useState } from 'react';
import { Flame, TrendingUp, Clock, Zap, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Checkin, RescuePlan } from '../lib/supabase';

type DashboardStats = {
  totalRescued: number;
  consistencyScore: number;
  totalMinutes: number;
  mostCommonObstacle: string;
  recentCheckins: (Checkin & { plan?: RescuePlan })[];
};

const GOAL_EMOJI: Record<string, string> = {
  Fitness: '🏋️', Meditation: '🧘', 'Weight loss': '🔥',
  Strength: '💪', Flexibility: '🤸', 'Mental calm': '🌊',
};
const MOOD_EMOJI: Record<string, string> = {
  'Low energy': '🪫', Stressed: '😤', Busy: '⏳', Travelling: '✈️',
  'Sore body': '💪', 'Missed workout': '❌', 'Feeling guilty': '😔', 'Good and ready': '✨',
};

function localDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export default function DashboardPage({ onRescue }: { onRescue: () => void }) {
  const { user } = useAuth();
  const [stats,   setStats]   = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const loadStats = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [checkinsRes, plansRes, allPlansRes] = await Promise.all([
        supabase.from('checkins').select('*').order('created_at', { ascending: false }).limit(20),
        supabase.from('rescue_plans').select('*').eq('completed', true),
        supabase.from('rescue_plans').select('*').order('created_at', { ascending: false }).limit(20),
      ]);
      if (checkinsRes.error) throw checkinsRes.error;
      if (plansRes.error)    throw plansRes.error;
      if (allPlansRes.error) throw allPlansRes.error;

      const checkins: Checkin[]          = checkinsRes.data ?? [];
      const completedPlans: RescuePlan[] = plansRes.data ?? [];

      const totalRescued  = completedPlans.length;
      const totalMinutes  = completedPlans.reduce((s, p) => s + p.duration_minutes, 0);

      const now = new Date();
      let activeDays = 0;
      for (let d = 0; d < 7; d++) {
        const day = new Date(now); day.setDate(now.getDate() - d);
        if (completedPlans.some(p => localDateStr(new Date(p.created_at)) === localDateStr(day))) activeDays++;
      }
      const consistencyScore = Math.round((activeDays / 7) * 100);

      const moodCount: Record<string, number> = {};
      checkins.forEach(c => { moodCount[c.mood] = (moodCount[c.mood] ?? 0) + 1; });
      const mostCommonObstacle = Object.entries(moodCount).sort((a, b) => b[1]-a[1])[0]?.[0] ?? '—';

      const planMap = new Map<string, RescuePlan>();
      (allPlansRes.data ?? []).forEach((p: RescuePlan) => { if (p.checkin_id) planMap.set(p.checkin_id, p); });

      setStats({
        totalRescued, consistencyScore, totalMinutes, mostCommonObstacle,
        recentCheckins: checkins.slice(0, 5).map(c => ({ ...c, plan: planMap.get(c.id) })),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (user) loadStats(); }, [user, loadStats]);

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal-950 flex items-center justify-center">
        <div className="w-7 h-7 border-2 border-charcoal-800 border-t-gold-500 rounded-full animate-spin-slow" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-charcoal-950 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-[13px] text-charcoal-500">{error}</p>
        <button onClick={loadStats} className="btn-ghost text-[13px] px-5 py-2.5">Retry</button>
      </div>
    );
  }

  const isEmpty = !stats || stats.totalRescued === 0;

  return (
    <div className="page-container">
      <div className="page-inner">

        {/* ── Header ───────────────────────────────── */}
        <div className="page-header animate-fade-in" style={{ animationFillMode: 'both' }}>
          <p className="section-label mb-2">Your progress</p>
          <h1 className="heading-lg">Dashboard</h1>
        </div>

        {isEmpty ? (
          <EmptyState onRescue={onRescue} />
        ) : (
          <>
            {/* ── Stats grid ─────────────────────────── */}
            <div className="grid grid-cols-2 gap-3 mb-7">
              <BigStatCard
                icon={Flame}
                value={String(stats.totalRescued)}
                label="Days rescued"
                accent
                delay={0}
              />
              <BigStatCard
                icon={TrendingUp}
                value={`${stats.consistencyScore}%`}
                label="7-day streak"
                delay={60}
              />
              <BigStatCard
                icon={Clock}
                value={String(stats.totalMinutes)}
                label="Min rescued"
                delay={120}
              />
              <BigStatCard
                icon={Zap}
                value={MOOD_EMOJI[stats.mostCommonObstacle] ?? '🎯'}
                label={stats.mostCommonObstacle === '—' ? 'Top obstacle' : stats.mostCommonObstacle}
                isEmoji
                delay={180}
              />
            </div>

            {/* ── Weekly activity ────────────────────── */}
            <WeeklyBar completedPlans={stats.recentCheckins.flatMap(c => c.plan ? [c.plan] : [])} />

            {/* ── Recent check-ins ───────────────────── */}
            <div
              className="animate-slide-up"
              style={{ animationDelay: '260ms', animationFillMode: 'both' }}
            >
              <p className="section-label mb-4">Recent check-ins</p>
              <div className="space-y-2.5">
                {stats.recentCheckins.map((c, i) => (
                  <div
                    key={c.id}
                    className="glass-card p-4 flex items-center justify-between animate-slide-up"
                    style={{ animationDelay: `${280 + i * 50}ms`, animationFillMode: 'both' }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-charcoal-800 flex items-center justify-center text-base shrink-0">
                        {GOAL_EMOJI[c.rescue_goal] ?? '🎯'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-charcoal-100 tracking-tight truncate">{c.rescue_goal}</p>
                        <p className="text-[11px] text-charcoal-600 mt-0.5 truncate">
                          {MOOD_EMOJI[c.mood]} {c.mood} &nbsp;·&nbsp; {c.time_available}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      {c.plan?.completed
                        ? <span className="badge-gold">✓ Rescued</span>
                        : <span className="text-[11px] text-charcoal-700">—</span>}
                      <p className="text-[10px] text-charcoal-700 mt-1.5">{formatDate(c.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function BigStatCard({
  icon: Icon, value, label, accent = false, delay = 0, isEmoji = false,
}: {
  icon: React.ElementType; value: string; label: string;
  accent?: boolean; delay?: number; isEmoji?: boolean;
}) {
  return (
    <div
      className="glass-card p-5 animate-slide-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="mb-3">
        <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${accent ? 'bg-gold-gradient shadow-gold-sm' : 'bg-charcoal-800'}`}>
          <Icon size={13} className={accent ? 'text-charcoal-950' : 'text-gold-500'} />
        </div>
      </div>
      <p className={`text-[28px] font-semibold tracking-tightest leading-none mb-1.5 ${isEmoji ? '' : 'gold-text'}`}>
        {value}
      </p>
      <p className="text-[11px] text-charcoal-600 leading-tight">{label}</p>
    </div>
  );
}

function WeeklyBar({ completedPlans }: { completedPlans: RescuePlan[] }) {
  const days = ['M','T','W','T','F','S','S'];
  const now = new Date();
  const dow = (now.getDay() + 6) % 7; // 0 = Mon

  return (
    <div
      className="glass-card p-5 mb-6 animate-slide-up"
      style={{ animationDelay: '220ms', animationFillMode: 'both' }}
    >
      <p className="section-label mb-4">This week</p>
      <div className="flex gap-2">
        {days.map((d, i) => {
          const offset = (dow - i + 7) % 7;
          const date = new Date(now);
          date.setDate(now.getDate() - offset);
          const str = localDateStr(date);
          const active = completedPlans.some(p => localDateStr(new Date(p.created_at)) === str);
          const isToday = i === dow;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div className={[
                'w-full aspect-square rounded-xl flex items-center justify-center transition-all',
                active
                  ? 'bg-gold-gradient shadow-gold-sm scale-105'
                  : isToday
                  ? 'bg-charcoal-800 border border-gold-700/30'
                  : 'bg-charcoal-800/50',
              ].join(' ')}>
                {active && <Flame size={10} className="text-charcoal-950" />}
              </div>
              <span className={`text-[9px] font-medium ${isToday ? 'text-gold-500' : 'text-charcoal-700'}`}>
                {d}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EmptyState({ onRescue }: { onRescue: () => void }) {
  return (
    <div className="text-center py-16 animate-fade-in" style={{ animationFillMode: 'both' }}>
      <div className="w-20 h-20 rounded-3xl bg-charcoal-800/50 border border-charcoal-700/40 flex items-center justify-center mx-auto mb-6">
        <Flame size={30} className="text-charcoal-700" />
      </div>
      <h2 className="text-[18px] font-semibold text-charcoal-300 tracking-tight mb-2">No rescues yet</h2>
      <p className="text-[13px] text-charcoal-600 mb-8 leading-relaxed max-w-[220px] mx-auto">
        Your progress appears here after your first rescue.
      </p>
      <button onClick={onRescue} className="btn-gold inline-flex items-center gap-2 px-6 py-3.5">
        Start First Rescue
        <ChevronRight size={15} />
      </button>
    </div>
  );
}

function formatDate(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return `${diff}d ago`;
}
