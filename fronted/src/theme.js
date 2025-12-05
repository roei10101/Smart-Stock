import { createTheme } from '@mui/material/styles';

// Design tokens for Light and Dark modes
export const getDesignTokens = (mode) => ({
    direction: 'rtl',
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                // Light Mode Palette
                primary: {
                    main: '#2563eb', // Vibrant Blue
                    light: '#60a5fa',
                    dark: '#1e40af',
                },
                secondary: {
                    main: '#7c3aed', // Modern Purple
                    light: '#a78bfa',
                    dark: '#5b21b6',
                },
                background: {
                    default: '#f3f4f6', // Soft Gray
                    paper: '#ffffff',
                },
                text: {
                    primary: '#111827', // Deep Gray/Black
                    secondary: '#4b5563',
                },
            }
            : {
                // Dark Mode Palette
                primary: {
                    main: '#3b82f6', // Brighter Blue for dark bg
                    light: '#60a5fa',
                    dark: '#1d4ed8',
                },
                secondary: {
                    main: '#8b5cf6', // Brighter Purple
                    light: '#a78bfa',
                    dark: '#6d28d9',
                },
                background: {
                    default: '#0b0f19', // Very Dark Blue/Black
                    paper: '#111827', // Dark Gray Blue
                },
                text: {
                    primary: '#f9fafb', // Off-white
                    secondary: '#9ca3af', // Light Gray
                },
            }),
    },
    typography: {
        fontFamily: 'Assistant, Alef, Arial, sans-serif',
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 600 },
        h4: { fontWeight: 600 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none', // Remove default gradient in dark mode for cleaner look
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: mode === 'light' ? '#ffffff' : '#111827',
                    color: mode === 'light' ? '#111827' : '#ffffff',
                    boxShadow: mode === 'light' ? '0px 1px 4px rgba(0,0,0,0.05)' : '0px 1px 4px rgba(0,0,0,0.2)',
                },
            },
        },
    },
});
