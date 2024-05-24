import { Router } from 'express';
import { FlightController } from '../../controllers/flight';

const router = Router();

router.post('/', FlightController.createFlight);

router.post('/:id', FlightController.getFlight);

router.get('/',FlightController.getFlightDetails)

export default router;
