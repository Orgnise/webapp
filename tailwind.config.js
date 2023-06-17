/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      width: {},
      transitionTimingFunction: {
        "in-expo": "cubic-bezier(0.3, 1, .3, 1)",
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
      },
      colors: {
        primary: {
          50: "#ffebee",
          100: "#ffcdd2",
          200: "#ef9a9a",
          300: "#e57373",
          400: "#ef5350",
          500: "#f44336",
          600: "#e53935",
          700: "#d32f2f",
          800: "#c62828",
          900: "#b71c1c",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
