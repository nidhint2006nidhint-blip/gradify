# Gradify Frontend

Production-ready React frontend for Gradify, built with Vite + React Router +
Tailwind CSS + Framer Motion + Recharts + Lucide icons + Axios. It talks to
your existing Flask backend — **no backend endpoints were changed, renamed,
or added.**

## Stack

- **Build tool:** Vite (no CDN React, no Babel-in-browser, fully bundled)
- **Routing:** React Router v6
- **Styling:** Tailwind CSS (custom design tokens — see `tailwind.config.js`)
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Charts (preview only):** Recharts — used only for the live client-side
  preview on the Generate page. The chart image students actually download
  is always the PNG rendered by your backend's `/api/generate` endpoint.
- **HTTP:** Axios, single instance in `src/services/api.js`

## Project structure

```
frontend/
 ├── src/
 │   ├── assets/            (empty — icons/logo are inline SVG/Lucide, no binary assets needed)
 │   ├── components/        Navbar, Footer, Sidebar, PaymentModal, ChartPreview, etc.
 │   ├── layouts/           MainLayout (public), DashboardLayout (authenticated)
 │   ├── pages/              Landing, Login, Dashboard, Generate, Settings, NotFound
 │   ├── services/          api.js — the only file that knows your backend's URLs
 │   ├── hooks/              useAuth, useTheme, useGoogleButton, useGenerationHistory
 │   ├── context/            AuthContext, ThemeContext
 │   ├── App.jsx
 │   ├── main.jsx
 │   └── index.css
 ├── public/
 │   └── favicon.svg
 ├── package.json
 ├── vite.config.js
 ├── tailwind.config.js
 ├── postcss.config.js
 └── index.html
```

## 1. Configure environment variables

```bash
cp .env.example .env
```

```
VITE_API_BASE=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

- `VITE_API_BASE` — the base URL of your Flask backend (no trailing slash).
  In production, point this at your deployed backend's URL.
- `VITE_GOOGLE_CLIENT_ID` — **must be the same** Google OAuth Client ID your
  backend already verifies tokens against in `POST /api/auth/google`.

Also add your dev and production origins (e.g. `http://localhost:5173` and
your deployed frontend URL) to **Authorized JavaScript origins** in the
Google Cloud Console for this Client ID, or the sign-in button will fail
silently.

## 2. Install and run

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`. Make sure your Flask backend is running
separately (e.g. `http://localhost:5000`) and that Flask-CORS allows the
frontend's origin — your existing backend already has `flask-cors` wired up,
just confirm it isn't restricted to a different origin.

## 3. Build for production

```bash
npm run build
```

Output goes to `dist/`. Preview it locally with:

```bash
npm run preview
```

Deploy `dist/` to any static host (Vercel, Netlify, Cloudflare Pages, or
served directly by your Flask app's static folder). Set `VITE_API_BASE` and
`VITE_GOOGLE_CLIENT_ID` as build-time environment variables on whichever
platform builds it — Vite inlines them at build time, so they must be set
*before* `npm run build` runs.

## How each requirement maps to the code

| Requirement | Where |
|---|---|
| Google Sign-In | `hooks/useGoogleButton.js` renders the official GSI button; `context/AuthContext.jsx` exchanges the credential via `POST /api/auth/google` |
| Session persistence | JWT from your backend stored in `localStorage`, restored via `GET /api/me` on load (`services/api.js`, `AuthContext.jsx`) |
| 15 free → ₹20 paywall | `PaymentModal.jsx` triggers on any `402` response from `POST /api/generate`, then runs the existing `POST /api/payment/create-order` → Razorpay Checkout → `POST /api/payment/verify` flow |
| 6 chart types | `pages/Generate.jsx` — bar, line, pie, scatter, histogram, box plot, all posted to your unchanged `/api/generate` endpoint |
| Dark mode | `context/ThemeContext.jsx`, Tailwind `darkMode: "class"`, toggle in `ThemeToggle.jsx` and Settings page |
| Recent generations | Tracked client-side in `hooks/useGenerationHistory.js` (localStorage) since the backend doesn't currently expose a history endpoint — swap this out if you add one later |

## Notes

- No inline `<script>` tags, no React/Babel CDN — the only external
  `<script src>` tags in `index.html` are Google's official Identity
  Services SDK and Razorpay's official Checkout SDK, both required to use
  those providers' hosted UI, and both standard practice even in bundled
  production apps.
- Vendor code is split into separate chunks (`react`, `motion`, `charts`) in
  `vite.config.js` to keep initial load lean.
