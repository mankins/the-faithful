const colors = require('tailwindcss/colors');

module.exports = {
  purge: ["./src/**/*.svelte", "./static/*.html"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    fontFamily: {
      'serif': ['Domine', 'ui-serif'],
      'sans': ['Domine', 'ui-serif']
    },
    extend: {
      // colors: {
      //   cyan: colors.violet,
      // }
      fontFamily: {
        'serif': ['Recoleta-RegularDEMO', 'zzzDomine', 'ui-serif'],
        'sans': ['Recoleta-RegularDEMO', 'zzzDomine', 'ui-serif']
      },
        colors: {
        rose: colors.rose,
        faithful: {
          '500': '#FFFFFF' // FBC9BD or -> FCD0C5 
        }
      }
    },
  },
  variants: {
    extend: {
    },
    opacity: ({ after }) => after(['disabled']),
    typography: ["responsive", "dark"],
  },
  plugins: [
    require("@tailwindcss/typography"),
    require('@tailwindcss/forms'),
//    require("tailwindcss-font-inter")(),
  ],
};

