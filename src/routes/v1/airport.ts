import { Router } from 'express';

import { AirportController } from '../../controllers/airport';

const router = Router();

router.get('/:code',AirportController.getAirportDetails)

export default router;
