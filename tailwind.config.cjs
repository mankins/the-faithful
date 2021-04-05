const { tailwindExtractor } = require('tailwindcss/lib/lib/purgeUnusedStyles');
const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: 'class', // or 'media' or 'class'
  purge: {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    options: {
      defaultExtractor: (content) => [
        // If this stops working, please open an issue at https://github.com/svelte-add/tailwindcss/issues rather than bothering Tailwind Labs about it
        ...tailwindExtractor(content),
        // Match Svelte class: directives (https://github.com/tailwindlabs/tailwindcss/discussions/1731)
        ...[...content.matchAll(/(?:class:)*([\w\d-/:%.]+)/gm)].map(
          ([_match, group, ..._rest]) => group
        ),
      ],
      keyframes: true,
    },
  },
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
    require('@tailwindcss/aspect-ratio'),
  ],
};
