import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes, now due to this until 15 minutes complete,
  //no login can occur even with different login
  max: 5, // 5 requests per window
  message: {
    success: false,
    message: 'Too many login attempts. Try again later.',
  },
});
