/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        'elevation-1': '0 1px 2px 0 rgb(60 64 67 / 0.3), 0 1px 3px 1px rgb(60 64 67 / 0.15)',
        'elevation-2': '0 1px 2px 0 rgb(60 64 67 / 0.3), 0 2px 6px 2px rgb(60 64 67 / 0.15)',
        'elevation-1-dark': '0 1px 2px 0 rgb(0 0 0 / 0.3), 0 1px 3px 1px rgb(0 0 0 / 0.15)',
        'elevation-2-dark': '0 1px 2px 0 rgb(0 0 0 / 0.3), 0 2px 6px 2px rgb(0 0 0 / 0.15)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
        'gradient-success': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'gradient-warning': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        'gradient-danger': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 