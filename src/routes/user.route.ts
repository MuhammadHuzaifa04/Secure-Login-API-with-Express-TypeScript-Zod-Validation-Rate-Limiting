import { Router } from 'express';
import { getAllUsers, getUserById } from '../controllers';
import { protect,authorize } from '../middleware';

const router = Router();

router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, authorize('admin'), getUserById);

export default router;
