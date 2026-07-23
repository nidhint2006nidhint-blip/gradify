import { Link } from "react-router-dom";
import Logo from "./Logo";
import { Github, Mail, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950">
      <div className="mx-auto max-w-6xl px-6 py-14 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-3">
            <Logo className="h-7 w-7" />
            <span className="font-display font-bold text-ink-900 dark:text-white">
              Gradify
            </span>
          </Link>
          <p className="text-sm text-ink-500 dark:text-ink-400 max-w-xs">
            Publication-ready charts, statistics and diagrams for
            assignments — built for students.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900 dark:text-white mb-3">
            Product
          </h4>
          <ul className="space-y-2 text-sm text-ink-500 dark:text-ink-400">
            <li><a href="#features" className="hover:text-primary-600 dark:hover:text-primary-300">Features</a></li>
            <li><a href="#pricing" className="hover:text-primary-600 dark:hover:text-primary-300">Pricing</a></li>
            <li><a href="#faq" className="hover:text-primary-600 dark:hover:text-primary-300">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900 dark:text-white mb-3">
            Account
          </h4>
          <ul className="space-y-2 text-sm text-ink-500 dark:text-ink-400">
            <li><Link to="/login" className="hover:text-primary-600 dark:hover:text-primary-300">Sign in</Link></li>
            <li><Link to="/dashboard" className="hover:text-primary-600 dark:hover:text-primary-300">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900 dark:text-white mb-3">
            Connect
          </h4>
          <div className="flex gap-3">
            <a href="#" aria-label="Email" className="h-9 w-9 flex items-center justify-center rounded-full border border-ink-200 dark:border-ink-700 text-ink-500 dark:text-ink-400 hover:text-primary-600 dark:hover:text-primary-300 hover:border-primary-300">
              <Mail size={16} />
            </a>
            <a href="#" aria-label="Twitter" className="h-9 w-9 flex items-center justify-center rounded-full border border-ink-200 dark:border-ink-700 text-ink-500 dark:text-ink-400 hover:text-primary-600 dark:hover:text-primary-300 hover:border-primary-300">
              <Twitter size={16} />
            </a>
            <a href="#" aria-label="Github" className="h-9 w-9 flex items-center justify-center rounded-full border border-ink-200 dark:border-ink-700 text-ink-500 dark:text-ink-400 hover:text-primary-600 dark:hover:text-primary-300 hover:border-primary-300">
              <Github size={16} />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-ink-100 dark:border-ink-800 py-5 text-center text-xs text-ink-400">
        © {new Date().getFullYear()} Gradify. Built for students.
      </div>
    </footer>
  );
}
