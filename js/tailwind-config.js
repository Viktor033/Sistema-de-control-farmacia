/* ====================================================================
   Configuración del Tema Tailwind CSS (Modo Oscuro & Paleta Farmacéutica)
   ==================================================================== */

tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          400: '#2dd4bf',
          500: '#14b8a6', // Teal
          600: '#0d9488',
          700: '#0f766e',
        },
        pharma: {
          emerald: '#10b981',
          dark: '#0f172a',
          card: '#1e293b',
          border: '#334155',
        }
      }
    }
  }
};
