import React, { createContext, useContext, useState, ReactNode } from 'react';

type ThemeType = 'purple' | 'white';

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
}

interface ThemeContextType {
  theme: ThemeType;
  colors: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themeColors = {
  purple: {
    primary: '#A020F0',
    secondary: '#FF69B4',
    background: '#000000',
    surface: 'rgba(255, 255, 255, 0.05)',
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    border: 'rgba(160, 32, 240, 0.3)',
    accent: '#A020F0',
    error: '#FF6B6B',
  },
  white: {
    primary: '#A020F0',
    secondary: '#FF69B4',
    background: '#FFFFFF',
    surface: 'rgba(160, 32, 240, 0.05)',
    text: '#000000',
    textSecondary: 'rgba(0, 0, 0, 0.7)',
    border: 'rgba(160, 32, 240, 0.2)',
    accent: '#A020F0',
    error: '#FF6B6B',
  },
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>('purple');

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'purple' ? 'white' : 'purple');
  };

  const colors = themeColors[theme];

  return React.createElement(
    ThemeContext.Provider,
    { value: { theme, colors, toggleTheme } },
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