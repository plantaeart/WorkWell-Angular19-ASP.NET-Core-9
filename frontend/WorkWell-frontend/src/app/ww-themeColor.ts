import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const WwThemeColor = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#e6f2fc',
      100: '#cce5f9',
      200: '#99cbf3',
      300: '#66b0ed',
      400: '#3396e7',
      500: '#0267C1', // Primary color
      600: '#025aa9',
      700: '#024c91',
      800: '#013f79',
      900: '#013161',
    },
    secondary: {
      50: '#ffffff',
      100: '#fefefe',
      200: '#fcfdfc',
      300: '#fafcf9',
      400: '#f8fbf6',
      500: '#F5FBEF', // Secondary color
      600: '#dce2d7',
      700: '#c3c9bf',
      800: '#aab0a7',
      900: '#91978f',
    },
    colorScheme: {
      light: {
        primary: {
          color: '#0267C1', // Primary color
          inverseColor: '#ffffff',
          hoverColor: '#3396e7', // Lighter shade for hover
          activeColor: '#024c91', // Darker shade for active
        },
        highlight: {
          background: '#0267C1',
          focusBackground: '#3396e7',
          color: '#000411', // Text color
          focusColor: '#000411', // Focused text color
        },
      },
      dark: {
        primary: {
          color: '#3396e7', // Lighter shade for dark mode
          inverseColor: '#0267C1',
          hoverColor: '#66b0ed',
          activeColor: '#cce5f9',
        },
        highlight: {
          background: 'rgba(250, 250, 250, .16)',
          focusBackground: 'rgba(250, 250, 250, .24)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)',
        },
      },
    },
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    fontSize: {
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
    textColor: {
      primary: '#000411', // Text color
    },
  },
});
