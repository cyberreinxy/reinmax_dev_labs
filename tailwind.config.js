/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.html", // Scan all HTML files in the public directory
    "./public/**/*.js", // Scan all JS files for dynamic classes
  ],
  safelist: [
    "bg-green-50",
    "text-green-800",
    "bg-red-50",
    "text-red-500",
    "hidden",
    "lg:block",
    "h-4",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#002828",
        secondary: "#99cccc",
        tertiary: "#003333",
        background: "#f2f4f4",
        danger: "#ef4444",
        dangerHover: "#dc2626",
      },
      fontFamily: {
        sora: ["Sora", "sans-serif"],
        bricolage: ['"Bricolage Grotesque"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
