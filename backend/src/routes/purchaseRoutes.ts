import { Router } from 'express';
import { AuthRequest, authenticate } from '../middleware/auth';
import { getPurchasesByUser } from '../services/purchaseService';

const router = Router();

router.use(authenticate);

router.get('/', (req: AuthRequest, res) => {
  res.json(getPurchasesByUser(req.user!.id));
});

export default router;