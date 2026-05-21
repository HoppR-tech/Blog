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
      typography: theme => ({
        DEFAULT: {
          css: {
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            'code': {
              backgroundColor: '#f0edf6',
              color: theme('colors.hoppr-purple'),
              fontWeight: '500',
              padding: '0.15rem 0.4rem',
              borderRadius: '0.375rem',
              fontSize: '0.875em',
              border: '1px solid #e0d9ed',
            },
            'pre code': {
              backgroundColor: 'transparent',
              color: 'inherit',
              fontSize: 'inherit',
              fontWeight: 'inherit',
              padding: '0',
            },
          },
        },
        invert: {
          css: {
            'code': {
              backgroundColor: '#1e293b',
              color: theme('colors.hoppr-green'),
              border: '1px solid #334155',
            },
            'pre code': {
              backgroundColor: 'transparent',
              color: 'inherit',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
