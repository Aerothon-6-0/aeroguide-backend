import { Router } from 'express';
import { FlightController } from '../../controllers/flight';

const router = Router();

router.post('/', FlightController.createFlight);

router.post('/:id', FlightController.getFlightRoute);

router.get('/', FlightController.getFlightDetails);

router.get('/:id/info', FlightController.getFlightById);

export default router;
