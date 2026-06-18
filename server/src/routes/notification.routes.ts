import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  testNotification,
  getNotificationSettings,
  patchNotificationSettings,
  getSettings,
  patchSettings,
  testExtraction,
} from '../controllers/notification.controller.js';

const router = Router();

router.post('/test', authMiddleware, testNotification);
router.get('/settings', authMiddleware, getNotificationSettings);
router.patch('/settings', authMiddleware, patchNotificationSettings);

export default router;

const settingsRouter = Router();
settingsRouter.get('/', authMiddleware, getSettings);
settingsRouter.patch('/', authMiddleware, patchSettings);
settingsRouter.post('/test-extraction', authMiddleware, testExtraction);

export { settingsRouter };
