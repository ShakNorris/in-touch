/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors:{
        'intouch': '#BFF098'
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"), require("tailwind-scrollbar"),
    require("tailwind-scrollbar-hide")
  ],
}
