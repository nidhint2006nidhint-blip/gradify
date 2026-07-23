import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  Settings as SettingsIcon,
  LogOut,
  X,
} from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../hooks/useAuth";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/generate", label: "Generate", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

function SidebarContent({ onNavigate }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-6 py-6">
        <Logo className="h-8 w-8" />
        <span className="font-display font-bold text-lg text-ink-900 dark:text-white">
          Gradify
        </span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
                  : "text-ink-500 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800 hover:text-ink-900 dark:hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-4">
        <div className="flex items-center gap-3 rounded-xl border border-ink-100 dark:border-ink-800 px-3 py-3 mb-2">
          {user?.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-semibold text-sm">
              {user?.name?.[0] || "U"}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink-900 dark:text-white truncate">
              {user?.name}
            </p>
            <p className="text-xs text-ink-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-500 dark:text-ink-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 border-r border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-ink-950 z-50 lg:hidden shadow-soft-lg"
            >
              <button
                onClick={onClose}
                className="absolute top-5 right-4 text-ink-400"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
              <SidebarContent onNavigate={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
