/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // ✅ covers all file types just in case
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
