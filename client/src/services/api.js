// src/services/api.js — Centralized Production Axios instance
import axios from 'axios';

// Resolve production API base URL with fallback
const rawBaseURL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'https://cybreva.onrender.com/api';

// Sanitize: strip trailing slash to avoid duplicate slashes
const baseURL = rawBaseURL.replace(/\/+$/, '');

// Guard to prevent duplicate backend wake-up requests (session-persisted & in-memory)
let isWarmedUp = false;

/**
 * Sends a lightweight, non-blocking GET request to /api/health to wake up
 * Render's free tier instance in the background as soon as a visitor opens the site.
 */
export const warmupBackend = () => {
  if (isWarmedUp) return;

  if (typeof window !== 'undefined') {
    try {
      if (sessionStorage.getItem('cybreva_backend_warmed')) {
        isWarmedUp = true;
        return;
      }
      sessionStorage.setItem('cybreva_backend_warmed', 'true');
    } catch (_) {
      // Fallback silently if sessionStorage is unavailable (e.g. private browsing restrictions)
    }
  }

  isWarmedUp = true;

  // Fire-and-forget background ping to Render health check
  fetch(`${baseURL}/health`, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'omit',
  }).catch(() => {
    // Silently ignore any network failures or timeouts during initial spin-up
  });
};

const api = axios.create({
  baseURL,
  withCredentials: true, // Send HTTP-only cross-site cookies
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 60000, // 60s timeout to gracefully accommodate Render cold starts
});

// Response interceptor: unwrap data or format structured error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const responseData = error.response?.data;
    const errors = responseData?.errors || [];

    let message = responseData?.message;

    if (!message) {
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        message = 'Request timed out. The security server may be waking up from standby. Please retry in a few seconds.';
      } else if (!error.response) {
        message = 'Unable to connect to Cybreva security server. If the server was idle, it may take up to 45 seconds to spin up. Please retry.';
      } else if (status === 401) {
        message = 'Your session has expired or you are unauthorized. Please sign in again.';
      } else if (status === 403) {
        message = 'Access denied. You do not have permission to perform this action.';
      } else if (status === 404) {
        message = 'The requested security endpoint could not be found.';
      } else if (status === 429) {
        message = 'Rate limit exceeded. Please wait a moment before sending another scan.';
      } else if (status >= 500) {
        message = 'Cybreva threat intelligence server encountered an error. Please try again shortly.';
      } else {
        message = error.message || 'An unexpected error occurred.';
      }
    }

    // Attach structured error details
    const err = new Error(message);
    err.status = status;
    err.errors = errors;
    err.originalError = error;
    err.isColdStart = !error.response || error.code === 'ECONNABORTED';

    return Promise.reject(err);
  },
);

export default api;

// ── Auth ─────────────────────────────────────
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// ── Scans ─────────────────────────────────────
export const scanApi = {
  scanMessage: (data) => api.post('/scans/message', data),
  scanEmail: (data) => api.post('/scans/email', data),
  scanWebsite: (data) => api.post('/scans/website', data),
  getHistory: (params) => api.get('/scans/history', { params }),
  getScanById: (id) => api.get(`/scans/${id}`),
  deleteScan: (id) => api.delete(`/scans/${id}`),
};

// ── AI Assistant ──────────────────────────────
export const aiApi = {
  chat: (data) => api.post('/ai/chat', data),
  getSessions: () => api.get('/ai/sessions'),
  getSession: (id) => api.get(`/ai/sessions/${id}`),
  deleteSession: (id) => api.delete(`/ai/sessions/${id}`),
};

// ── Dashboard ─────────────────────────────────
export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
};
