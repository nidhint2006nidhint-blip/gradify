/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EEEEFD",
          100: "#DCDCFB",
          200: "#B4B5F6",
          300: "#8C8EF1",
          400: "#7477F0",
          500: "#5B5FEF",
          600: "#4649C7",
          700: "#35379A",
          800: "#25266D",
          900: "#161742",
        },
        accent: {
          50: "#FFF6E5",
          100: "#FFECC7",
          200: "#FFDA94",
          300: "#FFC761",
          400: "#FFB020",
          500: "#F59E00",
          600: "#C67F00",
          700: "#946000",
        },
        ink: {
          50: "#F7F7F9",
          100: "#EDEDF2",
          200: "#D8D9E1",
          300: "#B6B8C6",
          400: "#8B8DA0",
          500: "#666881",
          600: "#4B4D63",
          700: "#363749",
          800: "#232433",
          900: "#14151E",
          950: "#0B0C12",
        },
      },
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "dot-grid":
          "radial-gradient(circle, currentColor 1px, transparent 1px)",
        "grad-primary":
          "linear-gradient(135deg, #5B5FEF 0%, #8C8EF1 50%, #FFB020 150%)",
        "grad-radial-fade":
          "radial-gradient(60% 60% at 50% 0%, rgba(91,95,239,0.18) 0%, rgba(91,95,239,0) 70%)",
      },
      backgroundSize: {
        "dot-sm": "16px 16px",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(20, 21, 30, 0.04), 0 12px 32px -8px rgba(20, 21, 30, 0.08)",
        "soft-lg":
          "0 8px 24px rgba(20, 21, 30, 0.06), 0 24px 64px -16px rgba(20, 21, 30, 0.14)",
        glow: "0 0 0 1px rgba(91,95,239,0.15), 0 8px 24px -4px rgba(91,95,239,0.35)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" },
        },
        drift: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(24px, -18px) scale(1.06)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        drift: "drift 12s ease-in-out infinite",
        "fade-up": "fade-up 0.6s ease-out both",
        shimmer: "shimmer 2.2s linear infinite",
      },
    },
  },
  plugins: [],
};
