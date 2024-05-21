import { Router } from 'express';
import { AccountController } from '../../controllers/accounts';

const router = Router();

router.post('/', AccountController.createAccount);

export default router;
