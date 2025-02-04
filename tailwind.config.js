/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  experimental: {
    optimizeUniversalDefaults: true,
  },
  plugins: [],
  color: {
    format: "rgb",
  },
};
