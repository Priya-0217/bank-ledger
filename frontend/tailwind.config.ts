import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#34d399',
          600: '#10b981',
          700: '#059669',
          DEFAULT: '#22c55e'
        },
        slate: {
          25: '#fbfdff'
        }
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(0,0,0,0.10), 0 6px 18px -6px rgba(0,0,0,0.08)'
      },
      borderRadius: {
        '2xl': '1rem'
      }
    },
  },
  plugins: [],
} satisfies Config
