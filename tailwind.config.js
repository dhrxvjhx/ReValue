/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#22C55E",
        darkBg: "#0F172A",
        glass: "rgba(255,255,255,0.05)",
      },
    },
  },
  plugins: [],
}