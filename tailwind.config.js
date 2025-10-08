/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neonPink: '#FF6EC7',
        cyberGreen: '#00FF99',
      }
    }
  },
  plugins: [require('tailwindcss-animate')],
}
