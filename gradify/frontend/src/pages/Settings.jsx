import { motion } from "framer-motion";
import { LogOut, Moon, Sun, Mail, User as UserIcon } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";

export default function Settings() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (!user) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white">
          Settings
        </h1>
        <p className="text-ink-500 dark:text-ink-400 text-sm mt-1">
          Manage your profile and preferences.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card p-6"
      >
        <h2 className="font-display font-semibold text-ink-900 dark:text-white mb-5">
          Profile
        </h2>
        <div className="flex items-center gap-4 mb-6">
          {user.picture ? (
            <img src={user.picture} alt={user.name} className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <div className="h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-semibold text-xl">
              {user.name?.[0] || "U"}
            </div>
          )}
          <div>
            <p className="font-semibold text-ink-900 dark:text-white">{user.name}</p>
            <p className="text-sm text-ink-500 dark:text-ink-400">{user.email}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-ink-100 dark:border-ink-800 px-4 py-3">
            <UserIcon size={16} className="text-ink-400" />
            <div>
              <p className="text-xs text-ink-400">Name</p>
              <p className="text-sm font-medium text-ink-800 dark:text-ink-100">{user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-ink-100 dark:border-ink-800 px-4 py-3">
            <Mail size={16} className="text-ink-400" />
            <div>
              <p className="text-xs text-ink-400">Email</p>
              <p className="text-sm font-medium text-ink-800 dark:text-ink-100">{user.email}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="card p-6"
      >
        <h2 className="font-display font-semibold text-ink-900 dark:text-white mb-5">
          Preferences
        </h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === "dark" ? (
              <Moon size={18} className="text-primary-400" />
            ) : (
              <Sun size={18} className="text-accent-500" />
            )}
            <div>
              <p className="text-sm font-medium text-ink-900 dark:text-white">
                Dark mode
              </p>
              <p className="text-xs text-ink-400">
                Switch between light and dark themes
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative h-7 w-[52px] rounded-full transition-colors ${
              theme === "dark" ? "bg-primary-500" : "bg-ink-200"
            }`}
            aria-label="Toggle dark mode"
          >
            <motion.span
              className="absolute top-1 h-5 w-5 rounded-full bg-white shadow"
              animate={{ left: theme === "dark" ? 28 : 4 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.16 }}
        className="card p-6"
      >
        <h2 className="font-display font-semibold text-ink-900 dark:text-white mb-1">
          Account
        </h2>
        <p className="text-xs text-ink-400 mb-4">
          Sign out of Gradify on this device.
        </p>
        <button onClick={logout} className="btn-outline text-red-600 dark:text-red-400 border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20">
          <LogOut size={16} /> Sign out
        </button>
      </motion.div>
    </div>
  );
}
