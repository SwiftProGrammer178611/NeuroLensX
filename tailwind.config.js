/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#e6fcfd',
          100: '#ccf9fb',
          200: '#99f3f7',
          300: '#66edf3',
          400: '#33e7ef',
          500: '#4DE8ED',
          600: '#00d6e0',
          700: '#00a1a8',
          800: '#006c70',
          900: '#003738',
        },
        secondary: {
          50: '#eeeafd',
          100: '#ddd5fb',
          200: '#bbabf8',
          300: '#9981f4',
          400: '#7757f1',
          500: '#6C5CE7',
          600: '#4819df',
          700: '#3914af',
          800: '#260e74',
          900: '#13073a',
        },
        accent: {
          50: '#f8e3f9',
          100: '#f1c6f3',
          200: '#e38ce7',
          300: '#d453db',
          400: '#c619cf',
          500: '#C14BEA',
          600: '#9a0eb3',
          700: '#730b87',
          800: '#4d075a',
          900: '#26032d',
        },
      },
      boxShadow: {
        glow: '0 0 20px rgba(77, 232, 237, 0.5)',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};