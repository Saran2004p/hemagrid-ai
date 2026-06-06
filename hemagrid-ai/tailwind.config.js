/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        blood: {
          50:  '#fff1f1',
          100: '#ffd7d7',
          200: '#ffb3b3',
          300: '#ff7c7c',
          400: '#f94040',
          500: '#e81818',
          600: '#c0392b',
          700: '#9b1c1c',
          800: '#7f1d1d',
          900: '#450a0a',
        },
        dark: '#1C1C1C',
        gold: '#F4D03F',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-slow':   'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'ping-slow':    'ping 2s cubic-bezier(0,0,0.2,1) infinite',
        'heartbeat':    'heartbeat 1.5s ease-in-out infinite',
        'ripple':       'ripple 2s linear infinite',
        'float':        'float 6s ease-in-out infinite',
      },
      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%':      { transform: 'scale(1.15)' },
          '28%':      { transform: 'scale(1)' },
          '42%':      { transform: 'scale(1.1)' },
          '70%':      { transform: 'scale(1)' },
        },
        ripple: {
          '0%':   { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}
