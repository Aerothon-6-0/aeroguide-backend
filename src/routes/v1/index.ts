import { Router } from 'express';
import { Request, Response } from 'express';
import accounts from './accounts';
import flightRoute from './flight';
import weather from './weather';
import data from './fetchData'


const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('v1 Router');
});

router.use('/accounts', accounts);
router.use('/flight', flightRoute);
router.use('/weather', weather);
router.use('/fetchData',data);

export default router;
