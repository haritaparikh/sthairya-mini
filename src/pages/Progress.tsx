import { BarChart3, Shield, Calendar, Clock, Flame } from 'lucide-react';
import { useStats } from '../hooks/useStats';

const mockFallback = [
  { date: '2025-01-10T08:00:00Z', goal: 'Build Muscle', plan_title: 'Power Session', completed: true, duration: 30, mood: 'energized', is_rescue: false, note: '' },
  { date: '2025-01-09T07:30:00Z', goal: 'Build Muscle', plan_title: 'Express Burn', completed: true, duration: 10, mood: 'busy', is_rescue: true, note: 'Quick lunch break workout' },
  { date: '2025-01-08T06:45:00Z', goal: 'Build Muscle', plan_title: 'Back On Track', completed: true, duration: 15, mood: 'missed_yesterday', is_rescue: true, note: '' },
  { date: '2025-01-07T07:00:00Z', goal: 'Build Muscle', plan_title: 'Power Session', completed: true, duration: 30, mood: 'energized', is_rescue: false, note: '' },
  { date: '2025-01-06T08:15:00Z', goal: 'Build Muscle', plan_title: 'Gentle Revival', completed: true, duration: 10, mood: 'tired', is_rescue: true, note: 'Slept badly' },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function moodLabel(mood: string) {
  const map: Record<string, string> = {
    energized: 'Energized', tired: 'Tired', busy: 'Busy', sore: 'Sore',
    stressed: 'Stressed', travelling: 'Travelling', no_gym: 'No Gym Access',
    missed_yesterday: 'Missed Yesterday', low_motivation: 'Low Motivation',
  };
  return map[mood] || mood;
}

export default function Progress() {
  const stats = useStats();
  const history = stats.history.length > 0 ? stats.history : mockFallback;
  const barData = history.slice(0, 7).reverse();

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 size={20} className="text-gold" />
          <h1 className="section-title">Progress</h1>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="glass-card p-4 text-center">
            <Flame size={16} className="text-gold mx-auto mb-1" />
            <div className="text-xl font-bold text-gold">{stats.streak}</div>
            <div className="text-[10px] font-semibold tracking-wider uppercase text-white/40">Streak</div>
          </div>
          <div className="glass-card p-4 text-center">
            <Shield size={16} className="text-warning mx-auto mb-1" />
            <div className="text-xl font-bold text-warning">{stats.rescued}</div>
            <div className="text-[10px] font-semibold tracking-wider uppercase text-white/40">Rescued</div>
          </div>
          <div className="glass-card p-4 text-center">
            <Clock size={16} className="text-lime mx-auto mb-1" />
            <div className="text-xl font-bold text-lime">{stats.totalMinutes}</div>
            <div className="text-[10px] font-semibold tracking-wider uppercase text-white/40">Minutes</div>
          </div>
        </div>

        {/* Bar chart */}
        <div className="glass-card p-5 mb-6">
          <span className="label mb-4 block">Recent Activity</span>
          <div className="flex items-end gap-2 h-28">
            {barData.map((entry, i) => {
              const h = Math.max((entry.duration / 45) * 100, 12);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-xl transition-all duration-500 ${
                      entry.is_rescue ? 'bg-warning/40' : 'bg-gold/50'
                    }`}
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[9px] text-white/30">
                    {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2)}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-3 text-[10px] text-white/30">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded bg-gold/50" /> Standard
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded bg-warning/40" /> Rescue
            </div>
          </div>
        </div>

        {/* History list */}
        <div className="mb-4">
          <span className="label mb-3 block">Workout History</span>
        </div>
        <div className="space-y-3">
          {history.map((entry, i) => (
            <div key={i} className="glass-card p-4 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-sm font-semibold">{entry.plan_title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-white/40 flex items-center gap-1">
                      <Calendar size={10} /> {formatDate(entry.date)}
                    </span>
                    <span className="text-[10px] text-white/40 flex items-center gap-1">
                      <Clock size={10} /> {entry.duration} min
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {entry.is_rescue && (
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-warning bg-warning/10 border border-warning/20 rounded-full px-2 py-0.5">
                      Rescue
                    </span>
                  )}
                  {entry.completed && (
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-success bg-success/10 border border-success/20 rounded-full px-2 py-0.5">
                      Done
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-white/30">
                <span>Goal: {entry.goal}</span>
                <span>|</span>
                <span>Mood: {moodLabel(entry.mood)}</span>
                {entry.note && (
                  <>
                    <span>|</span>
                    <span className="text-white/40 italic truncate max-w-[120px]">{entry.note}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
