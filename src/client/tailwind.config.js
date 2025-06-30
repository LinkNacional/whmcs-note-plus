import { scopedPreflightStyles } from 'tailwindcss-scoped-preflight'

/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'lkn-', // https://tailwindcss.com/docs/configuration#prefix
  important: true,
  content: [
    "./src/**/*.{js,jsx}",
  ],
  plugins: [
    scopedPreflightStyles({
      cssSelector: '#lknnoteplus',
      mode: 'matched only',
    }),
  ]
}
