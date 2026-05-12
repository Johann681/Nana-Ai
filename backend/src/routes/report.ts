import { Router } from 'express';
import { generateReport, downloadReportPdf, getReports } from '../controllers/reportController';
import { protect } from '../middleware/auth';
import rateLimit from 'express-rate-limit';

const router = Router();

const reportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 reports
  message: { error: 'Too many report generation requests, please try again later' }
});

router.use(protect);

router.get('/', getReports);
router.post('/generate', reportLimiter, generateReport);
router.get('/:id/download', downloadReportPdf);

export default router;
