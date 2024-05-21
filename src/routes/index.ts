import { Router } from 'express';
import { Request, Response } from 'express';
import v1ApiRouter from './v1';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('It works!');
});

router.use('/api/v1', v1ApiRouter);

export default router;
