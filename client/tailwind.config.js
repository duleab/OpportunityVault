/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0d0f12',
        surface: '#13171e',
        'surface-2': '#1a1f29',
        'surface-3': '#212736',
        accent: '#6366f1',
        'accent-hover': '#4f46e5',
        accent2: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        muted: '#374151',
        'sidebar-bg': '#0f1218',
        border: 'rgba(255,255,255,0.07)',
      },
      fontFamily: {
        display: ['Inter', 'Syne', 'sans-serif'],
        body: ['Inter', 'DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)',
        glow: '0 0 20px rgba(99,102,241,0.25)',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
};
