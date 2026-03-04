import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0f0d0b',
          900: '#1a1713',
          800: '#242018',
          700: '#36312a',
          600: '#4e4840',
          500: '#6b6358',
        },
        cream: {
          50:  '#faf7f2',
          100: '#f2ece0',
          200: '#e2d9cc',
          300: '#cec4b5',
          400: '#b8ae9f',
          500: '#a09489',
          600: '#877c71',
          700: '#6b6159',
        },
        gold: {
          300: '#edcc7a',
          400: '#e0b95e',
          500: '#c9a84c',
          600: '#a88938',
          700: '#7d6628',
          800: '#4a3c18',
          900: '#271f0a',
        },
        sage: {
          400: '#74c492',
          500: '#5aad7a',
          600: '#448a5e',
          900: '#0e2318',
        },
        clay: {
          400: '#d47070',
          500: '#c25050',
          600: '#9e3e3e',
          900: '#2a1010',
        },
        honey: {
          400: '#e0a53a',
          500: '#d4921f',
          600: '#ad7518',
          900: '#2a1e08',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
