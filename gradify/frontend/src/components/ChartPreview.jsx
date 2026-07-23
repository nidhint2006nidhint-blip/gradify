import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const COLORS = ["#5B5FEF", "#FFB020", "#8C8EF1", "#22C55E", "#F97316", "#EC4899"];

/**
 * Client-side preview only — built from what the student has typed so far,
 * using Recharts. The actual chart image students download is always
 * rendered server-side by the backend's /api/generate endpoint.
 */
export default function ChartPreview({ type, labels, values }) {
  const data = labels.map((label, i) => ({
    name: label || `Item ${i + 1}`,
    value: Number(values[i]) || 0,
  }));

  const hasData = data.length > 0 && data.some((d) => d.value !== 0);

  if (!hasData) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-ink-400">
        Enter labels and values to see a live preview
      </div>
    );
  }

  if (type === "pie") {
    return (
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} label>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (type === "line") {
    return (
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-ink-100 dark:text-ink-800" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="currentColor" className="text-ink-400" />
          <YAxis tick={{ fontSize: 11 }} stroke="currentColor" className="text-ink-400" />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#5B5FEF" strokeWidth={2.5} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (type === "scatter") {
    return (
      <ResponsiveContainer width="100%" height={260}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-ink-100 dark:text-ink-800" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="currentColor" className="text-ink-400" />
          <YAxis dataKey="value" tick={{ fontSize: 11 }} stroke="currentColor" className="text-ink-400" />
          <Tooltip />
          <Scatter data={data} fill="#5B5FEF" />
        </ScatterChart>
      </ResponsiveContainer>
    );
  }

  // bar, histogram, boxplot all get a representative bar preview
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-ink-100 dark:text-ink-800" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="currentColor" className="text-ink-400" />
        <YAxis tick={{ fontSize: 11 }} stroke="currentColor" className="text-ink-400" />
        <Tooltip />
        <Bar dataKey="value" fill="#5B5FEF" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
