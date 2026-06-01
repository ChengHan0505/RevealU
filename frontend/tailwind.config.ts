import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#24212d',
        night: '#15121c',
        glass: 'rgba(255, 255, 255, 0.72)',
        violet: '#7d3ff2',
        cyan: '#10bfd0',
        haze: '#f6f2ff',
        app: '#f8f9fb'
      },
      boxShadow: {
        glass: '0 30px 90px rgba(29, 21, 52, 0.14)',
        glow: '0 18px 42px rgba(25, 191, 210, 0.25)',
        soft: '0 24px 70px rgba(33, 26, 54, 0.10)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;
