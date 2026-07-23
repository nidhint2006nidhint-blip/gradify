import { motion } from "framer-motion";

export default function ProgressBar({ value, max, colorClass = "bg-primary-500" }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  return (
    <div className="w-full h-2.5 rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${colorClass}`}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}
