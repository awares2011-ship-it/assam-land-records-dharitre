/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette — tuned to the Dharitre logo's violet / magenta.
        brand: {
          50:  '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        // Signature accent (the yellow pill on the logo).
        accent: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        // Secondary magenta (hero gradient 2nd stop).
        magenta: {
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Noto Sans Assamese', 'Noto Sans Devanagari', 'sans-serif'],
        assamese: ['Noto Sans Assamese', 'Noto Serif Assamese', 'system-ui', 'sans-serif'],
        hindi:    ['Noto Sans Devanagari', 'Noto Serif Devanagari', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,.06), 0 1px 3px rgba(16,24,40,.1)',
        pop:  '0 8px 20px rgba(16,24,40,.12)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
