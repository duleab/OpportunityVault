import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { getStats } from '../controllers/opportunity.controller.js';

const router = Router();
router.get('/overview', authMiddleware, getStats);
export default router;
