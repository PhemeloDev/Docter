/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#EEF6FB',
          medium: '#A8D8F0', 
          dark: '#0288D1',
          DEFAULT: '#0288D1',
          hover: '#0277BD'
        },
        secondary: '#F7F9FA',
        'light-gray': '#F7F9FA',
        'text-primary': '#171717',
        'text-secondary': '#6B7280',
      },
      fontFamily: {
        sans: ['var(--font-open-sans)'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}; 