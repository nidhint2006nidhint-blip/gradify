import { useEffect, useRef, useState } from "react";

/**
 * Renders the official Google Identity Services sign-in button into the
 * returned ref, and calls onCredential(credential) once the user picks an account.
 */
export function useGoogleButton(onCredential, options = {}) {
  const containerRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    function tryRender() {
      if (cancelled) return;
      if (!window.google || !containerRef.current) {
        setTimeout(tryRender, 150);
        return;
      }
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: (response) => onCredential(response.credential),
      });
      window.google.accounts.id.renderButton(containerRef.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        width: 300,
        text: "continue_with",
        ...options,
      });
      setReady(true);
    }

    tryRender();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { containerRef, ready };
}
