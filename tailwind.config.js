module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "./node_modules/primereact/**/*.{js,jsx,ts,tsx}", // Include PrimeReact components
  ],
  theme: {
    extend: {
      colors: {
        // Example custom colors (optional)
        lightBackground: "#ffffff",
        darkBackground: "#000000",
        lightText: "#000000",
        darkText: "#ffffff",
      },
    },
  },
  darkMode: "class", // Enable dark mode with class
  plugins: [],
};
