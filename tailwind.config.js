/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5', // Indigo 600 (Professional Primary)
          hover: '#4338CA',   // Indigo 700
          light: '#E0E7FF',   // Indigo 100 (Backgrounds)
          dark: '#312E81',    // Indigo 900
        },
        secondary: {
          DEFAULT: '#8B5CF6', // Violet 500
          hover: '#7C3AED',   // Violet 600
          light: '#F3E8FF',   // Violet 100
        },
        accent: {
          success: '#10B981', // Emerald 500
          warning: '#F59E0B', // Amber 500
          danger: '#EF4444',  // Red 500
          info: '#3B82F6',    // Blue 500
        },
        surface: {
          DEFAULT: '#ffffff',
          subtle: '#f8fafc',  // Slate 50
          muted: '#f1f5f9',   // Slate 100
        },
        text: {
          primary: '#0f172a', // Slate 900
          secondary: '#475569', // Slate 600
          muted: '#94a3b8',   // Slate 400
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Dropped Outfit for cleaner look
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.03)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        'gradient-subtle': 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
