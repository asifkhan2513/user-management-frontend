/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FC783F",
        },
        offwhite: {
          DEFAULT: "#F8F9FA",
        },
      },
    },
  },
  plugins: [],
};
