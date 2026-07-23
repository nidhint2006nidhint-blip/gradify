import { motion } from "framer-motion";

export function Spinner({ size = 18, className = "" }) {
  return (
    <motion.span
      className={`inline-block rounded-full border-2 border-current border-t-transparent ${className}`}
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
    />
  );
}

export default function FullPageLoader({ label = "Loading Gradify…" }) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-white dark:bg-ink-950">
      <Spinner size={28} className="text-primary-500" />
      <p className="text-sm text-ink-500 dark:text-ink-400 font-medium">
        {label}
      </p>
    </div>
  );
}
