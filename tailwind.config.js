/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B6B",
        secondary: "#FFE66D",
        accent: "#4ECDC4",
        light: "#F7FFF7",
        dark: "#1A535C",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        heading: ["var(--font-playfair)"],
      }
    },
  },
  plugins: [],
}
