/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.html", "./public/**/*.js"],
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
        primary: {
          DEFAULT: "#002828",
          light: "#004d4d",
          dark: "#001a1a",
        },
        secondary: {
          DEFAULT: "#99cccc",
          light: "#cce5e5",
          dark: "#66b2b2",
        },
        tertiary: {
          DEFAULT: "#003333",
          light: "#006666",
          dark: "#001f1f",
        },
        neutral: {
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
        background: "#f2f4f4",
        soft: "#DBEDED",
        danger: "#ef4444",
        dangerHover: "#dc2626",
      },
      fontFamily: {
        bricolage: ["\"Bricolage Grotesque\"", "sans-serif"],
      },
    },
  },
  plugins: [],
};
