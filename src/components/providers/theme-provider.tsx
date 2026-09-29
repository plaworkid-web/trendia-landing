"use client";

import { createContext, useCallback, useContext, useEffect, type ReactNode } from "react";
import type { AppearanceSettings } from "@/types/landing";

/**
 * The landing is dark-only.
 *
 * There is no light theme to switch to, so nothing here reads `localStorage`, `prefers-color-scheme` or
 * a CMS mode. That matters for correctness, not just for looks: the page's colours are authored against
 * a dark canvas (a translucent white-on-dark glass over a near-black background), so a "light" render is
 * not a supported state that merely looks worse — it is an unstyled one, which is how a visitor on a
 * light-mode OS used to land on washed-out text and invisible glass borders.
 *
 * `resolvedTheme` and `setTheme` stay in the context so existing callers keep compiling; `setTheme` is a
 * deliberate no-op rather than a silent light switch, and the header no longer renders the toggle.
 */
type Theme = "dark";

interface ThemeContextValue {
  resolvedTheme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Kept for API compatibility with callers that asked the OS. The answer is always dark now. */
export function systemTheme(): Theme {
  return "dark";
}

export function ThemeProvider({
  children,
  appearance,
}: {
  children: ReactNode;
  appearance?: AppearanceSettings | null;
}) {
  // Dark is forced on every render of the document element, and any previously stored preference —
  // which a returning visitor may still carry from when the toggle existed — is removed so it cannot
  // take effect on a later visit.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("dark");
    root.style.colorScheme = "dark";

    try {
      window.localStorage.removeItem("theme");
      window.localStorage.setItem("theme", "dark");
    } catch {
      // Private mode can throw on storage access; the class above is what actually paints the page.
    }

    // The dark_* colours are the only ones applied now; a light_* value would describe a theme that
    // no longer exists.
    const colors = appearance?.colors ?? {};
    const pick = (key: string) => colors[`dark_${key}`] ?? colors[key];

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
  }, [appearance]);

  // A no-op that keeps the shape of the old API. Flipping a class here would undo the block above.
  const setTheme = useCallback((_theme: Theme) => {}, []);

  return (
    <ThemeContext.Provider value={{ resolvedTheme: "dark", setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
