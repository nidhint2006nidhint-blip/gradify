import { useCallback, useEffect, useState } from "react";

const HISTORY_KEY = "gradify_recent_generations";
const MAX_ITEMS = 12;

/**
 * The existing backend doesn't expose a generation-history endpoint, so
 * "recent generations" is tracked client-side for the signed-in browser.
 * Swap this for a real API call if/when a GET /api/generations endpoint
 * is added to the backend.
 */
export function useGenerationHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      setHistory(stored);
    } catch {
      setHistory([]);
    }
  }, []);

  const addGeneration = useCallback((entry) => {
    setHistory((prev) => {
      const next = [{ ...entry, id: Date.now() }, ...prev].slice(0, MAX_ITEMS);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { history, addGeneration };
}
