export default function Logo({ className = "h-8 w-8" }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Gradify logo"
    >
      <rect width="40" height="40" rx="11" fill="url(#gradify-logo-grad)" />
      <path
        d="M10 26.5V17.5"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M20 26.5V12.5"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M30 26.5V20.5"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id="gradify-logo-grad"
          x1="0"
          y1="0"
          x2="40"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#5B5FEF" />
          <stop offset="1" stopColor="#FFB020" />
        </linearGradient>
      </defs>
    </svg>
  );
}
