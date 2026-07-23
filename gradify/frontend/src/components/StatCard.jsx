import { motion } from "framer-motion";

export default function StatCard({ icon: Icon, label, value, accent = "primary", index = 0 }) {
  const accentClasses = {
    primary: "bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300",
    accent: "bg-accent-50 text-accent-600 dark:bg-accent-900/30 dark:text-accent-300",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="card p-5 flex items-center gap-4"
    >
      <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${accentClasses[accent]}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-ink-500 dark:text-ink-400 mb-0.5">
          {label}
        </p>
        <p className="font-mono text-2xl font-semibold text-ink-900 dark:text-white">
          {value}
        </p>
      </div>
    </motion.div>
  );
}
