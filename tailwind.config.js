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
            DEFAULT: '#10B981',
            light: '#34D399',
            dark: '#059669',
            50: '#ECFDF5',
            100: '#D1FAE5',
            200: '#A7F3D0',
            300: '#6EE7B7',
            400: '#34D399',
            500: '#10B981',
            600: '#059669',
            700: '#047857',
            800: '#065F46',
            900: '#064E3B',
          },
          red: '#EF4444',
          gray: '#64748B',
        },
        // Semantic color mappings
        primary: {
          DEFAULT: '#6B46C1',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F59E0B',
          foreground: '#0F172A',
        },
        background: {
          DEFAULT: '#0F172A',
          light: '#F8FAFC',
        },
        foreground: {
          DEFAULT: '#F8FAFC',
          muted: '#94A3B8',
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
        'cosmic': 'linear-gradient(135deg, #10B981 0%, #0F172A 100%)',
        'cosmic-light': 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
        'wealth': 'linear-gradient(135deg, #F59E0B 0%, #10B981 100%)',
        'cosmic-green': 'linear-gradient(135deg, #10B981 0%, #064E3B 50%, #0F172A 100%)',
        'cosmic-green-animated': 'linear-gradient(-45deg, #0F172A, #1E293B, #064E3B, #1E293B, #0F172A)',
      },
    },
  },
  plugins: [],
}

module.exports = config