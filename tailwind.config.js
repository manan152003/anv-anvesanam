/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#1A1A1A',
        'background-alt': '#141414',
        'text-primary': '#DFD0B8',
        'text-secondary': 'rgba(223, 208, 184, 0.6)',
        'ui-muted': '#7C6B6B',
        'ui-light': '#D9D9D9',
      },
      fontFamily: {
        'alfa': ['"Alfa Slab One"', 'serif'],
        'bellefair': ['Bellefair', 'serif'],
        'lora': ['Lora', 'serif'],
      },
    },
  },
  plugins: [],
} 