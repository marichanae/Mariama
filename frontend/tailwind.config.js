/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#050509',
        surface: '#0b0b12',
        accent: {
          blood: '#b91c1c',
          violet: '#7c3aed',
        },
      },
    },
  },
  plugins: [],
}

