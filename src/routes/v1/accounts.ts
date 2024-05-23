import { Router } from 'express';
import { AccountController } from '../../controllers/accounts';
import flight from './flight';

const router = Router();

router.post('/', AccountController.createAccount);
router.use('/:id/flight', flight);

export default router;
