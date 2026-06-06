/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fefbf0',
          100: '#fdf5d6',
          200: '#fae9a8',
          300: '#f5d36e',
          400: '#edb92a',
          500: '#d4980f',
          600: '#b8780a',
          700: '#92580b',
          800: '#784510',
          900: '#653a12',
          950: '#3a1f05',
        },
        charcoal: {
          50:  '#f6f6f6',
          100: '#ebebeb',
          200: '#d4d4d4',
          300: '#adadad',
          400: '#7a7a7a',
          500: '#565656',
          600: '#404040',
          700: '#2e2e2e',
          800: '#1c1c1e',
          900: '#121214',
          950: '#080809',
        },
        navy: {
          900: '#0a0d14',
          950: '#060810',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.03em',
        tight: '-0.02em',
      },
      lineHeight: {
        snug: '1.3',
        cozy: '1.6',
      },
      animation: {
        'fade-in':     'fadeIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in-fast':'fadeIn 0.35s ease-out forwards',
        'slide-up':    'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-up-sm': 'slideUpSm 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'scale-in':    'scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'pulse-gold':  'pulseGold 3s ease-in-out infinite',
        'breathe':     'breathe 4s ease-in-out infinite',
        'shimmer':     'shimmer 2.8s linear infinite',
        'glow-orb':    'glowOrb 6s ease-in-out infinite',
        'spin-slow':   'spin 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUpSm: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212,152,15,0)' },
          '50%':      { boxShadow: '0 0 0 10px rgba(212,152,15,0)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)',    opacity: '0.7' },
          '50%':      { transform: 'scale(1.04)', opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-400% center' },
          '100%': { backgroundPosition: '400% center' },
        },
        glowOrb: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%':      { opacity: '0.9', transform: 'scale(1.08)' },
        },
      },
      backgroundImage: {
        'gold-gradient':       'linear-gradient(135deg, #f5d36e 0%, #d4980f 55%, #b8780a 100%)',
        'gold-gradient-soft':  'linear-gradient(135deg, #edb92a 0%, #d4980f 100%)',
        'gold-shine':          'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.15) 50%, transparent 65%)',
        'dark-surface':        'linear-gradient(160deg, #1c1c1e 0%, #121214 100%)',
        'card-surface':        'linear-gradient(145deg, rgba(30,30,32,0.9) 0%, rgba(18,18,20,0.95) 100%)',
        'hero-mesh':           'radial-gradient(ellipse 80% 60% at 70% -10%, rgba(212,152,15,0.10) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at -10% 90%, rgba(212,152,15,0.06) 0%, transparent 55%)',
        'completion-radial':   'radial-gradient(ellipse 70% 70% at 50% 30%, rgba(212,152,15,0.10) 0%, transparent 65%)',
        'gold-text-gradient':  'linear-gradient(135deg, #f5d36e 0%, #edb92a 40%, #b8780a 100%)',
      },
      boxShadow: {
        'gold':       '0 0 0 1px rgba(212,152,15,0.2), 0 4px 24px rgba(212,152,15,0.18)',
        'gold-sm':    '0 0 0 1px rgba(212,152,15,0.15), 0 2px 12px rgba(212,152,15,0.12)',
        'gold-lg':    '0 0 0 1px rgba(212,152,15,0.25), 0 8px 48px rgba(212,152,15,0.22)',
        'card':       '0 1px 0 rgba(255,255,255,0.04) inset, 0 4px 40px rgba(0,0,0,0.55)',
        'card-hover': '0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 56px rgba(0,0,0,0.65)',
        'nav':        '0 -1px 0 rgba(255,255,255,0.04), 0 -4px 32px rgba(0,0,0,0.5)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
};
