import { Router } from 'express';
import { claimDeal, getMyClaims } from '../controllers/claimsController';
import { protect } from '../middleware/auth';
import { claimDealValidation } from '../validators/claimValidators';

const router = Router();

router.use(protect);
router.post('/', claimDealValidation, claimDeal);
router.get('/', getMyClaims);

export default router;
