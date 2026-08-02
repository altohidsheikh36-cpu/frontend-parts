/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        olx: {
          dark: '#0a2e32',
          teal: '#1ec8bc',
          muted: '#5c7276',
          bg: '#f0f4f8',
          card: '#ffffff',
          border: '#e2e8f0',
          sell: '#f5c518',
        },
      },
      boxShadow: {
        olx: '0 1px 3px rgba(15, 23, 42, 0.06)',
        'olx-hover': '0 8px 30px -8px rgba(15, 23, 42, 0.12)',
        premium:
          '0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.04), 0 0 0 1px rgba(15, 23, 42, 0.03)',
        'premium-lg':
          '0 20px 50px -12px rgba(15, 23, 42, 0.14), 0 0 0 1px rgba(15, 23, 42, 0.04)',
        cta: '0 10px 40px -10px rgba(10, 46, 50, 0.45)',
        'cta-hover': '0 14px 48px -8px rgba(10, 46, 50, 0.55)',
        innerGlow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
      },
      backgroundImage: {
        'mesh-hero':
          'radial-gradient(ellipse 120% 80% at 50% -30%, rgba(30, 200, 188, 0.14), transparent 55%), radial-gradient(ellipse 70% 50% at 100% 0%, rgba(10, 46, 50, 0.06), transparent 50%), radial-gradient(ellipse 60% 40% at 0% 100%, rgba(30, 200, 188, 0.08), transparent 45%)',
        'footer-fade': 'linear-gradient(180deg, rgba(30, 200, 188, 0.12) 0%, transparent 100%)',
      },
      transitionDuration: {
        250: '250ms',
        400: '400ms',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.22, 1, 0.36, 1)',
        spring: 'cubic-bezier(0.34, 1.45, 0.64, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
}
