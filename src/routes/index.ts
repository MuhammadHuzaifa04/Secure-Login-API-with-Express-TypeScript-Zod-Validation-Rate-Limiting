import { Router } from 'express';
import authRoutes from './auth.route';
import userRoutes from './user.route';
const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
//since it is an index file, so it will be automatically read and
// when we import from routes, it will automatically read this file and get the routes from here.
// in app.ts
