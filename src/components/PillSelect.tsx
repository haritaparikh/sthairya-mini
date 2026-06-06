interface PillSelectProps {
  options: { value: string; label: string }[];
  selected: string;
  onChange: (value: string) => void;
  accent?: 'gold' | 'lime' | 'warning' | 'purple';
}

const accentActive = {
  gold: 'border-gold/50 bg-gold/15 text-gold',
  lime: 'border-lime/50 bg-lime/15 text-lime',
  warning: 'border-warning/50 bg-warning/15 text-warning',
  purple: 'border-accent-purple/50 bg-accent-purple/15 text-accent-purple',
};

export default function PillSelect({ options, selected, onChange, accent = 'gold' }: PillSelectProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`rounded-full px-4 py-2.5 text-sm font-medium border transition-all duration-200
            ${selected === value
              ? accentActive[accent]
              : 'border-brand-border bg-white/[0.03] text-white/50 hover:bg-white/[0.06] hover:text-white/70'
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
