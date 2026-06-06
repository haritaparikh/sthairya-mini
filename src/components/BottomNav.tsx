import { Flame, Zap, LayoutDashboard } from 'lucide-react';

type Page = 'home' | 'rescue' | 'dashboard';
type Props = { current: Page; onChange: (page: Page) => void };

const ITEMS: { page: Page; icon: React.ElementType; label: string }[] = [
  { page: 'home',      icon: Flame,           label: 'Home'     },
  { page: 'rescue',    icon: Zap,             label: 'Rescue'   },
  { page: 'dashboard', icon: LayoutDashboard, label: 'Progress' },
];

export default function BottomNav({ current, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Gradient fade-up backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(8,8,9,0.98) 0%, rgba(8,8,9,0.92) 60%, transparent 100%)',
        }}
      />

      <div
        className="relative border-t border-charcoal-800/50"
        style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', background: 'rgba(8,8,9,0.75)' }}
      >
        <div className="max-w-lg mx-auto flex items-stretch h-[60px]">
          {ITEMS.map(({ page, icon: Icon, label }) => {
            const active = current === page;
            return (
              <button
                key={page}
                onClick={() => onChange(page)}
                className={[
                  'nav-item flex-1 relative',
                  active ? 'text-gold-400' : 'text-charcoal-600 hover:text-charcoal-400',
                ].join(' ')}
              >
                {/* Active pill indicator */}
                {active && (
                  <span
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-gold-400 opacity-90"
                  />
                )}

                {/* Icon with subtle glow when active */}
                <div className="relative flex items-center justify-center w-6 h-6 mx-auto">
                  {active && (
                    <span className="absolute inset-0 rounded-full bg-gold-500/12 scale-[2] blur-sm" />
                  )}
                  <Icon
                    size={active ? 20 : 19}
                    className={[
                      'relative transition-all duration-200',
                      active ? 'scale-110' : 'scale-100',
                    ].join(' ')}
                  />
                </div>

                <span className={[
                  'text-[10px] font-medium tracking-wide transition-colors duration-200',
                  active ? 'text-gold-400' : 'text-charcoal-700',
                ].join(' ')}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
