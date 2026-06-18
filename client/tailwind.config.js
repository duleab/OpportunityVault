/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0f1117',
        surface: '#1a1d27',
        accent: '#6366f1',
        accent2: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        muted: '#374151',
      },
      fontFamily: {
        display: ['Syne', 'Inter', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
