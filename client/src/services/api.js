// src/services/api.js — Centralized Axios instance
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  withCredentials: true, // send HTTP-only cookies
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Response interceptor: unwrap data or throw structured error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    const errors = error.response?.data?.errors || [];
    const status = error.response?.status;

    // Attach a clean error object
    const err = new Error(message);
    err.status = status;
    err.errors = errors;
    err.originalError = error;
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
