/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Landing theme – black/gold
        gold: '#FFD700',
        'gold-light': '#FFF3B0',
        'gold-dim': '#B8960C',
        'dark-base': '#0B0B0B',
        'dark-card': '#111111',
        'dark-border': '#1E1E1E',

        // Dashboard/core theme – dark blue/purple
        surface: '#0F1629',
        'surface-card': '#141B2D',
        'surface-border': '#1E2A45',
        border: '#1E2A45',
        muted: '#64748B',
        body: '#94A3B8',
        heading: '#F1F5F9',

        // Brand
        primary: '#6366F1',
        'primary-light': '#312E81',
        'primary-dim': '#818CF8',
        secondary: '#A855F7',
        accent: '#22D3EE',
        success: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
        info: '#38BDF8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(255,215,0,0.25)',
        'gold-glow-sm': '0 0 10px rgba(255,215,0,0.15)',
        'primary-glow': '0 0 20px rgba(99,102,241,0.3)',
        'card-dark': '0 4px 24px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}
