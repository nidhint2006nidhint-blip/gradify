import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Wallet,
  BarChart3,
  ArrowRight,
  Image as ImageIcon,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import StatCard from "../components/StatCard";
import ProgressBar from "../components/ProgressBar";
import { useGenerationHistory } from "../hooks/useGenerationHistory";

export default function Dashboard() {
  const { user } = useAuth();
  const { history } = useGenerationHistory();

  if (!user) return null;

  const totalGenerated = user.free_used + Math.max(0, (user.paid_credits ?? 0));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white">
            Welcome back, {user.name?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="text-ink-500 dark:text-ink-400 text-sm mt-1">
            Here's how your charts are looking today.
          </p>
        </div>
        <Link to="/generate" className="btn-primary self-start sm:self-auto">
          New chart <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          index={0}
          icon={Sparkles}
          label="Free generations used"
          value={`${user.free_used}/${user.free_limit}`}
          accent="primary"
        />
        <StatCard
          index={1}
          icon={Wallet}
          label="Paid credits remaining"
          value={user.paid_credits ?? 0}
          accent="accent"
        />
        <StatCard
          index={2}
          icon={BarChart3}
          label="Charts this session"
          value={history.length}
          accent="emerald"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-ink-900 dark:text-white">
            Free plan usage
          </h2>
          <span className="font-mono text-sm text-ink-500 dark:text-ink-400">
            {user.free_used} / {user.free_limit}
          </span>
        </div>
        <ProgressBar value={user.free_used} max={user.free_limit} />
        {user.free_used >= user.free_limit && (user.paid_credits ?? 0) <= 0 && (
          <p className="text-xs text-accent-600 dark:text-accent-400 mt-3">
            You've used all your free generations — top up on the Generate page to continue.
          </p>
        )}
      </motion.div>

      <div>
        <h2 className="font-display font-semibold text-ink-900 dark:text-white mb-4">
          Recent generations
        </h2>
        {history.length === 0 ? (
          <div className="card p-10 text-center">
            <ImageIcon size={28} className="mx-auto text-ink-300 dark:text-ink-700 mb-3" />
            <p className="text-sm text-ink-500 dark:text-ink-400 mb-4">
              You haven't generated any charts yet in this browser.
            </p>
            <Link to="/generate" className="btn-primary inline-flex">
              Generate your first chart <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="card p-3"
              >
                <div className="rounded-lg overflow-hidden bg-ink-50 dark:bg-ink-800 mb-3 aspect-video flex items-center justify-center">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <BarChart3 size={24} className="text-ink-300" />
                  )}
                </div>
                <p className="text-sm font-medium text-ink-900 dark:text-white truncate">
                  {item.title || "Untitled chart"}
                </p>
                <p className="text-xs text-ink-400 capitalize">{item.type} chart</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
