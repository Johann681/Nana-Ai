import { Router } from 'express';
import { 
  createConsultation, 
  sendMessage, 
  getConsultations, 
  getConsultation 
} from '../controllers/consultationController';
import { protect } from '../middleware/auth';
import rateLimit from 'express-rate-limit';

const router = Router();

const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // 20 requests
  message: { error: 'Too many messages, please slow down' }
});

router.use(protect);

router.post('/', createConsultation);
router.get('/', getConsultations);
router.get('/:id', getConsultation);
router.post('/:consultationId/message', chatLimiter, sendMessage);

export default router;
