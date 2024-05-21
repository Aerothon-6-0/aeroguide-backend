import { Router } from 'express';
import { Request, Response } from 'express';
import accounts from './accounts';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('v1 Router');
});

router.use('/accounts', accounts);

export default router;
