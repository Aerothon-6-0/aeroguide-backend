import { Request, Response } from 'express';
import { PrismaService } from '../services/prisma-service';

export const AirportController = {
    async getAirportDetails(req: Request, res: Response) {
      try {
        
  
        const code = req.params.code;
  
        const airport = await PrismaService.findAirportById(code);
        
        const data = {
            airportName: airport?.name,
            location: airport?.location
        }
       
        res.status(200).json({ message: 'Airport location' , data: data});
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    },
  };
  
