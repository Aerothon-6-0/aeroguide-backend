import { Router } from 'express';
import { FlightRouteController } from '../../controllers/flightRoute';

const router = Router();

router.post('/', FlightRouteController.createFlightMap);

export default router;
