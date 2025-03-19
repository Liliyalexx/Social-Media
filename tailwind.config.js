/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/**/*.ejs', 
    './public/**/*.html', 
  ],
  theme: {
    extend: {
      fontFamily: {
        'alex-brush': ['Alex Brush', 'cursive'],
      },
    },
  },
  plugins: [],
}

