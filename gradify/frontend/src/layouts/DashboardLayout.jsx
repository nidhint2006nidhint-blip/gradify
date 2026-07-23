import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../hooks/useAuth";

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-ink-50 dark:bg-ink-950">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b border-ink-100 dark:border-ink-800 bg-white/80 dark:bg-ink-950/80 backdrop-blur px-4 py-3">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="text-ink-600 dark:text-ink-300"
          >
            <Menu size={22} />
          </button>
          <span className="font-display font-semibold text-ink-900 dark:text-white">
            Gradify
          </span>
          <ThemeToggle />
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
}
