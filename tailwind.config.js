/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/client/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'game-primary': '#2563eb',
          'game-secondary': '#4b5563',
          'game-accent': '#f59e0b',
          'territory': {
            'default': '#d1d5db',
            'hover': '#9ca3af',
            'selected': '#60a5fa',
            'enemy': '#ef4444',
            'friendly': '#22c55e',
          }
        },
        animation: {
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'bounce-slow': 'bounce 2s infinite',
          'fade-in': 'fadeIn 0.5s ease-in',
          'slide-in': 'slideIn 0.3s ease-out'
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          slideIn: {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(0)' },
          }
        },
        spacing: {
          '128': '32rem',
          '144': '36rem',
        },
        fontSize: {
          'xxs': '0.625rem',
        },
        height: {
          'screen-90': '90vh',
        },
        width: {
          'screen-90': '90vw',
        },
        zIndex: {
          '100': '100',
          'max': '999',
        }
      }
    },
    plugins: [],
  }