/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem',
      },
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',  // Main primary color
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        accent: {
          500: '#ff6b6b',  // Bright red accent
          600: '#ff5252',
        },
        manga: {
          light: '#faf7ff',
          dark: '#2a1f3f',
        }
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#FF6B6B",           
          "primary-focus": "#FF5252",   
          "primary-content": "#ffffff",
          
          "secondary": "#4ECDC4",      
          "secondary-focus": "#45B7AE",   
          "secondary-content": "#ffffff", 
          "accent": "#FFE66D",          
          "accent-focus": "#FFD93D", 
          "accent-content": "#2C3E50",
          "neutral": "#2C3E50",    
          "neutral-focus": "#34495E",    
          "neutral-content": "#ffffff", 
          
          "base-100": "#ffffff",     
          "base-200": "#F7FAFC",     
          "base-300": "#E2E8F0",     
          "base-content": "#2C3E50", 
    
          "info": "#3498DB",             
          "success": "#2ECC71",          
          "warning": "#F1C40F",          
          "error": "#E74C3C",            
          
          "--rounded-box": "0.5rem",     
          "--rounded-btn": "0.5rem",     
          "--rounded-badge": "1.9rem",   
          "--animation-btn": "0.25s",    
          "--animation-input": "0.2s",   
          "--btn-focus-scale": "0.95",   
          "--border-btn": "1px",         
          "--tab-border": "1px",         
          "--tab-radius": "0.5rem",      
        },
      },
    ],
  },
}