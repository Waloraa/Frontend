/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Helvetica Now Display"', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        brand: {
          purple: '#7C3AED',
          'purple-light': '#8B5CF6',
        },
        bg: '#E8E4DC',
      },
    },
  },
  plugins: [],
}
