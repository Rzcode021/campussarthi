/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#F8FAFC',
        border: '#E2E8F0',
        muted: '#94A3B8',
        body: '#334155',
        heading: '#0F172A',
        primary: '#4F46E5',
        'primary-light': '#EEF2FF',
        success: '#059669',
        danger: '#DC2626',
        warning: '#D97706',
        info: '#0284C7',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
