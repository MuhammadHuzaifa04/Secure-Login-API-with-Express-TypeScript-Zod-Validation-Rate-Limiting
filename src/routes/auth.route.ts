import { Router } from 'express';
import { register, login } from '../controllers/auth/auth.controller';

import { validate } from '../middleware/validate.middleware';
import { loginLimiter } from '../middleware/rateLimit.middleware';

import { registerSchema, loginSchema } from '../validations/auth.validation';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// ================= REGISTER =================
// router.post('/register', upload.single('profileImage'), register);
//  //incase of single image upload
// router.post('/register', upload.array('profileImages', 2), register);
//  //incase of array of images, max 5 images can be uploaded

router.post(
  '/register',
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'documents', maxCount: 3 },
  ]),
  register
); //incase of fields, one profile and some documents can be uploaded

// ================= LOGIN =================
router.post(
  '/login',
  loginLimiter, // ✅ Rate limiting
  validate(loginSchema), // ✅ Validation
  login
);

// ================= REFRESH TOKEN =================
// router.post(
//   '/refresh-token',
//   refreshToken
// );

export default router;
