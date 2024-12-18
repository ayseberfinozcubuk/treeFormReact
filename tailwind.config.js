module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "./node_modules/primereact/**/*.{js,jsx,ts,tsx}", // Include PrimeReact components
  ],
  theme: {
    extend: {},
  },
  darkMode: "media", // Enable dark mode with class
  plugins: [],
};
