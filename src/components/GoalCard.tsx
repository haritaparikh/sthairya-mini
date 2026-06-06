import { FitnessGoal, GOAL_LABELS } from '../types';
import { Flame, Dumbbell, Timer, Heart, CalendarCheck, StretchHorizontal, RotateCcw, Activity } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

const goalIcons: Record<FitnessGoal, LucideIcon> = {
  lose_weight: Flame,
  build_muscle: Dumbbell,
  run_5km: Timer,
  improve_stamina: Heart,
  stay_consistent: CalendarCheck,
  improve_flexibility: StretchHorizontal,
  restart_fitness: RotateCcw,
  general_fitness: Activity,
};

interface GoalCardProps {
  goal: FitnessGoal;
  active?: boolean;
  onClick?: () => void;
}

export default function GoalCard({ goal, active, onClick }: GoalCardProps) {
  const Icon = goalIcons[goal];
  const label = GOAL_LABELS[goal];

  return (
    <button
      onClick={onClick}
      className={`glass-card p-4 flex flex-col items-center gap-2 transition-all duration-300 w-full
        ${active ? 'border-gold/40 bg-gold/[0.08] shadow-glow' : 'hover:bg-white/[0.06] hover:-translate-y-0.5'}
        ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <div className={`rounded-xl p-3 ${active ? 'bg-gold/15' : 'bg-white/[0.06]'}`}>
        <Icon size={22} className={active ? 'text-gold' : 'text-white/60'} />
      </div>
      <span className={`text-sm font-medium ${active ? 'text-gold' : 'text-white/70'}`}>
        {label}
      </span>
    </button>
  );
}
