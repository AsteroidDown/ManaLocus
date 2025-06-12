/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
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
        translate: {
          "0%": { "background-position-x": "100%", opacity: "40%" },
          "50%": { opacity: "100%" },
          "100%": { "background-position": "-75%", opacity: "40%" },
        },
      },
      animation: {
        bottomToTopGrow: "bottomToTopGrow 1s ease forwards",
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

        patreon: "#f96854",
        "patreon-secondary": "#052d49",

        discord: "#7289da",

        bluesky: "#0099ff",

        "primary-100": "rgba(var(--primary-100) / <alpha-value>)",
        "primary-200": "rgba(var(--primary-200) / <alpha-value>)",
        "primary-300": "rgba(var(--primary-300) / <alpha-value>)",
        "primary-400": "rgba(var(--primary-400) / <alpha-value>)",
        "primary-500": "rgba(var(--primary-500) / <alpha-value>)",
        "primary-600": "rgba(var(--primary-600) / <alpha-value>)",

        "dark-100": "#121212",
        "dark-200": "#282828",
        "dark-300": "#3f3f3f",
        "dark-400": "#575757",
        "dark-500": "#717171",
        "dark-600": "#8b8b8b",

        "background-100": "rgba(var(--background-100) / <alpha-value>)",
        "background-200": "rgba(var(--background-200) / <alpha-value>)",
        "background-300": "rgba(var(--background-300) / <alpha-value>)",
        "background-400": "rgba(var(--background-400) / <alpha-value>)",
        "background-500": "rgba(var(--background-500) / <alpha-value>)",
        "background-600": "rgba(var(--background-600) / <alpha-value>)",

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
};
