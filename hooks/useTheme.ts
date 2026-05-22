import React, { createContext, useContext, ReactNode } from 'react';

interface Theme {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
  error: string;
  galaxyPurple: string;
  cosmicPink: string;
  starGold: string;
  nebulaBlue: string;
  cardBorder: string;
  cardBorderGradientStart: string;
  cardBorderGradientEnd: string;
}

interface ThemeContextType {
  theme: 'galaxy';
  colors: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themeColors = {
  galaxy: {
    primary: '#E91E8C',
    secondary: '#9C27B0',
    background: '#09060F',
    surface: '#160B25',
    text: '#FFFFFF',
    textSecondary: 'rgba(255,255,255,0.55)',
    border: 'rgba(255,255,255,0.08)',
    accent: '#FF4081',
    error: '#EF4444',
    galaxyPurple: '#9C27B0',
    cosmicPink: '#E91E8C',
    starGold: '#FCD34D',
    nebulaBlue: '#1A0A2E',
    cardBorder: 'rgba(233,30,140,0.25)',
    cardBorderGradientStart: '#E91E8C',
    cardBorderGradientEnd: '#9C27B0',
  },
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const colors = themeColors.galaxy;

  return React.createElement(
    ThemeContext.Provider,
    { value: { theme: 'galaxy', colors, toggleTheme: () => {} } },
    children
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
