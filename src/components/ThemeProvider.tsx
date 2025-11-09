// src/components/ThemeProvider.tsx
import React, { useEffect } from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  useEffect(() => {
    // Initialize theme on app load
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    let themeToApply: 'light' | 'dark';
    
    if (savedTheme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      themeToApply = isDark ? 'dark' : 'light';
    } else {
      themeToApply = savedTheme as 'light' | 'dark';
    }
    
    document.documentElement.setAttribute('data-theme', themeToApply);
    
    // Listen for system theme changes if auto mode
    if (savedTheme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  return <>{children}</>;
};

export default ThemeProvider;