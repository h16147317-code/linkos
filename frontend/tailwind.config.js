/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F6F4EF',
        sidebar: '#FAF8F3',
        ink: '#0F172A',
        'ink-2': '#334155',
        muted: '#64748B',
        primary: '#0E5246',
        'primary-dark': '#093A31',
        'primary-soft': '#DDEAE3',
        'green-soft': '#D1FAE5',
        'amber-soft': '#FEF3C7',
        'red-soft': '#FEE2E2',
        success: '#15803D',
        warning: '#B45309',
        danger: '#B91C1C',
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
