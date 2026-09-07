/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        marine: {
          950: '#030712',
          900: '#060d1b',
          850: '#0a1426',
          800: '#0f1f38',
          700: '#182f53',
          600: '#234475',
          500: '#335e9d',
        },
        tactical: {
          cyan: '#00f2fe',
          emerald: '#10b981',
          amber: '#f59e0b',
          crimson: '#ef4444',
          violet: '#8b5cf6',
          purple: '#9333ea',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', '"Open Sans"', 'system-ui', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        opensans: ['"Open Sans"', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['Inter', '"Space Grotesk"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
