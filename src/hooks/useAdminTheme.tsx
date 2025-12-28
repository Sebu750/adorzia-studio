import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface AdminThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

const ADMIN_THEME_KEY = 'admin-theme';

export function AdminThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(ADMIN_THEME_KEY);
      if (stored === 'dark' || stored === 'light') return stored;
    }
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem(ADMIN_THEME_KEY, theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <AdminThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <div className={theme === 'dark' ? 'admin-dark' : 'admin-light'}>
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);
  if (!context) {
    throw new Error('useAdminTheme must be used within an AdminThemeProvider');
  }
  return context;
}
