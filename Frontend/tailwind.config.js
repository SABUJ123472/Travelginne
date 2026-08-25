/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        heritage: ['"Playfair Display"', 'Georgia', 'serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        script: ['"Instrument Serif"', 'serif'],
        cinzel: ['"Cinzel"', 'serif'],
        bengali: ['"Tiro Bangla"', 'serif'],
      },
      colors: {
        parchment: {
          50: '#fdfbf7',
          100: '#f5efe6',
          200: '#f2eee5',
          300: '#e6dfd3',
          400: '#e2dad0',
          500: '#d5ccbe',
        },
        expedition: '#fdfbf7',
        terracotta: {
          400: '#e57a62',
          500: '#d96b52',
          600: '#c85a44',
          700: '#a54431',
          800: '#833423',
        },
        expnavy: '#19232d',
        archivalgreen: {
          100: '#e8f3ea',
          200: '#c3dec9',
          300: '#a8caa7',
          800: '#2b4c30',
          900: '#19331e',
        },
        // Bengali / dark theme palette
        bengal: {
          100: '#f9e8c0',
          200: '#f0d090',
          300: '#e8b860',
          400: '#d4a040',
          800: '#2a1a08',
          900: '#1a0f04',
          950: '#0f0804',
        },
        saffron: {
          300: '#fcd47a',
          400: '#f5b942',
          500: '#e8a020',
          600: '#c88010',
          700: '#a06008',
        },
        sindoor: {
          400: '#e86060',
          500: '#d94040',
          600: '#c82828',
          700: '#a01818',
        },
        mustard: {
          300: '#e8d060',
          400: '#d4b830',
          500: '#b89818',
        },
      },
      boxShadow: {
        'journal': '0 4px 16px -2px rgba(28, 25, 23, 0.05), 0 2px 6px -1px rgba(28, 25, 23, 0.03)',
        'journal-lg': '0 12px 32px -4px rgba(28, 25, 23, 0.08), 0 4px 12px -2px rgba(28, 25, 23, 0.04)',
      }
    },
  },
  plugins: [],
}
