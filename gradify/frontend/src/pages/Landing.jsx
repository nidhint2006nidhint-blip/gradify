import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Zap,
  ShieldCheck,
  Download,
  Sparkles,
} from "lucide-react";
import FeatureCard from "../components/FeatureCard";
import PricingCard from "../components/PricingCard";
import FAQItem from "../components/FAQItem";

const features = [
  {
    icon: BarChart3,
    title: "Six chart types",
    description:
      "Bar, line, pie, scatter, histogram and box plot — pick the right one for your dataset in one click.",
  },
  {
    icon: Zap,
    title: "Ready in seconds",
    description:
      "Type your labels and values, hit generate, and get a publication-ready image instantly.",
  },
  {
    icon: Download,
    title: "Download & submit",
    description:
      "Every chart comes as a clean PNG you can drop straight into your report or presentation.",
  },
  {
    icon: ShieldCheck,
    title: "Sign in with Google",
    description:
      "No new password to remember. Your usage and history stay tied to your Google account.",
  },
  {
    icon: Sparkles,
    title: "15 free, always",
    description:
      "Every account starts with 15 free generations — enough for a full semester of assignments.",
  },
  {
    icon: LineChartIcon,
    title: "Built for statistics",
    description:
      "Axis labels, titles and legends designed to look right in academic reports, not just slides.",
  },
];

const faqs = [
  {
    q: "Is Gradify really free to start?",
    a: "Yes — every new account gets 15 free chart generations with full access to all six chart types, no credit card required.",
  },
  {
    q: "What happens after I use my 15 free generations?",
    a: "You can top up with 15 more generations for ₹20 through a secure Razorpay checkout. Your free count never resets, but paid packs stack on top.",
  },
  {
    q: "What chart types are supported?",
    a: "Bar charts, line charts, pie charts, scatter plots, histograms and box plots — the core visualizations used across most statistics and data assignments.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. Gradify runs entirely in your browser. Sign in with your Google account and start generating charts right away.",
  },
  {
    q: "Can I download the charts I generate?",
    a: "Yes — every generated chart can be downloaded as a PNG image, ready to paste into a report, slide deck, or notebook.",
  },
];

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden pt-40 pb-28 px-4 sm:px-6">
        <div className="absolute inset-0 bg-grad-radial-fade" aria-hidden="true" />
        <div
          className="absolute inset-0 text-primary-200/70 dark:text-primary-900/40 dot-grid-bg bg-dot-sm [mask-image:radial-gradient(60%_50%_at_50%_20%,black,transparent)]"
          aria-hidden="true"
        />
        <motion.div
          className="absolute -top-10 right-[8%] h-72 w-72 rounded-full bg-primary-300/30 dark:bg-primary-700/20 blur-3xl animate-drift"
          aria-hidden="true"
        />
        <motion.div
          className="absolute top-40 left-[6%] h-64 w-64 rounded-full bg-accent-300/30 dark:bg-accent-600/20 blur-3xl animate-drift"
          style={{ animationDelay: "2s" }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-primary-700 dark:text-primary-300 mb-6"
          >
            <Sparkles size={13} />
            15 free chart generations on sign-up
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-ink-900 dark:text-white leading-[1.08]"
          >
            Graphs and statistics,
            <br />
            <span className="gradient-text">plotted in seconds.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-6 text-lg text-ink-500 dark:text-ink-400 max-w-xl mx-auto"
          >
            Gradify turns your raw numbers into clean bar, line, pie, scatter,
            histogram and box-plot charts — ready to paste straight into your
            next assignment.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link to="/login" className="btn-primary text-base px-7 py-3.5">
              Start generating free <ArrowRight size={17} />
            </Link>
            <a href="#features" className="btn-outline text-base px-7 py-3.5">
              See how it works
            </a>
          </motion.div>
        </div>

        {/* Floating preview mock */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative mx-auto mt-20 max-w-3xl"
        >
          <div className="card p-3 shadow-soft-lg">
            <div className="rounded-xl bg-ink-50 dark:bg-ink-900 border border-ink-100 dark:border-ink-800 dot-grid-bg bg-dot-sm text-ink-200 dark:text-ink-800 p-8 flex items-center justify-center gap-10">
              <BarChart3
                size={52}
                strokeWidth={1.4}
                className="text-primary-400 animate-float"
              />
              <LineChartIcon
                size={52}
                strokeWidth={1.4}
                className="text-accent-400 animate-float"
                style={{ animationDelay: "1.2s" }}
              />
              <PieChartIcon
                size={52}
                strokeWidth={1.4}
                className="text-primary-300 animate-float"
                style={{ animationDelay: "2.4s" }}
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 sm:px-6 py-24 bg-ink-50/60 dark:bg-ink-900/40">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-900 dark:text-white">
              Everything your assignment needs
            </h2>
            <p className="mt-3 text-ink-500 dark:text-ink-400">
              A focused toolkit for turning raw numbers into charts your
              professor will actually be able to read.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <FeatureCard key={f.title} index={i} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-4 sm:px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-900 dark:text-white">
              Simple, student-friendly pricing
            </h2>
            <p className="mt-3 text-ink-500 dark:text-ink-400">
              Start free. Pay only when you need more — no subscriptions.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <PricingCard
              index={0}
              name="Free"
              price="₹0"
              description="Perfect for trying Gradify or a light workload."
              features={[
                "15 chart generations",
                "All 6 chart types",
                "PNG downloads",
                "Google sign-in",
              ]}
              cta="Get started free"
            />
            <PricingCard
              index={1}
              highlighted
              name="Top-up pack"
              price="₹20"
              suffix="/ 15 generations"
              description="For a full semester of assignments and reports."
              features={[
                "15 additional generations",
                "All 6 chart types",
                "Priority rendering",
                "Stacks with free credits",
              ]}
              cta="Buy a top-up pack"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-4 sm:px-6 py-24 bg-ink-50/60 dark:bg-ink-900/40">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-900 dark:text-white">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f) => (
              <FAQItem key={f.q} question={f.q} answer={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl rounded-xl2 bg-grad-primary p-12 text-center shadow-soft-lg relative overflow-hidden"
        >
          <div className="absolute inset-0 text-white/10 dot-grid-bg bg-dot-sm" aria-hidden="true" />
          <h2 className="relative font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Your next chart is one click away
          </h2>
          <p className="relative text-white/85 mb-8 max-w-lg mx-auto">
            Sign in with Google and get 15 free generations — no card, no
            setup, no waiting.
          </p>
          <Link
            to="/login"
            className="relative inline-flex items-center gap-2 rounded-full bg-white text-primary-700 font-semibold px-7 py-3.5 hover:bg-ink-50 transition-colors"
          >
            Get started free <ArrowRight size={17} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
