"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { AppearanceSettings } from "@/types/landing";

type Theme = "light" | "dark";

interface ThemeContextValue {
  resolvedTheme: Theme;
  setTheme: (theme: Theme) => void;
}

const STORAGE_KEY = "theme";
const THEME_EVENT = "trendia-theme-change";
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function systemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getTheme(): Theme {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return systemTheme();
}

function subscribe(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onStoreChange();
  };

  media.addEventListener("change", onStoreChange);
  window.addEventListener("storage", handleStorage);
  window.addEventListener(THEME_EVENT, onStoreChange);

  return () => {
    media.removeEventListener("change", onStoreChange);
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(THEME_EVENT, onStoreChange);
  };
}

export function ThemeProvider({
  children,
  appearance,
}: {
  children: ReactNode;
  appearance?: AppearanceSettings | null;
}) {
  const resolvedTheme = useSyncExternalStore(subscribe, getTheme, () => "light" as Theme);

  useEffect(() => {
    if (window.localStorage.getItem(STORAGE_KEY)) return;
    const mode = appearance?.default_mode;
    if (mode === "dark" || mode === "light") {
      window.localStorage.setItem(STORAGE_KEY, mode);
      window.dispatchEvent(new Event(THEME_EVENT));
    }
  }, [appearance?.default_mode]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolvedTheme === "dark");
    root.style.colorScheme = resolvedTheme;

    const colors = appearance?.colors ?? {};
    const isDark = resolvedTheme === "dark";
    const pick = (key: string) => colors[isDark ? `dark_${key}` : `light_${key}`] ?? colors[key];

    const mapping: Array<[string, string | undefined]> = [
      ["--primary", pick("primary")],
      ["--accent", pick("accent")],
      ["--secondary", pick("secondary")],
      ["--destructive", pick("destructive")],
    ];
    for (const [variable, value] of mapping) {
      if (value) root.style.setProperty(variable, value);
      else root.style.removeProperty(variable);
    }

    const gradient1 = colors.background_gradient_1;
    const gradient2 = colors.background_gradient_2;
    if (appearance?.background_mode === "flat") {
      root.style.setProperty("--landing-ambient", "none");
    } else if (gradient1 && gradient2) {
      root.style.setProperty(
        "--landing-ambient",
        `radial-gradient(ellipse 80% 50% at 50% -20%, ${gradient1}22, transparent), radial-gradient(ellipse 60% 40% at 100% 50%, ${gradient2}18, transparent)`,
      );
    } else {
      root.style.removeProperty("--landing-ambient");
    }

    root.dataset.glass = appearance?.glassmorphism_enabled === false ? "off" : "on";
  }, [resolvedTheme, appearance]);

  const setTheme = useCallback((theme: Theme) => {
    window.localStorage.setItem(STORAGE_KEY, theme);
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  return (
    <ThemeContext.Provider value={{ resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
