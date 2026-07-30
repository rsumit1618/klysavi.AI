import React, { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors as lightColors } from './colors';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  primary: string;
  primaryDark: string;
  secondary: string;
  darkGreen: string;
  emeraldAccent: string;
  mintBg: string;
  gold: string;
  goldLight: string;
  goldDark: string;
  buttonYellow: string;
  aiBlue: string;
  iceBlue: string;
  background: string;
  splashBg: string;
  lightBg: string;
  cardMint: string;
  surface: string;
  surfaceLight: string;
  surfaceCard: string;
  card: string;
  text: string;
  textDark: string;
  textPrimary: string;
  textMuted: string;
  textSecondary: string;
  white: string;
  border: string;
  borderDark: string;
  borderGold: string;
  shadowGold: string;
  error: string;
  danger: string;
}

export const darkColors: ThemeColors = {
  ...lightColors,
  background: '#0B0F12',
  lightBg: '#12181F',
  surface: '#1A222C',
  surfaceLight: '#212B37',
  surfaceCard: '#1E2632',
  cardMint: '#172B26',
  text: '#F5F7FA',
  textDark: '#F0F4F8',
  textPrimary: '#F0F4F8',
  textMuted: '#94A3B8',
  textSecondary: '#A0AEC0',
  border: '#2A3646',
  borderDark: '#3A4A5E',
};

type ThemeContextType = {
  mode: ThemeMode;
  isDark: boolean;
  themeColors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
};

const THEME_STORAGE_KEY = '@klysavo_theme_mode';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemColorScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((savedMode) => {
        if (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system') {
          setModeState(savedMode);
        }
      })
      .catch((err) => console.warn('Failed to load theme preference:', err));
  }, []);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    AsyncStorage.setItem(THEME_STORAGE_KEY, newMode).catch((err) =>
      console.warn('Failed to save theme preference:', err)
    );
  };

  const toggleTheme = () => {
    const nextMode = isDark ? 'light' : 'dark';
    setMode(nextMode);
  };

  const isDark =
    mode === 'dark' || (mode === 'system' && systemColorScheme === 'dark');

  const themeColors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ mode, isDark, themeColors, setMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Graceful fallback if used outside Provider
    return {
      mode: 'light' as ThemeMode,
      isDark: false,
      themeColors: lightColors,
      setMode: () => {},
      toggleTheme: () => {},
    };
  }
  return context;
}
