/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#03040c',
        'brand-panel': 'rgba(255, 255, 255, 0.02)',
        'brand-border': 'rgba(255, 255, 255, 0.06)',
        'safe': '#10b981',
        'suspicious': '#f59e0b',
        'danger': '#ef4444',
        'info': '#3b82f6',
      },
      fontFamily: {
        'outfit': ['Outfit', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
