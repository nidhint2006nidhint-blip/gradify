import { motion } from "framer-motion";

export default function FeatureCard({ icon: Icon, title, description, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="card p-6 hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className="h-11 w-11 rounded-xl bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300 flex items-center justify-center mb-4">
        <Icon size={20} />
      </div>
      <h3 className="font-display font-semibold text-ink-900 dark:text-white mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-ink-500 dark:text-ink-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
