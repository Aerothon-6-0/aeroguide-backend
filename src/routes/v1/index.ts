import { Router } from 'express';
import { Request, Response } from 'express';
import accounts from './accounts';
import flightRoute from './flightRoute';
import weather from './weather';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('v1 Router');
});

router.use('/accounts', accounts);
router.use('/flightRoute', flightRoute);
router.use('/weather',weather)

export default router;
