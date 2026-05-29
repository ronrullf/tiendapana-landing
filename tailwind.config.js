/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '380px',
      },
      colors: {
        bg: '#FFFFFF',
        surface: '#FAFAFA',
        border: '#E5E5E5',
        ink: '#0A0A0A',
        muted: '#737373',
        brand: {
          50:  '#FFF4ED',
          100: '#FFE6D5',
          200: '#FFC9A9',
          300: '#FFA572',
          400: '#FF7A33',
          500: '#FF6B00',
          600: '#E55A00',
          700: '#B84600',
          800: '#8A3500',
          900: '#5C2300',
        },
      },
      backgroundImage: {
        'orange-glow': 'radial-gradient(circle at 50% 0%, rgba(255,107,0,0.08) 0%, transparent 60%)',
        'orange-cta':  'linear-gradient(135deg, #FF7A33 0%, #FF6B00 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '50% 0%' },
          '50%': { backgroundPosition: '50% 100%' },
        },
      },
      animation: {
        'gradient-shift': 'gradient-shift 15s ease infinite',
      },
    },
  },
  plugins: [],
}
