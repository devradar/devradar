/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,scss}'],
  theme: {
    extend: {
      animation: {
        scan: 'scan 4s linear infinite'
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(0)', opacity: 0 },
          '50%': { opacity: 1 },
          '100%': { transform: 'translateY(-100vh)', opacity: 0 }
        }
      }
    }
  },
  plugins: []
}
