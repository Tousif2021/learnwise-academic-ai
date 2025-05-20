
import React, { createContext, useContext, useEffect, useState } from "react";
import { getUserPreferences, saveUserPreferences } from "@/services/userPreferencesService";
import { getCurrentUser } from "@/services/authService";
import { UserPreferences } from "@/services/userPreferencesService";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>("system");
  const [userId, setUserId] = useState<string | null>(null);
  
  // Load user preferences on mount
  useEffect(() => {
    const loadUserTheme = async () => {
      try {
        const userResult = await getCurrentUser();
        
        if (userResult.success && userResult.data) {
          setUserId(userResult.data.id);
          
          const preferencesResult = await getUserPreferences(userResult.data.id);
          
          if (preferencesResult.success && preferencesResult.data) {
            setThemeState(preferencesResult.data.theme as Theme);
            applyTheme(preferencesResult.data.theme as Theme);
          }
        } else {
          // No user, use system preference or default to light
          setThemeState("system");
          applyTheme("system");
        }
      } catch (error) {
        console.error("Error loading theme preference:", error);
        setThemeState("system");
        applyTheme("system");
      }
    };
    
    loadUserTheme();
  }, []);
  
  const applyTheme = (newTheme: Theme) => {
    // Remove both classes first
    document.documentElement.classList.remove("light", "dark");
    
    if (newTheme === "system") {
      // Use system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.add("light");
      }
    } else {
      // Apply specified theme
      document.documentElement.classList.add(newTheme);
    }
  };
  
  // Update theme in state, DOM and save to user preferences
  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    
    // Save to user preferences if user is logged in
    if (userId) {
      try {
        const preferencesResult = await getUserPreferences(userId);
        
        if (preferencesResult.success && preferencesResult.data) {
          const updatedPreferences: UserPreferences = {
            ...preferencesResult.data,
            theme: newTheme
          };
          
          await saveUserPreferences(updatedPreferences);
        }
      } catch (error) {
        console.error("Error saving theme preference:", error);
      }
    }
  };
  
  // Listen for system preference changes
  useEffect(() => {
    if (theme !== "system") return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      applyTheme("system");
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  return context;
};
