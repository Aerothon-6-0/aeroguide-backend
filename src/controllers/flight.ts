import { Request, Response } from 'express';

export const FlightController = {
  async createFlight(req: Request, res: Response) {
    console.log(req.body);
    if (req.body) {
      res.status(200).json({ message: 'hi topre' });
    }
  },
};
