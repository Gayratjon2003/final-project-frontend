/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {},
      boxShadow: {
        cardLight: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
        cardDark: "rgba(255, 255, 255, 0.986) 0px 1px 4px 1px",
      },
    },
  },
  plugins: [],
};
