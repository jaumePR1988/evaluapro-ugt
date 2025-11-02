import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ugt-red': '#D32F2F',
        'ugt-red-dark': '#B71C1C',
        'ugt-red-light': '#EF5350',
      },
    },
  },
  plugins: [],
}
export default config
