/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      keyframes: {
        bottomToTopGrow: {
          "0%": { height: "0" },
          "100%": { height: "100%" },
        },
        spinReverse: {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
      },
      animation: {
        bottomToTopGrow: "bottomToTopGrow 1s ease forwards",
      },
      gridTemplateAreas: {
        graphLayout: ["title title", "verticalAxis plot", ". horizontalAxis"],
      },
      gridTemplateColumns: {
        graphLayout: "1fr auto",
      },
      gridTemplateRows: {
        graphLayout: "1fr 5fr 1fr",
      },
      colors: {
        "mtg-white": "#f9faf4",
        "mtg-white-secondary": "#f8e7b9",
        "mtg-blue": "#0e68ab",
        "mtg-blue-secondary": "#4687b8",
        "mtg-black": "#471480",
        "mtg-black-secondary": "#651db5",
        "mtg-red": "#d3202a",
        "mtg-red-secondary": "#bf4d53",
        "mtg-green": "#00733d",
        "mtg-green-secondary": "#2a9664",
        "mtg-gold": "#fcba03",
        "mtg-gold-secondary": "#c49d2f",
        "mtg-colorless": "#878787",
        "mtg-colorless-secondary": "#ababab",
        "mtg-land": "#592b14",
        "mtg-land-secondary": "#784228",

        "primary-100": "#382bf0",
        "primary-200": "#5e43f3",
        "primary-300": "#7a5af5",
        "primary-400": "#9171f8",
        "primary-500": "#a688fa",
        "primary-600": "#ba9ffb",

        "secondary-100": "#9c27b0",
        "secondary-200": "#a945b9",
        "secondary-300": "#b55ec2",
        "secondary-400": "#c176cb",
        "secondary-500": "#cc8dd4",
        "secondary-600": "#d7a4dd",

        "dark-100": "#121212",
        "dark-200": "#282828",
        "dark-300": "#3f3f3f",
        "dark-400": "#575757",
        "dark-500": "#717171",
        "dark-600": "#8b8b8b",

        "background-100": "#1a1625",
        "background-200": "#2f2b3a",
        "background-300": "#46424f",
        "background-400": "#5e5a66",
        "background-500": "#76737e",
        "background-600": "#908d96",

        "success-100": "#4caf50",
        "success-200": "#63b863",
        "success-300": "#79c176",
        "success-400": "#8dca89",
        "success-500": "#a0d39c",
        "success-600": "#b4dcb0",

        "danger-100": "#f44336",
        "danger-200": "#f95e4a",
        "danger-300": "#fe755f",
        "danger-400": "#ff8a75",
        "danger-500": "#ff9f8a",
        "danger-600": "#ffb2a1",

        "info-100": "#2196f3",
        "info-200": "#50a1f5",
        "info-300": "#6eacf6",
        "info-400": "#87b8f8",
        "info-500": "#9dc3f9",
        "info-600": "#b2cffb",

        "warning-100": "#ffc107",
        "warning-200": "#ffc83b",
        "warning-300": "#ffce58",
        "warning-400": "#ffd572",
        "warning-500": "#ffdc8a",
        "warning-600": "#ffe3a2",
      },
    },
  },
  plugins: [require("@savvywombat/tailwindcss-grid-areas")],
};
