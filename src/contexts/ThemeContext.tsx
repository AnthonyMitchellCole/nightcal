import { createContext, useContext, useEffect, useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => Promise<void>;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<'light' | 'dark'>('dark');
  const [loading, setLoading] = useState(true);
  const { profile } = useProfile();
  const { user } = useAuth();

  // Apply theme to body
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, [theme]);

  // Load theme from profile when available
  useEffect(() => {
    if (profile?.theme) {
      setThemeState(profile.theme as 'light' | 'dark');
    }
    setLoading(false);
  }, [profile]);

  const setTheme = async (newTheme: 'light' | 'dark') => {
    if (!user) return;

    setThemeState(newTheme);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ theme: newTheme })
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating theme:', err);
      // Revert theme on error
      setThemeState(theme);
    }
  };

  const value = {
    theme,
    setTheme,
    loading
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};