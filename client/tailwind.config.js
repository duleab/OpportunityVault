/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Clean, humanized light palette
        base:        '#fafafa',
        surface:     '#ffffff',
        'surface-2': '#f5f5f5',
        'surface-3': '#eeeeee',
        accent:      '#2563eb',       // solid blue — no gradients
        'accent-hover': '#1d4ed8',
        'accent-light': '#eff6ff',
        accent2:     '#059669',       // success green
        warning:     '#d97706',
        danger:      '#dc2626',
        muted:       '#9ca3af',
        'sidebar-bg': '#ffffff',
        border:      '#e5e7eb',
        text:        '#111827',
        'text-muted': '#6b7280',
        'text-dim':  '#9ca3af',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        xs:  ['0.75rem',  { lineHeight: '1rem' }],
        sm:  ['0.875rem', { lineHeight: '1.25rem' }],
        base:['1rem',     { lineHeight: '1.6' }],
        lg:  ['1.125rem', { lineHeight: '1.75rem' }],
        xl:  ['1.25rem',  { lineHeight: '1.75rem' }],
        '2xl':['1.5rem',  { lineHeight: '2rem' }],
        '3xl':['1.875rem',{ lineHeight: '2.25rem' }],
      },
      boxShadow: {
        card:       '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover':'0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        input:      '0 1px 2px rgba(0,0,0,0.04)',
      },
      borderRadius: {
        sm:  '4px',
        DEFAULT: '6px',
        md:  '6px',
        lg:  '8px',
        xl:  '10px',
        '2xl':'12px',
      },
    },
  },
  plugins: [],
};
