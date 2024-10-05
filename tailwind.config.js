/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        fraunces: ['var(--font-fraunces)'],
        'dm-sans': ['var(--font-dm-sans)'],
      },
      colors: {
        primary: '#004643',
        background: '#FAFAFA',
        'light-primary': '#e6ecec',
      },
    },
  },
  plugins: [],
}
