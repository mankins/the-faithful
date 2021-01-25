const colors = require('tailwindcss/colors');

module.exports = {
  purge: ["./src/**/*.svelte", "./static/*.html"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      // colors: {
      //   cyan: colors.violet,
      // }
      colors: {
        rose: colors.rose,
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

