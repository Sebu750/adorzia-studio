import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface StudioThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const StudioThemeContext = createContext<StudioThemeContextType | undefined>(undefined);

const STUDIO_THEME_KEY = 'studio-theme';

export function StudioThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STUDIO_THEME_KEY);
      if (stored === 'dark' || stored === 'light') return stored;
    }
    return 'light'; // default
  });

  useEffect(() => {
    localStorage.setItem(STUDIO_THEME_KEY, theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <StudioThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <div className={theme === 'dark' ? 'studio-dark' : 'studio-light'}>
        {children}
      </div>
    </StudioThemeContext.Provider>
  );
}

export function useStudioTheme() {
  const context = useContext(StudioThemeContext);
  if (!context) {
    return {
      theme: 'light' as Theme,
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
  return context;
}