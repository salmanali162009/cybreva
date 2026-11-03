// ─────────────────────────────────────────────
//  Cybreva — Scan routes
// ─────────────────────────────────────────────
import { Router } from 'express';
import {
  scanMessage,
  scanEmail,
  scanWebsite,
  getScanHistory,
  getScanById,
  deleteScan,
} from '../controllers/scanController.js';
import { protect } from '../middleware/auth.js';
import { scanLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Scan endpoints — rate-limited; authentication optional for scanning
// (scan results are only persisted for authenticated users)
router.post('/message', scanLimiter, protect, scanMessage);
router.post('/email', scanLimiter, protect, scanEmail);
router.post('/website', scanLimiter, protect, scanWebsite);

// Scan history — authentication required
router.get('/history', protect, getScanHistory);
router.get('/:id', protect, getScanById);
router.delete('/:id', protect, deleteScan);

export default router;
