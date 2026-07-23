import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../hooks/useAuth";

const links = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-4">
        <nav className="glass flex items-center justify-between rounded-2xl px-4 py-3 shadow-soft">
          <Link to="/" className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="font-display font-bold text-lg text-ink-900 dark:text-white">
              Gradify
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ink-600 dark:text-ink-300 hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary">
                Dashboard <ArrowRight size={15} />
              </Link>
            ) : (
              <>
                <NavLink to="/login" className="btn-ghost">
                  Sign in
                </NavLink>
                <Link to="/login" className="btn-primary">
                  Get started <ArrowRight size={15} />
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-700 dark:text-ink-200"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden glass mt-2 rounded-2xl px-5 py-4 shadow-soft overflow-hidden"
            >
              <div className="flex flex-col gap-4">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-sm font-medium text-ink-700 dark:text-ink-200"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="flex items-center gap-3 pt-2 border-t border-ink-100 dark:border-ink-800">
                  <ThemeToggle />
                  {isAuthenticated ? (
                    <Link to="/dashboard" className="btn-primary flex-1">
                      Dashboard
                    </Link>
                  ) : (
                    <Link to="/login" className="btn-primary flex-1">
                      Get started
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
