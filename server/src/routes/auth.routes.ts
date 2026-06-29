import { Router } from 'express';
import { register, login, refresh, logout, updateMe, changePassword, deleteAccount } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.patch('/me', authMiddleware, updateMe);
router.post('/change-password', authMiddleware, changePassword);
router.delete('/me', authMiddleware, deleteAccount);

export default router;
