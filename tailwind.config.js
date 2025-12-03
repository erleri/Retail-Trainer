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
          DEFAULT: '#111827', // Dark Navy (Premium)
          hover: '#1F2937',
          light: '#374151',
        },
        secondary: {
          DEFAULT: '#10B981', // Teal/Mint (Accent)
          hover: '#059669',
          light: '#D1FAE5',
        },
        accent: {
          blue: '#60A5FA', // Calm Blue
          purple: '#8B5CF6', // Soft Purple
          gold: '#F59E0B', // Gold for Badges
        },
        background: '#F9FAFB', // Light Gray (Clean)
        surface: '#FFFFFF',
        text: {
          primary: '#111827', // Almost Black
          secondary: '#4B5563', // Dark Gray
          light: '#9CA3AF', // Light Gray
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans KR', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 8px 16px -4px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glow': '0 0 15px rgba(16, 185, 129, 0.3)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #111827 0%, #1F2937 100%)',
        'gradient-accent': 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        'gradient-gold': 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)',
        'gradient-glass': 'linear-gradient(145deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 100%)',
      }
    },
  },
  plugins: [],
}
