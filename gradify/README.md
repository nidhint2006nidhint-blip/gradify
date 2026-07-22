# Gradify — Charts & Diagrams for Students

Sign in with Google → 15 free chart/diagram generations → ₹20 for 15 more via Razorpay.

## How it's built (and why)

- **Backend:** Flask + SQLite (`backend/app.py`)
- **Frontend:** Single `index.html` using React via CDN — no npm/build step, just open it or serve it with Flask.
- **Charts:** generated **server-side with matplotlib** (bar, line, pie, scatter, histogram, box plot), returned as a base64 PNG.
- **Why not an AI image-generation API?** Free/cheap AI image APIs (Stability, DALL-E free tiers, etc.) have per-call costs and rate limits — at 100–150 students/day generating several charts each, you'd hit limits or racking up real cost. matplotlib runs on your own server, costs nothing per call, has no external rate limit, and renders a chart in well under a second. A basic free-tier server (512MB RAM) handles that load without breaking a sweat — this is a lightweight, CPU-only workload.
- **Auth:** Google Identity Services on the frontend → backend verifies the ID token → issues its own 7-day session JWT.
- **Payments:** Razorpay (standard for ₹ payments, supports UPI/cards). Order created server-side, verified server-side via signature check before credits are added — never trust the frontend alone for payment confirmation.

## 1. Get your API keys

**Google OAuth Client ID**
1. Go to [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials)
2. Create OAuth Client ID → Application type: **Web application**
3. Add your domain (and `http://localhost:5000` for local testing) under "Authorized JavaScript origins"
4. Copy the Client ID into:
   - `backend/.env` → `GOOGLE_CLIENT_ID`
   - `frontend/index.html` → `window.GRADIFY_CONFIG.GOOGLE_CLIENT_ID`

**Razorpay keys**
1. Sign up at [razorpay.com](https://razorpay.com) (free)
2. Dashboard → Settings → API Keys → generate **Test keys** first
3. Copy into `backend/.env` → `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`
4. Switch to live keys once you've tested end-to-end and completed KYC

## 2. Run locally

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env          # then fill in your keys
python app.py
```

Visit `http://localhost:5000` — Flask serves the frontend and API from the same origin.

## 3. Deploy (handles 100–150 students/day comfortably on free tiers)

Recommended: **Render.com** or **Railway** free/starter tier.

1. Push this folder to a GitHub repo
2. Render → New Web Service → connect repo
   - Build command: `pip install -r backend/requirements.txt`
   - Start command: `gunicorn --chdir backend app:app`
3. Add your `.env` values as environment variables in the dashboard
4. Add your deployed URL to Google's "Authorized JavaScript origins" and Razorpay's allowed domains

For real production use, swap SQLite for Postgres (Render/Railway both offer free Postgres) by setting `DATABASE_URL` — the code already supports this via `SQLALCHEMY_DATABASE_URI`.

## Business logic

- Each new Google account gets `FREE_LIMIT` (default 15) generations, tracked server-side per user — not per browser, so it can't be reset by clearing cookies.
- Once exhausted, the frontend shows a paywall: ₹20 buys `PACK_CREDITS` (default 15) more, configurable in `.env`.
- Free generations are consumed first, then paid credits.
- All usage/payment logic lives in the backend — the frontend can't be tricked into unlocking generations.

## What's included vs. what to harden before real launch

**Included:** working auth, usage metering, chart generation, payment flow, signature verification.

**Before charging real students, you should also:**
- Add rate limiting (e.g. Flask-Limiter) to `/api/generate` to stop abuse/scripted spam
- Move from SQLite to Postgres for concurrent write safety
- Add HTTPS (automatic on Render/Railway) — required for Google Sign-In and Razorpay in production
- Consider a refund/dispute policy page (required by Razorpay for live mode)
