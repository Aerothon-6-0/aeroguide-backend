import { Request, Response } from 'express';

export const FlightRouteController = {
  async createFlightMap(req: Request, res: Response) {
    console.log(req.body);
    if (req.body) {
      res.status(200).json({ message: 'hi topre' });
    }
  },
};
