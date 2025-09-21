'use client'

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00E5FF',
      light: '#62EFFF',
      dark: '#00B2CC',
    },
    secondary: {
      main: '#FF6B35',
      light: '#FF8A65',
      dark: '#E64A19',
    },
    background: {
      default: '#0A0E1A',
      paper: '#1A1F2E',
    },
    success: {
      main: '#00E676',
      light: '#69F0AE',
      dark: '#00C853',
    },
    warning: {
      main: '#FFB74D',
      light: '#FFCC02',
      dark: '#FF8F00',
    },
    error: {
      main: '#FF5252',
      light: '#FF8A80',
      dark: '#D32F2F',
    },
    info: {
      main: '#40C4FF',
      light: '#80D8FF',
      dark: '#0091EA',
    },
    text: {
      primary: '#E0E6ED',
      secondary: '#A0AEC0',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 800,
      fontSize: '2.5rem',
      background: 'linear-gradient(45deg, #00E5FF, #00B2CC)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 700,
      fontSize: '2rem',
      color: '#E0E6ED',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 700,
      fontSize: '1.75rem',
      background: 'linear-gradient(45deg, #00E5FF, #40C4FF)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '-0.01em',
    },
    h4: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#E0E6ED',
      letterSpacing: '-0.005em',
    },
    h5: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
      fontSize: '1.25rem',
      color: '#E0E6ED',
    },
    h6: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
      fontSize: '1.125rem',
      color: '#E0E6ED',
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '1rem',
      color: '#E0E6ED',
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.875rem',
      color: '#A0AEC0',
      lineHeight: 1.5,
    },
    button: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
    caption: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '0.75rem',
      color: '#A0AEC0',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #0A0E1A 0%, #1A1F2E 50%, #242B3D 100%)',
          minHeight: '100vh',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, #1A1F2E 0%, #242B3D 100%)',
          border: '1px solid rgba(0, 229, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 229, 255, 0.1)',
          borderRadius: 16,
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 229, 255, 0.2)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, #1A1F2E 0%, #242B3D 100%)',
          border: '1px solid rgba(0, 229, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          borderRadius: 16,
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 4px 15px rgba(0, 229, 255, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(0, 229, 255, 0.4)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 500,
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          height: 8,
          background: 'rgba(0, 229, 255, 0.1)',
        },
        bar: {
          background: 'linear-gradient(90deg, #00E5FF, #40C4FF)',
          borderRadius: 10,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            background: 'rgba(26, 31, 46, 0.8)',
            backdropFilter: 'blur(10px)',
            '& fieldset': {
              borderColor: 'rgba(0, 229, 255, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 229, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00E5FF',
              boxShadow: '0 0 10px rgba(0, 229, 255, 0.3)',
            },
          },
        },
      },
    },
  },
});