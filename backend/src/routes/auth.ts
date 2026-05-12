import { Router } from 'express';
import { register, login, logout, refresh, getMe, updateProfile } from '../controllers/authController';
import { protect } from '../middleware/auth';
import rateLimit from 'express-rate-limit';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // 5 requests
  message: { error: 'Too many auth attempts, please try again later' }
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
