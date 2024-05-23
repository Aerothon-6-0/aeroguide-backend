import { Router } from 'express';
import { FlightController } from '../../controllers/flight';

const router = Router();

router.post('/', FlightController.createFlight);

router.post('/:id', FlightController.getFlight);

export default router;
