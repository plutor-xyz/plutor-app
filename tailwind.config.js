/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        plutor: {
          purple: {
            DEFAULT: '#6B46C1',
            light: '#8B5CF6',
            dark: '#5B3BA1',
            50: '#F3F0FF',
            100: '#E9E3FF',
            200: '#D6CCFF',
            300: '#B8A5FF',
            400: '#9574FF',
            500: '#6B46C1',
            600: '#5B3BA1',
            700: '#4C3282',
            800: '#3E2B69',
            900: '#332454',
          },
          gold: {
            DEFAULT: '#F59E0B',
            light: '#FCD34D',
            dark: '#D97706',
            50: '#FFFBEB',
            100: '#FEF3C7',
            200: '#FDE68A',
            300: '#FCD34D',
            400: '#FBBF24',
            500: '#F59E0B',
            600: '#D97706',
            700: '#B45309',
            800: '#92400E',
            900: '#78350F',
          },
          navy: {
            DEFAULT: '#0F172A',
            light: '#1E293B',
            dark: '#020617',
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            400: '#94A3B8',
            500: '#64748B',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
            950: '#020617',
          },
          blue: '#3B82F6',
          green: {
            DEFAULT: '#A0E66E',
            light: '#B8ED85',
            dark: '#143200',
            bright: '#39FF14',
            50: '#F0FDF4',
            100: '#DCFCE7',
            200: '#BBF7D0',
            300: '#86EFAC',
            400: '#4ADE80',
            500: '#A0E66E',
            600: '#7EE03E',
            700: '#143200',
            800: '#0A1A00',
            900: '#051000',
          },
          red: '#EF4444',
          gray: '#64748B',
        },
        // Semantic color mappings aligned with HeroSection
        primary: {
          DEFAULT: '#A0E66E',
          foreground: '#143200',
          hover: '#B8ED85',
          muted: 'rgba(160, 230, 110, 0.7)',
          border: 'rgba(160, 230, 110, 0.3)',
        },
        secondary: {
          DEFAULT: '#39FF14',
          foreground: '#000000',
          muted: 'rgba(57, 255, 20, 0.7)',
        },
        background: {
          DEFAULT: '#000000',
          light: '#0F0F0F',
          card: 'rgba(0, 0, 0, 0.5)',
          muted: 'rgba(15, 15, 15, 0.8)',
        },
        foreground: {
          DEFAULT: '#FFFFFF',
          primary: '#A0E66E',
          muted: 'rgb(209, 213, 219)', // gray-300
          accent: '#143200',
        },
        border: {
          DEFAULT: 'rgba(160, 230, 110, 0.3)',
          muted: 'rgba(160, 230, 110, 0.1)',
        },
        text: {
          DEFAULT: '#FFFFFF',
          primary: '#A0E66E',
          secondary: '#143200',
          muted: 'rgb(209, 213, 219)', // gray-300
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        'hero': ['4rem', { lineHeight: '1.1', fontWeight: '700' }],
        'display-1': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],
        'display-2': ['2.25rem', { lineHeight: '1.3', fontWeight: '700' }],
        'display-3': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'display-4': ['1.25rem', { lineHeight: '1.5', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.4' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'plutor': '0 4px 6px rgba(107, 70, 193, 0.1)',
        'plutor-md': '0 10px 15px rgba(107, 70, 193, 0.15)',
        'plutor-lg': '0 20px 25px rgba(107, 70, 193, 0.2)',
        'glow': '0 0 20px rgba(107, 70, 193, 0.3)',
        'glow-gold': '0 0 20px rgba(245, 158, 11, 0.3)',
      },
      animation: {
        'orbital': 'orbital 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'gradient-shift': 'gradient-shift 8s ease-in-out infinite',
      },
      keyframes: {
        orbital: {
          '0%, 100%': { transform: 'rotate(0deg) translateX(20px) rotate(0deg)' },
          '50%': { transform: 'rotate(180deg) translateX(20px) rotate(-180deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 20px rgba(107, 70, 193, 0.2)' },
          'to': { boxShadow: '0 0 30px rgba(107, 70, 193, 0.4)' },
        },
        'gradient-shift': {
          '0%, 100%': { 
            backgroundPosition: '0% 50%',
            backgroundSize: '400% 400%'
          },
          '50%': { 
            backgroundPosition: '100% 50%',
            backgroundSize: '400% 400%'
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cosmic': 'linear-gradient(135deg, #A0E66E 0%, #000000 100%)',
        'cosmic-light': 'linear-gradient(135deg, #A0E66E 0%, #7EE03E 100%)',
        'wealth': 'linear-gradient(135deg, #A0E66E 0%, #39FF14 100%)',
        'cosmic-green': 'linear-gradient(135deg, #A0E66E 0%, #143200 50%, #000000 100%)',
        'cosmic-green-animated': 'linear-gradient(-45deg, #000000, #0A1A00, #143200, #0A1A00, #000000)',
      },
    },
  },
  plugins: [],
}

module.exports = config