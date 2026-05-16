"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  if (!mounted) {
    return <div className="p-2 w-10 h-10" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 border-2 border-primary-blue rounded-sm hover:bg-primary-blue/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blueprint-blue"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <span className="text-paper-white font-mono text-xs uppercase font-bold">Light</span>
      ) : (
        <span className="text-academic-gray font-mono text-xs uppercase font-bold">Dark</span>
      )}
    </button>
  );
}
