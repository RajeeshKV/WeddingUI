/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: { colors: { ivory: '#f8f3ec', forest: '#26372c', clay: '#a76e56' }, fontFamily: { serif: ['Playfair Display', 'Georgia', 'serif'], sans: ['DM Sans', 'sans-serif'] } } },
  plugins: []
};
