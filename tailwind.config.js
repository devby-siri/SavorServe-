/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: '#6B1E2B',
          dark: '#521620',
          light: '#852637',
        },
        terracotta: {
          DEFAULT: '#A63D40',
          hover: '#8C3235',
        },
        cream: {
          DEFAULT: '#FFF8F0',
          card: '#FFFFFF',
          darker: '#F5EBE0',
        },
        gold: {
          DEFAULT: '#D4A24C',
          light: '#E6C17D',
        },
        darkbrown: '#2B2118',
        warmgray: '#756B63',
        successgreen: '#3F7D58',
      },
    },
  },
  plugins: [],
}