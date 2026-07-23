import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-medium text-ink-900 dark:text-white">
          {question}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-ink-400 shrink-0"
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm text-ink-500 dark:text-ink-400 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
