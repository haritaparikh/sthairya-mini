import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: 'gold' | 'lime' | 'purple' | 'warning';
}

const accentMap = {
  gold: 'text-gold',
  lime: 'text-lime',
  purple: 'text-accent-purple',
  warning: 'text-warning',
};

const bgAccentMap = {
  gold: 'bg-gold/10',
  lime: 'bg-lime/10',
  purple: 'bg-accent-purple/10',
  warning: 'bg-warning/10',
};

export default function StatCard({ label, value, icon: Icon, accent = 'gold' }: StatCardProps) {
  return (
    <div className="glass-card p-4 flex flex-col gap-2 animate-fade-in">
      <div className="flex items-center gap-2">
        <div className={`${bgAccentMap[accent]} rounded-xl p-2`}>
          <Icon size={16} className={accentMap[accent]} />
        </div>
        <span className="label">{label}</span>
      </div>
      <span className={`stat-value ${accentMap[accent]}`}>{value}</span>
    </div>
  );
}
