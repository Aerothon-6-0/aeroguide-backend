import { Request, Response } from 'express';
import { Bounds } from '../interfaces/map-interface';
import { WeatherService } from '../services/weather-service';
import { MapMatrixTransformer } from '../transformers/map-transformer';
import { AeroguideService } from '../services/aeroguide-service';
import { PrismaService } from '../services/prisma-service';

export const FlightController = {
  async createFlight(req: Request, res: Response) {
    if (req.body) {
      res.status(200).json({ message: 'hi topre' });
    }
  },

  async getFlight(req: Request, res: Response) {
    try {
      const flightId = req.params.id;
      if (!flightId) {
        res.status(400).json({ message: 'Flight id is required' });
      }

      const flight = await PrismaService.getFlightById(parseInt(flightId));

      const {
        bounds,
        source,
        destination,
      }: {
        bounds: Bounds;
        source: { lat: number; long: number };
        destination: { lat: number; long: number };
      } = req.body;

      const { lat, long }: { lat: number[]; long: number[] } =
        await WeatherService.generateLatLong(bounds);

      const weatherInfo = await WeatherService.getBulkWeatherByLatLong(
        lat,
        long,
      );

      const modifiedMatrix = MapMatrixTransformer(
        weatherInfo,
        // source,
        // destination,
        flight?.origin.location,
        flight?.destination.location,
      );

      // const optimalRoute: any =
      //   await AeroguideService.getOptimalRoute(modifiedMatrix);

      res.status(200).json(modifiedMatrix);
    } catch (error) {
      console.error(error);
    }
  },
  async getFlightDetails(req: Request, res: Response){
    try{

      const data = await PrismaService.getAllScheduledFlights();

      res.status(200).json(data);

    }
    catch(e){
      console.error(e);
    }
  }

};
