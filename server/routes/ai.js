// ─────────────────────────────────────────────
//  Cybreva — AI assistant routes
// ─────────────────────────────────────────────
import { Router } from 'express';
import { chat, getSessions, getSession, deleteSession } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// All AI routes require authentication
router.post('/chat', aiLimiter, protect, chat);
router.get('/sessions', protect, getSessions);
router.get('/sessions/:id', protect, getSession);
router.delete('/sessions/:id', protect, deleteSession);

export default router;
