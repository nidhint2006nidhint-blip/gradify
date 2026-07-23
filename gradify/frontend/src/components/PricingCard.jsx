import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

export default function PricingCard({
  name,
  price,
  suffix,
  description,
  features,
  cta,
  highlighted = false,
  index = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative rounded-xl2 p-8 flex flex-col ${
        highlighted
          ? "bg-ink-900 dark:bg-ink-900 text-white shadow-soft-lg border border-ink-800 md:-translate-y-3"
          : "card"
      }`}
    >
      {highlighted && (
        <span className="absolute -top-3 left-8 rounded-full bg-accent-400 text-ink-900 text-xs font-bold px-3 py-1">
          Most popular
        </span>
      )}
      <h3
        className={`font-display font-semibold text-lg mb-1 ${
          highlighted ? "text-white" : "text-ink-900 dark:text-white"
        }`}
      >
        {name}
      </h3>
      <p
        className={`text-sm mb-6 ${
          highlighted ? "text-ink-300" : "text-ink-500 dark:text-ink-400"
        }`}
      >
        {description}
      </p>
      <div className="mb-6">
        <span className="font-display text-4xl font-bold">{price}</span>
        {suffix && (
          <span
            className={`text-sm ml-1 ${
              highlighted ? "text-ink-300" : "text-ink-500 dark:text-ink-400"
            }`}
          >
            {suffix}
          </span>
        )}
      </div>
      <ul className="space-y-3 mb-8 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm">
            <Check
              size={16}
              className={`mt-0.5 shrink-0 ${
                highlighted ? "text-accent-400" : "text-primary-500"
              }`}
            />
            <span className={highlighted ? "text-ink-200" : "text-ink-600 dark:text-ink-300"}>
              {f}
            </span>
          </li>
        ))}
      </ul>
      <Link
        to="/login"
        className={highlighted ? "btn-accent w-full" : "btn-primary w-full"}
      >
        {cta}
      </Link>
    </motion.div>
  );
}
