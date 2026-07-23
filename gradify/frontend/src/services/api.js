import axios from "axios";

const TOKEN_KEY = "gradify_token";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the session token (issued by POST /api/auth/google) to every request.
api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token has expired/is invalid, clear it so the app falls back to the login screen.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && [401].includes(error.response.status)) {
      tokenStore.clear();
    }
    return Promise.reject(error);
  }
);

/* ---------------------------------------------------------------------- */
/* Endpoint wrappers — these map 1:1 to the existing backend, unchanged.   */
/* ---------------------------------------------------------------------- */

// POST /api/auth/google  { credential } -> { token, user }
export const authGoogle = (credential) =>
  api.post("/api/auth/google", { credential });

// GET /api/me -> { user }
export const getMe = () => api.get("/api/me");

// POST /api/generate  { type, title, labels, values, x_label, y_label, ... }
// -> 200 { image, user }  |  402 { error, message }
export const generateChart = (payload) => api.post("/api/generate", payload);

// POST /api/payment/create-order -> { order_id, amount, currency, key_id, credits }
export const createOrder = () => api.post("/api/payment/create-order");

// POST /api/payment/verify { razorpay_order_id, razorpay_payment_id, razorpay_signature }
// -> { user }
export const verifyPayment = (payload) =>
  api.post("/api/payment/verify", payload);

export default api;
