import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  listOpportunities,
  getOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getUrgent,
  getUpcoming,
  bulkStatus,
  exportOpportunities,
  checkDuplicate,
} from '../controllers/opportunity.controller.js';

const router = Router();

router.get('/export', authMiddleware, exportOpportunities);
router.get('/urgent', authMiddleware, getUrgent);
router.get('/upcoming', authMiddleware, getUpcoming);
router.get('/check-duplicate', authMiddleware, checkDuplicate);
router.post('/bulk-status', authMiddleware, bulkStatus);
router.get('/', authMiddleware, listOpportunities);
router.get('/:id', authMiddleware, getOpportunity);
router.patch('/:id', authMiddleware, updateOpportunity);
router.delete('/:id', authMiddleware, deleteOpportunity);

export default router;
