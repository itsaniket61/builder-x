/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        dolly: {
          50: '#fcfde9',
          100: '#f7fbc6',
          200: '#f5f98e',
          300: '#f5f54f',
          400: '#f0e71f',
          500: '#e0cf12',
          600: '#c2a40c',
          700: '#9a770e',
          800: '#805e13',
          900: '#6d4d16',
          950: '#3f2909',
        },
      },
    },
  },
  plugins: [],
};
