"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "dark" | "light";

interface DarkModeContextValue {
  theme: Theme;
  toggle: () => void;
}

const DarkModeContext = createContext<DarkModeContextValue>({
  theme: "light",
  toggle: () => {},
});

export function useDarkMode() {
  return useContext(DarkModeContext);
}

export default function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  const applyTheme = (t: Theme) => {
    const root = document.documentElement;
    if (t === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  useEffect(() => {
    // 1. Read explicit user preference from localStorage
    const stored = localStorage.getItem("smadhanx_theme") as Theme | null;

    let resolved: Theme;
    if (stored === "dark" || stored === "light") {
      resolved = stored;
    } else {
      // 2. Default to user's system OS preference
      const prefersDark =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      resolved = prefersDark ? "dark" : "light";
    }

    setTheme(resolved);
    applyTheme(resolved);
    setMounted(true);

    // 3. Listen to system preference changes if user hasn't explicitly overridden it
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (e: MediaQueryListEvent) => {
      const currentStored = localStorage.getItem("smadhanx_theme");
      if (!currentStored) {
        const nextTheme: Theme = e.matches ? "dark" : "light";
        setTheme(nextTheme);
        applyTheme(nextTheme);
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      localStorage.setItem("smadhanx_theme", next);
      applyTheme(next);
      window.dispatchEvent(new CustomEvent("theme-changed", { detail: next }));
      return next;
    });
  }, []);

  return (
    <DarkModeContext.Provider value={{ theme, toggle }}>
      {/* Inline script runs synchronously before paint to prevent FOUC */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var stored = localStorage.getItem('smadhanx_theme');
                var isDark;
                if (stored === 'dark') {
                  isDark = true;
                } else if (stored === 'light') {
                  isDark = false;
                } else {
                  isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                }
                if (isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch(e) {}
            })();
          `,
        }}
      />
      {children}
    </DarkModeContext.Provider>
  );
}
