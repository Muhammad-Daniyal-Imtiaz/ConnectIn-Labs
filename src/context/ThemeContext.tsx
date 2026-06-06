"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "emerald" | "grey" | "blue" | "mirror" | "sunset" | "lavender" | "rose" | "teal" | "amber" | "crimson";

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const VALID_THEMES: Theme[] = ["emerald", "grey", "blue", "mirror", "sunset", "lavender", "rose", "teal", "amber", "crimson"];

const ThemeContext = createContext<ThemeContextType>({ theme: "emerald", setTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("emerald");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("connectin-theme") as Theme | null;
    if (saved && VALID_THEMES.includes(saved)) {
      setThemeState(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      document.documentElement.setAttribute("data-theme", "emerald");
    }
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("connectin-theme", t);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
