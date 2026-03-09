import { Router } from 'express';
import {
  register,
  login
} from '../controllers/auth/auth.controller';

import { validate } from '../middleware/validate.middleware';
import { loginLimiter } from '../middleware/rateLimit.middleware';

import {
  registerSchema,
  loginSchema,
} from '../validations/auth.validation';

const router = Router();

// ================= REGISTER =================
router.post(
  '/register',
  validate(registerSchema),   // ✅ Validation first
  register                    // ✅ Controller second
);

// ================= LOGIN =================
router.post(
  '/login',
  loginLimiter,               // ✅ Rate limiting
  validate(loginSchema),      // ✅ Validation
  login
);

// ================= REFRESH TOKEN =================
// router.post(
//   '/refresh-token',
//   refreshToken
// );

export default router;