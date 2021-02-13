const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./src/**/*.svelte', './static/*.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    // fontFamily: {
    //   'serif': ['Domine', 'ui-serif'],
    //   'sans': ['Domine', 'ui-serif']
    // },
    extend: {
      // colors: {
      //   cyan: colors.violet,
      // }
      fontFamily: {
        serif: ['recoleta', 'ui-serif'],
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      colors: {
        rose: colors.rose,
        faithful: {
          50: '#EE2D30',
          100: '#EE2D30',
          200: '#FBC9BD', // FBC9BD or -> FCD0C5
          300: '#FBC9BD', // FBC9BD or -> FCD0C5
          400: '#FCD0C5', // FBC9BD or -> FCD0C5

          500: '#FCD0C5', // FBC9BD or -> FCD0C5
          600: '#CC2027',
          700: '#CC2027',
          800: '#CC2027',
          900: '#792520',
        },
      },
    },
  },
  variants: {
    extend: {},
    opacity: ({ after }) => after(['disabled']),
    typography: ['responsive', 'dark'],
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-font-inter')(),
  ],
};
