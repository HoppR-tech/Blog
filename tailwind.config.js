module.exports = {
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        fira: ['Fira Sans', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
        luciole: ['Luciole', 'sans-serif'],
      },
      colors: {
        'hoppr-black': '#23272A',
        'hoppr-green': '#00cca5',
        'hoppr-red': '#F85352',
        'hoppr-purple': '#2F2D85',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
