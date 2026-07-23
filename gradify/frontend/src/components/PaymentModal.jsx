import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, AlertCircle } from "lucide-react";
import { createOrder, verifyPayment } from "../services/api";
import { Spinner } from "./LoadingSpinner";

export default function PaymentModal({ open, onClose, onSuccess, packCredits = 15, packPrice = 20 }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await createOrder();

      if (!window.Razorpay) {
        setError("Payment SDK failed to load. Check your connection and try again.");
        setLoading(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "Gradify",
        description: `${data.credits} chart generations`,
        order_id: data.order_id,
        theme: { color: "#5B5FEF" },
        handler: async (response) => {
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            onSuccess(verifyRes.data.user);
          } catch (err) {
            setError(
              err.response?.data?.message ||
                "We couldn't verify that payment. If money was deducted, it will be refunded automatically."
            );
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.on("payment.failed", () => {
        setError("Payment failed. Please try again.");
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      setError(
        err.response?.data?.message || "Couldn't start the payment. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            className="relative w-full max-w-sm rounded-xl2 bg-white dark:bg-ink-900 shadow-soft-lg border border-ink-100 dark:border-ink-800 p-8 text-center"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-ink-400 hover:text-ink-600 dark:hover:text-ink-200"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center mb-5 shadow-glow">
              <Sparkles size={24} className="text-white" />
            </div>

            <h2 className="font-display text-xl font-bold text-ink-900 dark:text-white mb-1.5">
              15 free generations completed
            </h2>
            <p className="text-sm text-ink-500 dark:text-ink-400 mb-6">
              You've used up your free charts. Unlock {packCredits} more generations
              for just <span className="font-semibold text-ink-800 dark:text-ink-200">₹{packPrice}</span>.
            </p>

            {error && (
              <div className="flex items-start gap-2 text-left text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2.5 mb-4">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handlePay}
              disabled={loading}
              className="btn-accent w-full mb-3"
            >
              {loading ? <Spinner size={16} /> : `Pay ₹${packPrice} · Get ${packCredits} more`}
            </button>
            <button
              onClick={onClose}
              className="text-sm text-ink-400 hover:text-ink-600 dark:hover:text-ink-200"
            >
              Maybe later
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
