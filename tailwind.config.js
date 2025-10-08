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
        calmBlue: '#6495ED',
        softPurple: '#A78BFA',
        mutedGreen: '#6EE7B7',
        sereneLavender: '#C4B5FD',
        tranquilTeal: '#5EEAD4',
      }
    }
  },
  plugins: [require('tailwindcss-animate')],
}
