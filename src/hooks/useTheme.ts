// src/hooks/useTheme.ts
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'auto';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'light';
  });

  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Apply theme on mount
    applyTheme(theme);

    // Listen for system theme changes when auto mode
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        const newTheme = e.matches ? 'dark' : 'light';
        setEffectiveTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const applyTheme = (newTheme: Theme) => {
    let themeToApply: 'light' | 'dark';

    if (newTheme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      themeToApply = isDark ? 'dark' : 'light';
    } else {
      themeToApply = newTheme;
    }

    setEffectiveTheme(themeToApply);
    document.documentElement.setAttribute('data-theme', themeToApply);
    localStorage.setItem('theme', newTheme);
  };

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return {
    theme,
    effectiveTheme,
    changeTheme,
  };
};

export default useTheme;