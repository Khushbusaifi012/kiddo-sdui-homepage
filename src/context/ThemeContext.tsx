import React, { createContext, useContext, useMemo } from 'react';
import type { ThemeConfig } from '../engine/types';

const DEFAULT_THEME: ThemeConfig = {
  primary: '#FF9933',
  secondary: '#FF6600',
  background: '#FFF5E6',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  accent: '#4CAF50',
};

const ThemeContext = createContext<ThemeConfig>(DEFAULT_THEME);

interface ThemeProviderProps {
  theme: ThemeConfig;
  children: React.ReactNode;
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  const value = useMemo(
    () => ({
      primary: theme.primary || DEFAULT_THEME.primary,
      secondary: theme.secondary || DEFAULT_THEME.secondary,
      background: theme.background || DEFAULT_THEME.background,
      surface: theme.surface || DEFAULT_THEME.surface,
      text: theme.text || DEFAULT_THEME.text,
      accent: theme.accent || DEFAULT_THEME.accent,
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeConfig {
  return useContext(ThemeContext);
}
