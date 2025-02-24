import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          '100': '#FFA500',
          DEFAULT: '#FFCC00',
        },
        green: {
          DEFAULT: '#46B44A',
          '100': '#348B37',
        },
        light: {
          '100': '#333F4E',
          '200': '#A3B2C7',
          '300': '#F2F5F9',
          '400': '#F2F4F8',
          '500': '#FFFAE8',
        },
        dark: {
          '100': '#04050C',
          '200': '#131524',
          '300': '#333333',
        },
      },
      fontFamily: {
        poppins: ['var(--font-poppins)'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('@tailwindcss/line-clamp')],
} satisfies Config;
