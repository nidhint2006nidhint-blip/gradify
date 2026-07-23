import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import Logo from "../components/Logo";
import { useAuth } from "../hooks/useAuth";
import { useGoogleButton } from "../hooks/useGoogleButton";

export default function Login() {
  const { loginWithGoogle, isAuthenticated, authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleCredential = async (credential) => {
    const ok = await loginWithGoogle(credential);
    if (ok) {
      const redirectTo = location.state?.from?.pathname || "/dashboard";
      navigate(redirectTo, { replace: true });
    }
  };

  const { containerRef } = useGoogleButton(handleCredential);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-white dark:bg-ink-950 overflow-hidden">
      <div
        className="absolute inset-0 text-primary-200/60 dark:text-primary-900/30 dot-grid-bg bg-dot-sm [mask-image:radial-gradient(60%_60%_at_50%_30%,black,transparent)]"
        aria-hidden="true"
      />
      <div className="absolute top-24 left-[10%] h-56 w-56 rounded-full bg-primary-300/25 dark:bg-primary-700/20 blur-3xl animate-drift" aria-hidden="true" />
      <div className="absolute bottom-16 right-[10%] h-64 w-64 rounded-full bg-accent-300/25 dark:bg-accent-600/20 blur-3xl animate-drift" style={{ animationDelay: "1.5s" }} aria-hidden="true" />

      <Link
        to="/"
        className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 dark:text-ink-400 hover:text-ink-800 dark:hover:text-white"
      >
        <ArrowLeft size={15} /> Back home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-sm card p-8 sm:p-10 text-center shadow-soft-lg"
      >
        <div className="flex justify-center mb-5">
          <Logo className="h-12 w-12" />
        </div>

        <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white mb-2">
          Welcome to Gradify
        </h1>
        <p className="text-sm text-ink-500 dark:text-ink-400 mb-8">
          Sign in with Google to start generating charts — 15 free
          generations included.
        </p>

        <div className="flex justify-center mb-6" ref={containerRef} />

        {authError && (
          <p className="text-xs text-red-600 dark:text-red-400 mb-4">
            {authError}
          </p>
        )}

        <div className="flex items-center justify-center gap-2 text-xs text-ink-400 mb-1">
          <ShieldCheck size={13} />
          We never post on your behalf
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-ink-400">
          <Sparkles size={13} />
          15 free generations, no card required
        </div>
      </motion.div>
    </div>
  );
}
