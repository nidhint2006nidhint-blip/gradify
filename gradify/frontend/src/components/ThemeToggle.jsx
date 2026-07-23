import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors ${className}`}
    >
      {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
