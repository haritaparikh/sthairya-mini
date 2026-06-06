import { Link } from 'react-router-dom';
import { Flame, CalendarCheck, Shield, Zap, ArrowRight, Sparkles, Target } from 'lucide-react';
import StatCard from '../components/StatCard';
import { GOAL_LABELS, FitnessGoal } from '../types';
import { useStats } from '../hooks/useStats';

function aiInsight(streak: number, weeklyDone: number, weeklyTarget: number): string {
  if (streak === 0) return "Start your first check-in today. Every great streak begins with day one.";
  if (weeklyDone >= weeklyTarget) return `You've hit your weekly target of ${weeklyTarget} days. Outstanding consistency.`;
  if (streak >= 7) return `${streak}-day streak. Your body is adapting well — consider nudging your intensity slightly.`;
  if (weeklyDone === weeklyTarget - 1) return `One more session to hit your weekly target. You've got this.`;
  return `${streak}-day streak and counting. Small wins protect big goals.`;
}

export default function Dashboard() {
  const stats = useStats();

  const onboarding = (() => {
    try {
      const raw = localStorage.getItem('sthairya_onboarding');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  })();

  const goal = (onboarding?.fitness_goal || 'general_fitness') as FitnessGoal;
  const name = onboarding?.full_name || 'Champion';

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const insight = aiInsight(stats.streak, stats.weeklyDone, stats.weeklyTarget);

  const todayDone = stats.history.some((h) => {
    const d = new Date(h.date);
    const today = new Date();
    return (
      h.completed &&
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  });

  return (
    <div className="page-container">
      <div className="page-content">
        {/* Welcome card */}
        <div className="glass-card p-6 mb-5 animate-fade-in relative overflow-hidden">
          <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
          <div className="relative">
            <p className="text-sm text-white/40 mb-1">{greeting}</p>
            <h1 className="text-2xl font-bold mb-3">{name}</h1>
            <div className="flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-3 py-1.5 w-fit">
              <Target size={14} className="text-gold" />
              <span className="text-sm font-medium text-gold">{GOAL_LABELS[goal]}</span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <StatCard
            label="Current Streak"
            value={stats.streak === 0 ? '0 days' : `${stats.streak} day${stats.streak !== 1 ? 's' : ''}`}
            icon={Flame}
            accent="gold"
          />
          <StatCard label="Rescued Days" value={stats.rescued} icon={Shield} accent="warning" />
          <StatCard label="Workouts Done" value={stats.totalCompleted} icon={Zap} accent="lime" />
          <StatCard
            label="Weekly Progress"
            value={`${stats.weeklyDone}/${stats.weeklyTarget}`}
            icon={CalendarCheck}
            accent="purple"
          />
        </div>

        {/* Weekly progress bar */}
        <div className="glass-card p-5 mb-5 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <span className="label">This Week</span>
            <span className="text-sm text-white/50">
              {stats.weeklyDone} of {stats.weeklyTarget} days
            </span>
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: stats.weeklyTarget }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all duration-700 ${
                  i < stats.weeklyDone ? 'bg-gold-lime' : 'bg-white/[0.06]'
                }`}
              />
            ))}
          </div>
          {stats.weeklyDone >= stats.weeklyTarget && (
            <p className="text-xs text-lime mt-2">Weekly target reached!</p>
          )}
        </div>

        {/* AI Insight */}
        <div
          className="rounded-3xl overflow-hidden mb-5 animate-slide-up"
          style={{ animationDelay: '100ms' }}
        >
          <div className="p-[1px] bg-gradient-to-br from-accent-purple/30 via-accent-blue/20 to-transparent">
            <div className="bg-brand-graphite rounded-[23px] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-accent-purple" />
                <span className="text-xs font-semibold tracking-wider uppercase text-accent-purple">
                  AI Insight
                </span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">{insight}</p>
            </div>
          </div>
        </div>

        {/* Today's action */}
        <div
          className="glass-card p-5 mb-6 animate-slide-up"
          style={{ animationDelay: '200ms' }}
        >
          <span className="label mb-3 block">Today's Action</span>
          {todayDone ? (
            <>
              <p className="text-base font-semibold mb-1">You've already trained today.</p>
              <p className="text-sm text-white/50 mb-4">
                Rest up and come back tomorrow. Consistency is your superpower.
              </p>
              <Link
                to="/progress"
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                View Progress <ArrowRight size={16} />
              </Link>
            </>
          ) : (
            <>
              <p className="text-base font-semibold mb-4">
                Check in and get an AI plan tailored to how you feel today.
              </p>
              <Link
                to="/checkin"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                Start Today's Check-In <ArrowRight size={16} />
              </Link>
            </>
          )}
        </div>

        {/* Recent history preview */}
        {stats.history.length > 0 && (
          <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="label">Recent Workouts</span>
              <Link to="/progress" className="text-xs text-gold hover:text-gold-light transition-colors">
                View all
              </Link>
            </div>
            <div className="space-y-2">
              {stats.history.slice(0, 3).map((entry, i) => (
                <div key={i} className="glass-card px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{entry.plan_title}</p>
                    <p className="text-xs text-white/40 mt-0.5">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                      {' · '}
                      {entry.duration} min
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {entry.is_rescue && (
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-warning bg-warning/10 border border-warning/20 rounded-full px-2 py-0.5">
                        Rescue
                      </span>
                    )}
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-success bg-success/10 border border-success/20 rounded-full px-2 py-0.5">
                      Done
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
