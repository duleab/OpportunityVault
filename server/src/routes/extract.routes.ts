import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { extractPreview, saveExtracted } from '../controllers/opportunity.controller.js';

const router = Router();

router.post('/', authMiddleware, extractPreview);
router.post('/save', authMiddleware, saveExtracted);

export default router;
