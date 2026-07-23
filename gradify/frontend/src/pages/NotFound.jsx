import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-white dark:bg-ink-950">
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-7xl font-bold gradient-text mb-3"
      >
        404
      </motion.p>
      <h1 className="font-display text-xl font-semibold text-ink-900 dark:text-white mb-2">
        Page not found
      </h1>
      <p className="text-sm text-ink-500 dark:text-ink-400 mb-8 max-w-sm">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/" className="btn-primary">
        <Home size={16} /> Back to home
      </Link>
    </div>
  );
}
