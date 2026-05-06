import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1A2A5E',   // Azul marinho primário
          green: '#2D5A3D',  // Verde escuro secundário
          gray: '#F5F5F5',   // Cinza claro de fundo
          white: '#FFFFFF',  // Branco
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Hierarquia tipográfica conforme design
        'h1': ['3rem', { fontWeight: '700', lineHeight: '1.2' }],
        'h2': ['2rem', { fontWeight: '700', lineHeight: '1.3' }],
        'h3': ['1.25rem', { fontWeight: '600', lineHeight: '1.4' }],
        'body': ['1rem', { fontWeight: '400', lineHeight: '1.6' }],
        'small': ['0.875rem', { fontWeight: '400', lineHeight: '1.5' }],
      },
      screens: {
        // Breakpoints conforme design
        // Mobile: < 768px (default)
        'md': '768px',   // Tablet: 768px–1024px
        'lg': '1024px',  // Desktop: > 1024px
        'xl': '1280px',
        '2xl': '1440px', // Máximo: 1440px
      },
      maxWidth: {
        'site': '1440px',
      },
      spacing: {
        // Elemento interativo mínimo: 44×44px
        'touch': '44px',
      },
    },
  },
  plugins: [],
};

export default config;
