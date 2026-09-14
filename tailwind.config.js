/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        skyMist: '#D4F1FF',
        buttercup: '#FFEE8C',
        pastelMint: '#C8F7DC',
        coralBlush: '#FFD6D6',
        paleLilac: '#E5DBFF',
        cloudWhite: '#F8FBFE',
        slateAsh: '#3E4A5B',
        // semantic mappings
        scrapbook: {
          bg: '#F8FBFE',
          card: '#FFFFFF',
          ink: '#3E4A5B',
          inkMuted: '#6B7A90',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        handwriting: ['Caveat', 'Patrick Hand', 'cursive'],
        serifDisplay: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'paper-sm': '0 2px 4px rgba(62, 74, 91, 0.05), 0 1px 2px rgba(62, 74, 91, 0.04)',
        'paper': '0 8px 20px -4px rgba(62, 74, 91, 0.08), 0 4px 8px -2px rgba(62, 74, 91, 0.04)',
        'paper-hover': '0 16px 32px -6px rgba(62, 74, 91, 0.12), 0 8px 16px -4px rgba(62, 74, 91, 0.06)',
        'paper-elevated': '0 24px 48px -12px rgba(62, 74, 91, 0.16), 0 12px 24px -6px rgba(62, 74, 91, 0.08)',
        'tape': '0 1px 3px rgba(62, 74, 91, 0.08)',
        'inner-paper': 'inset 0 2px 6px rgba(62, 74, 91, 0.03)',
      },
    },
  },
  plugins: [],
}
