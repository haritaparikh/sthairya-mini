import { Flame, Zap, Wind, Sparkles } from 'lucide-react';
import RescueBadge from './RescueBadge';

interface WorkoutPlanCardProps {
  title: string;
  duration: number;
  intensity: string;
  warmup: string[];
  main_workout: string[];
  cooldown: string[];
  why_this_works: string;
  motivation: string;
  is_rescue: boolean;
}

export default function WorkoutPlanCard({
  title,
  duration,
  intensity,
  warmup,
  main_workout,
  cooldown,
  why_this_works,
  motivation,
  is_rescue,
}: WorkoutPlanCardProps) {
  return (
    <div className={`rounded-3xl overflow-hidden animate-slide-up ${is_rescue ? 'shadow-[0_0_40px_rgba(245,158,11,0.12)]' : 'shadow-[0_0_40px_rgba(139,92,246,0.12)]'}`}>
      <div className={`p-1 ${is_rescue ? 'bg-gradient-to-br from-warning/20 via-warning/10 to-transparent' : 'bg-gradient-to-br from-accent-purple/20 via-accent-blue/10 to-transparent'}`}>
        <div className="bg-brand-graphite rounded-[22px] p-6 space-y-5">
          {is_rescue && (
            <div className="mb-2">
              <RescueBadge />
            </div>
          )}

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={14} className={is_rescue ? 'text-warning' : 'text-accent-purple'} />
                <span className="text-xs font-semibold tracking-wider uppercase text-white/40">
                  AI Coach
                </span>
              </div>
              <h3 className="text-xl font-bold">{title}</h3>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 bg-white/[0.06] rounded-full px-3 py-1 text-xs font-medium text-white/70">
                <Zap size={12} /> {duration} min
              </span>
              <span className="flex items-center gap-1 bg-white/[0.06] rounded-full px-3 py-1 text-xs font-medium text-white/70">
                <Flame size={12} /> {intensity}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <Section title="Warm-up" items={warmup} icon={Wind} color="text-lime" />
            <Section title="Main Workout" items={main_workout} icon={Zap} color="text-gold" />
            <Section title="Cooldown" items={cooldown} icon={Wind} color="text-accent-purple" />
          </div>

          <div className="bg-white/[0.04] rounded-2xl p-4 space-y-2">
            <h4 className="text-sm font-semibold text-white/60">Why this works</h4>
            <p className="text-sm text-white/50 leading-relaxed">{why_this_works}</p>
          </div>

          <div className="text-center py-2">
            <p className={`text-base font-medium italic ${is_rescue ? 'text-warning' : 'text-accent-purple'}`}>
              "{motivation}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  items,
  icon: Icon,
  color,
}: {
  title: string;
  items: string[];
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className={color} />
        <span className="text-xs font-semibold tracking-wider uppercase text-white/40">{title}</span>
      </div>
      <ul className="space-y-1.5 pl-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-white/70 flex items-start gap-2">
            <span className="text-white/20 mt-1">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
