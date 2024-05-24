import { Router } from 'express';
import { dataFetch } from '../../controllers/dataFetch';
import flight from './flight';

const router = Router();

router.get('/airport',dataFetch.addAirportDetails );
router.get('/getCount',dataFetch.getCountAirport)
router.get('/airline',dataFetch.addAirportDetails)

export default router;
