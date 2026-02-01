import { Router } from 'express';
import { getAllDeals, getDealById } from '../controllers/dealsController';

const router = Router();

router.get('/', getAllDeals);
router.get('/:id', getDealById);

export default router;
