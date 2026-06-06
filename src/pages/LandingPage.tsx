import { Flame, ShieldCheck, Zap, ArrowRight, Sparkles } from 'lucide-react';

type Props = {
  onGetStarted: () => void;
};

export default function LandingPage({ onGetStarted }: Props) {
  return (
    <div className="min-h-screen bg-charcoal-950 overflow-x-hidden">

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="bg-orb-top-right animate-glow-orb" />
        <div className="bg-orb-bottom-left animate-glow-orb" style={{ animationDelay: '3s' }} />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOFYwaDQydjQySDM2VjE4eiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAxNSkiLz48L2c+PC9zdmc+')] opacity-[0.3]" />
      </div>

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-4 max-w-lg mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold-sm">
            <Flame size={15} className="text-charcoal-950" />
          </div>
          <span className="font-semibold text-charcoal-100 tracking-tight text-[15px]">Sthairya Mini</span>
        </div>
        <button
          onClick={onGetStarted}
          className="text-[13px] font-medium text-charcoal-400 hover:text-gold-400 transition-colors duration-200 px-3 py-1.5"
        >
          Sign in
        </button>
      </header>

      {/* Hero */}
      <section className="relative z-10 px-6 pt-14 pb-20 max-w-lg mx-auto text-center">
        <div
          className="badge-gold mb-8 mx-auto animate-fade-in"
          style={{ animationFillMode: 'both' }}
        >
          <Sparkles size={11} />
          Habit Rescue Coach
        </div>

        <h1
          className="heading-xl mb-5 animate-slide-up"
          style={{ animationFillMode: 'both', animationDelay: '80ms' }}
        >
          Rescue your habit<br />
          <span className="gold-text">in 5 minutes.</span>
        </h1>

        <p
          className="body-lead mb-3 animate-slide-up"
          style={{ animationFillMode: 'both', animationDelay: '160ms' }}
        >
          For the days you almost quit.
        </p>

        <p
          className="text-[13px] text-charcoal-600 mb-10 animate-fade-in"
          style={{ animationFillMode: 'both', animationDelay: '200ms' }}
        >
          You are safe. Just restart gently.
        </p>

        <div
          className="animate-slide-up"
          style={{ animationFillMode: 'both', animationDelay: '240ms' }}
        >
          <button
            onClick={onGetStarted}
            className="btn-gold w-full sm:w-auto sm:px-14 inline-flex items-center justify-center gap-3"
          >
            Start Rescue
            <ArrowRight size={17} />
          </button>
          <p className="mt-4 text-[12px] text-charcoal-600">
            Free to use &nbsp;·&nbsp; No commitments
          </p>
        </div>
      </section>

      {/* Floating card mockup */}
      <section className="relative z-10 px-6 mb-20 max-w-xs mx-auto">
        <div
          className="animate-scale-in"
          style={{ animationFillMode: 'both', animationDelay: '360ms' }}
        >
          <div className="glass-card p-6 text-center shadow-gold">
            <div className="w-14 h-14 rounded-2xl bg-gold-gradient mx-auto mb-4 flex items-center justify-center shadow-gold-sm">
              <Flame size={24} className="text-charcoal-950" />
            </div>
            <div className="text-3xl font-semibold gold-text tracking-tightest mb-1">Day 47</div>
            <div className="text-[12px] text-charcoal-500 mb-3">Streak rescued</div>
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative z-10 px-6 max-w-lg mx-auto mb-20">
        <p className="section-label text-center mb-10">What makes it different</p>
        <div className="space-y-3">
          {BENEFITS.map((b, i) => (
            <div
              key={i}
              className="glass-card p-5 flex items-start gap-4 animate-slide-up"
              style={{ animationDelay: `${i * 80 + 100}ms`, animationFillMode: 'both' }}
            >
              <div className="w-10 h-10 rounded-2xl bg-gold-950/60 border border-gold-800/30 flex items-center justify-center shrink-0 mt-0.5">
                <b.icon size={17} className="text-gold-400" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-charcoal-100 tracking-tight mb-1">{b.title}</h3>
                <p className="text-[13px] text-charcoal-500 leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="relative z-10 px-6 max-w-lg mx-auto mb-20">
        <div className="glass-card p-7 text-center">
          <div className="text-gold-500/40 text-5xl font-serif leading-none mb-4 -mt-2">"</div>
          <p className="text-[15px] text-charcoal-300 leading-relaxed mb-6 -mt-4">
            I hadn't moved in 3 days. Sthairya gave me a 5-minute plan. I did it. That was 60 days ago.
          </p>
          <div className="flex items-center justify-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center text-[12px] font-bold text-charcoal-950 shadow-gold-sm">P</div>
            <span className="text-[12px] text-charcoal-500">Priya M. &nbsp;·&nbsp; Consistent since March</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 max-w-lg mx-auto pb-20 text-center">
        <p className="text-[13px] text-charcoal-500 mb-7 leading-relaxed">
          Fitness. Meditation. Calm.<br />All rescued in minutes.
        </p>
        <button
          onClick={onGetStarted}
          className="btn-gold w-full inline-flex items-center justify-center gap-2"
        >
          Start Rescue Now
          <ArrowRight size={17} />
        </button>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-charcoal-800/60 px-6 py-8 max-w-lg mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame size={13} className="text-gold-600" />
            <span className="text-[13px] font-medium text-charcoal-600">Sthairya Mini</span>
          </div>
          <p className="text-[11px] text-charcoal-700 tracking-widest uppercase">Rescue. Repeat. Rise.</p>
        </div>
      </footer>
    </div>
  );
}

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: 'No guilt, ever',
    desc: "Missing a day doesn't break you. Show up without shame or judgment.",
  },
  {
    icon: Zap,
    title: 'Tiny rescue plans',
    desc: 'Plans matched to your energy, time, and goal — 2 minutes counts.',
  },
  {
    icon: Flame,
    title: 'Fitness + calm in one',
    desc: 'Move your body or quiet your mind. Both paths lead back.',
  },
];
