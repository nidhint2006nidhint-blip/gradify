import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  ScatterChart as ScatterChartIcon,
  AreaChart,
  Boxes,
  Download,
  Wand2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { generateChart } from "../services/api";
import ChartPreview from "../components/ChartPreview";
import PaymentModal from "../components/PaymentModal";
import { Spinner } from "../components/LoadingSpinner";
import { useGenerationHistory } from "../hooks/useGenerationHistory";

const CHART_TYPES = [
  { id: "bar", label: "Bar", icon: BarChart3 },
  { id: "line", label: "Line", icon: LineChartIcon },
  { id: "pie", label: "Pie", icon: PieChartIcon },
  { id: "scatter", label: "Scatter", icon: ScatterChartIcon },
  { id: "histogram", label: "Histogram", icon: AreaChart },
  { id: "boxplot", label: "Box plot", icon: Boxes },
];

export default function Generate() {
  const { user, setUser } = useAuth();
  const { addGeneration } = useGenerationHistory();

  const [type, setType] = useState("bar");
  const [title, setTitle] = useState("");
  const [labelsInput, setLabelsInput] = useState("Jan, Feb, Mar, Apr");
  const [valuesInput, setValuesInput] = useState("12, 19, 8, 15");
  const [xLabel, setXLabel] = useState("");
  const [yLabel, setYLabel] = useState("");

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);

  const labels = useMemo(
    () => labelsInput.split(",").map((s) => s.trim()).filter(Boolean),
    [labelsInput]
  );
  const values = useMemo(
    () => valuesInput.split(",").map((s) => s.trim()).filter(Boolean),
    [valuesInput]
  );

  const remaining = user
    ? Math.max(0, user.free_limit - user.free_used) + (user.paid_credits ?? 0)
    : 0;

  const handleGenerate = async () => {
    setError("");
    if (values.length === 0) {
      setError("Add at least one value to generate a chart.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await generateChart({
        type,
        title,
        labels,
        values,
        x_label: xLabel,
        y_label: yLabel,
      });
      setImage(data.image);
      setUser(data.user);
      addGeneration({ type, title, image: data.image });
    } catch (err) {
      if (err.response?.status === 402) {
        setShowPaywall(true);
      } else {
        setError(
          err.response?.data?.message ||
            "Something went wrong generating that chart. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!image) return;
    const a = document.createElement("a");
    a.href = image;
    a.download = `${title || "gradify-chart"}.png`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white">
          Generate a chart
        </h1>
        <p className="text-ink-500 dark:text-ink-400 text-sm mt-1">
          {remaining} generation{remaining === 1 ? "" : "s"} remaining on your account.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="card p-6 space-y-5"
        >
          <div>
            <label className="label">Chart type</label>
            <div className="grid grid-cols-3 gap-2">
              {CHART_TYPES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setType(id)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-medium transition-colors ${
                    type === id
                      ? "border-primary-400 bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
                      : "border-ink-200 dark:border-ink-700 text-ink-500 dark:text-ink-400 hover:border-primary-300"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label" htmlFor="title">Title</label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Monthly rainfall in Kerala"
              className="input"
            />
          </div>

          <div>
            <label className="label" htmlFor="labels">Labels (comma separated)</label>
            <input
              id="labels"
              value={labelsInput}
              onChange={(e) => setLabelsInput(e.target.value)}
              className="input font-mono text-sm"
            />
          </div>

          <div>
            <label className="label" htmlFor="values">Values (comma separated)</label>
            <input
              id="values"
              value={valuesInput}
              onChange={(e) => setValuesInput(e.target.value)}
              className="input font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="xlabel">X-axis label</label>
              <input
                id="xlabel"
                value={xLabel}
                onChange={(e) => setXLabel(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="label" htmlFor="ylabel">Y-axis label</label>
              <input
                id="ylabel"
                value={yLabel}
                onChange={(e) => setYLabel(e.target.value)}
                className="input"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2.5">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading ? (
              <>
                <Spinner size={16} /> Generating…
              </>
            ) : (
              <>
                <Wand2 size={16} /> Generate chart
              </>
            )}
          </button>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-4"
        >
          <div className="card p-5">
            <p className="label mb-3">Live preview</p>
            <div className="rounded-xl dot-grid-bg bg-dot-sm text-ink-100 dark:text-ink-800 bg-ink-50/60 dark:bg-ink-900/60 p-2">
              <ChartPreview type={type} labels={labels} values={values} />
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="label mb-0">Generated image</p>
              {image && (
                <button
                  onClick={handleDownload}
                  className="btn-outline !px-3 !py-1.5 text-xs"
                >
                  <Download size={13} /> Download PNG
                </button>
              )}
            </div>
            <div className="rounded-xl bg-ink-50 dark:bg-ink-900 border border-ink-100 dark:border-ink-800 min-h-[220px] flex items-center justify-center overflow-hidden">
              {loading ? (
                <div className="flex flex-col items-center gap-3 py-10">
                  <Spinner size={24} className="text-primary-500" />
                  <p className="text-xs text-ink-400">
                    Rendering your chart on the server…
                  </p>
                </div>
              ) : image ? (
                <img src={image} alt={title || "Generated chart"} className="w-full h-full object-contain" />
              ) : (
                <p className="text-sm text-ink-400 px-6 text-center py-10">
                  Your finished chart will appear here after generating
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <PaymentModal
        open={showPaywall}
        onClose={() => setShowPaywall(false)}
        onSuccess={(updatedUser) => {
          setUser(updatedUser);
          setShowPaywall(false);
        }}
      />
    </div>
  );
}
