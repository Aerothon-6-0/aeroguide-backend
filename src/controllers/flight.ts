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
       return res.status(400).json({ message: 'Flight id is required' });
      }

      const flight = await PrismaService.getFlightById(parseInt(flightId));

      const { bounds,source,destination }: { bounds: Bounds,source:{lat:number,long:number},destination:{lat:number,long:number} } = req.body;

      //generates lat and long array for the given bounds
      const { lat, long }: { lat: number[]; long: number[] } =
        await WeatherService.generateLatLong(bounds);

      // generates a matrix of weather data for the given lat and long
      const weatherInfo = await WeatherService.getBulkWeatherByLatLong(
        lat,
        long,
      );

      // modifies the matrix to include the distance between the origin and destination
      const modifiedMatrix = MapMatrixTransformer(
        weatherInfo,
        // flight?.origin.location,
        // flight?.destination.location,
        source,destination,
        // flight?.scheduledDeparture,
      );

      // gets the optimal route based on the modified matrix
      const optimalRoute: any =
        await AeroguideService.getOptimalRoute(modifiedMatrix);

      res.status(200).json(optimalRoute);
    } catch (error) {
      console.error(error);
    }
  },
};
