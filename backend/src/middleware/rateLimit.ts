import rateLimit from 'express-rate-limit';

export const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,             // 20 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please wait a moment before trying again.',
  },
  skipSuccessfulRequests: false,
});
