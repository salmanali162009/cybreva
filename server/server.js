// ─────────────────────────────────────────────
//  Cybreva — Server entry point
//  "Check Before You Trust."
// ─────────────────────────────────────────────
import { fileURLToPath } from 'url';
import path from 'path';

// Resolve __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the same directory as server.js regardless of CWD
import { config } from 'dotenv';
config({ path: path.join(__dirname, '.env') });
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import connectDB from './config/db.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import errorHandler from './middleware/errorHandler.js';
import { BODY_SIZE_LIMIT } from './constants/index.js';

// Routes
import authRoutes from './routes/auth.js';
import scanRoutes from './routes/scans.js';
import aiRoutes from './routes/ai.js';
import dashboardRoutes from './routes/dashboard.js';

// ── App setup ─────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// ── Security headers ──────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173', // Vite default
  'https://cybreva.vercel.app/', // Vercel deployment
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, Postman in development)
      if (!origin && !isProduction) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin "${origin}" not allowed.`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// ── Request parsing ───────────────────────────
app.use(express.json({ limit: BODY_SIZE_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: BODY_SIZE_LIMIT }));
app.use(cookieParser());

// ── Logging ───────────────────────────────────
if (!isProduction) {
  app.use(morgan('dev'));
} else {
  // Production: log minimal info without tokens/cookies
  app.use(
    morgan('combined', {
      skip: (req) => req.url === '/api/health',
    }),
  );
}

// ── General rate limiter ──────────────────────
app.use('/api', generalLimiter);

// ── Health check ──────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Cybreva API is running.',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// ── API routes ────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ── 404 handler ───────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// ── Centralised error handler ─────────────────
app.use(errorHandler);

// ── Start server ──────────────────────────────
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Cybreva server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });
};

startServer().catch((err) => {
  console.error('❌ Failed to start server:', err.message);
  process.exit(1);
});

// ── Graceful shutdown handlers ────────────────
process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  process.exit(1);
});

export default app;
