'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ThemeColors {
  id: string;
  name: string;
  nameZh: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  gradient: string;
  bgGradient: string;
}

export const THEMES: ThemeColors[] = [
  {
    id: 'default',
    name: 'Default Blue',
    nameZh: '默认蓝',
    primary: '#3b82f6',
    primaryLight: '#60a5fa',
    primaryDark: '#2563eb',
    gradient: 'from-blue-500 to-indigo-600',
    bgGradient: 'from-blue-50 via-white to-indigo-50',
  },
  {
    id: 'pink',
    name: 'Soft Pink',
    nameZh: '粉红色',
    primary: '#ec4899',
    primaryLight: '#f472b6',
    primaryDark: '#db2777',
    gradient: 'from-pink-400 to-rose-500',
    bgGradient: 'from-pink-50 via-white to-rose-50',
  },
  {
    id: 'green',
    name: 'Fresh Green',
    nameZh: '嫩绿色',
    primary: '#22c55e',
    primaryLight: '#4ade80',
    primaryDark: '#16a34a',
    gradient: 'from-green-400 to-emerald-500',
    bgGradient: 'from-green-50 via-white to-emerald-50',
  },
  {
    id: 'sky',
    name: 'Sky Blue',
    nameZh: '天蓝色',
    primary: '#0ea5e9',
    primaryLight: '#38bdf8',
    primaryDark: '#0284c7',
    gradient: 'from-sky-400 to-cyan-500',
    bgGradient: 'from-sky-50 via-white to-cyan-50',
  },
  {
    id: 'peach',
    name: 'Peach Orange',
    nameZh: '桃橙色',
    primary: '#f97316',
    primaryLight: '#fb923c',
    primaryDark: '#ea580c',
    gradient: 'from-orange-400 to-amber-500',
    bgGradient: 'from-orange-50 via-white to-amber-50',
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    nameZh: '紫色',
    primary: '#8b5cf6',
    primaryLight: '#a78bfa',
    primaryDark: '#7c3aed',
    gradient: 'from-violet-500 to-purple-600',
    bgGradient: 'from-violet-50 via-white to-purple-50',
  },
  {
    id: 'teal',
    name: 'Teal',
    nameZh: '青色',
    primary: '#14b8a6',
    primaryLight: '#2dd4bf',
    primaryDark: '#0d9488',
    gradient: 'from-teal-400 to-cyan-600',
    bgGradient: 'from-teal-50 via-white to-cyan-50',
  },
  {
    id: 'red',
    name: 'Chinese Red',
    nameZh: '中国红',
    primary: '#dc2626',
    primaryLight: '#ef4444',
    primaryDark: '#b91c1c',
    gradient: 'from-red-500 to-rose-600',
    bgGradient: 'from-red-50 via-white to-rose-50',
  },
];

interface ThemeContextType {
  theme: ThemeColors;
  setTheme: (themeId: string) => void;
  themes: ThemeColors[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'hsk-ai-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeColors>(THEMES[0]);
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedThemeId = localStorage.getItem(STORAGE_KEY);
    if (savedThemeId) {
      const savedTheme = THEMES.find((t) => t.id === savedThemeId);
      if (savedTheme) {
        setThemeState(savedTheme);
      }
    }
  }, []);

  // Apply CSS variables when theme changes
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-primary-light', theme.primaryLight);
    root.style.setProperty('--color-primary-dark', theme.primaryDark);

    // Update meta theme color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme.primary);
    }
  }, [theme, mounted]);

  const setTheme = (themeId: string) => {
    console.log('🎨 Setting theme:', themeId);
    const newTheme = THEMES.find((t) => t.id === themeId);
    if (newTheme) {
      console.log('✅ Theme found:', newTheme.name);
      setThemeState(newTheme);
      localStorage.setItem(STORAGE_KEY, themeId);
      
      // Apply CSS variables immediately
      const root = document.documentElement;
      root.style.setProperty('--color-primary', newTheme.primary);
      root.style.setProperty('--color-primary-light', newTheme.primaryLight);
      root.style.setProperty('--color-primary-dark', newTheme.primaryDark);
    }
  };

  // Always provide context, even before mount
  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Return default values during SSR or when provider is not available
    return {
      theme: THEMES[0],
      setTheme: () => {},
      themes: THEMES,
    };
  }
  return context;
}
