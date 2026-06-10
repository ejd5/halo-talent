"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

export type ThemeMode = "auto-system" | "auto-clock" | "light" | "dark";
export type Theme = "light" | "dark";

interface ThemeConfig {
  mode: ThemeMode;
  theme: Theme;
  clockDayStart: number; // hour (0-23), default 7
  clockNightStart: number; // hour (0-23), default 19
}

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  config: ThemeConfig;
  updateConfig: (partial: Partial<ThemeConfig>) => void;
}

const STORAGE_KEY = "halo-theme-config";

const defaultConfig: ThemeConfig = {
  mode: "auto-system",
  theme: "light",
  clockDayStart: 7,
  clockNightStart: 19,
};

function loadConfig(): ThemeConfig {
  if (typeof window === "undefined") return defaultConfig;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultConfig, ...JSON.parse(stored) };
  } catch {}
  return defaultConfig;
}

function saveConfig(config: ThemeConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {}
}

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getClockTheme(config: ThemeConfig): Theme {
  const hour = new Date().getHours();
  if (config.clockDayStart <= config.clockNightStart) {
    return hour >= config.clockDayStart && hour < config.clockNightStart ? "light" : "dark";
  }
  return hour >= config.clockDayStart || hour < config.clockNightStart ? "light" : "dark";
}

function resolveTheme(mode: ThemeMode, config: ThemeConfig): Theme {
  switch (mode) {
    case "light":
      return "light";
    case "dark":
      return "dark";
    case "auto-clock":
      return getClockTheme(config);
    case "auto-system":
    default:
      return getSystemTheme();
  }
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  mode: "auto-system",
  setMode: () => {},
  config: defaultConfig,
  updateConfig: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ThemeConfig>(defaultConfig);
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Load config from localStorage on mount
  useEffect(() => {
    const loaded = loadConfig();
    setConfig(loaded);
    setTheme(resolveTheme(loaded.mode, loaded));
    setMounted(true);
  }, []);

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Listen for system theme changes (auto-system mode)
  useEffect(() => {
    if (config.mode !== "auto-system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setTheme(getSystemTheme());
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [config.mode]);

  // Clock mode: check every minute
  useEffect(() => {
    if (config.mode !== "auto-clock") return;
    const interval = setInterval(() => {
      setTheme(getClockTheme(config));
    }, 60_000);
    return () => clearInterval(interval);
  }, [config.mode, config.clockDayStart, config.clockNightStart]);

  const setMode = useCallback((mode: ThemeMode) => {
    setConfig((prev) => {
      const next = { ...prev, mode };
      setTheme(resolveTheme(mode, next));
      saveConfig(next);
      return next;
    });
  }, []);

  const updateConfig = useCallback((partial: Partial<ThemeConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...partial };
      setTheme(resolveTheme(next.mode, next));
      saveConfig(next);
      return next;
    });
  }, []);

  // Prevent flash of wrong theme by rendering nothing until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, mode: config.mode, setMode, config, updateConfig }}>
      {children}
    </ThemeContext.Provider>
  );
}
