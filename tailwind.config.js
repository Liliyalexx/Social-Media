/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: [
    "./views/**/*.ejs", // Add paths to all your template files
    "./public/**/*.html",
    "./src/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
