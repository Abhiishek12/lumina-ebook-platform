/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sepia: {
          50: '#fbf0d9',
          100: '#f7e4be',
          200: '#eed195',
          800: '#5f4b32',
          900: '#433422'
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Merriweather', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Menlo', 'Monaco', 'Courier New', 'monospace']
      }
    },
  },
  plugins: [],
}
