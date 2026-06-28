"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const THEME_KEY = "flechettes.theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_KEY);
    const nextTheme = storedTheme === "light" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem(THEME_KEY, nextTheme);
  }

  return (
    <div className="rounded-md border border-line bg-panel/95 p-1 shadow-lg">
      <button
        aria-label={theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre"}
        className="focus-ring rounded px-3 py-2 text-sm font-bold transition hover:bg-felt"
        type="button"
        onClick={toggleTheme}
      >
        {theme === "dark" ? "Mode clair" : "Mode sombre"}
      </button>
    </div>
  );
}
