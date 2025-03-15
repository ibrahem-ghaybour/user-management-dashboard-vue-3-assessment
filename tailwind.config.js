/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary-color)',
          light: 'var(--primary-light-color)',
          dark: 'var(--primary-dark-color)',
        },
        secondary: 'var(--secondary-color)',
        background: 'var(--background-color)',
        'background-card': 'var(--card-background)',
        text: {
          DEFAULT: 'var(--text-color)',
          heading: 'var(--heading-color)',
        },
        border: 'var(--border-color)',
        success: 'var(--success-color)',
        warning: 'var(--warning-color)',
        danger: 'var(--danger-color)',
        gray: {
          light: 'var(--light-gray)',
          medium: 'var(--medium-gray)',
          dark: 'var(--dark-gray)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
} 