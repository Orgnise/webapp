/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  media: false, // or 'media' or 'class'
  theme: {
    extend: {
      width: {},
      transitionTimingFunction: {
        "in-expo": "cubic-bezier(0.3, 1, .3, 1)",
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
      },
    },
  },
  plugins: [],
};
