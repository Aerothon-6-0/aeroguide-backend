import { Request, Response } from 'express';
import { Bounds } from '../interfaces/map-interface';
import { WeatherService } from '../services/weather-service';
import { MapMatrixTransformer } from '../transformers/map-transformer';
import { AeroguideService } from '../services/aeroguide-service';
import { PrismaService } from '../services/prisma-service';
import { getLatAndLangFromMatrix, getLatAndLangFromMatrix2 } from '../utils/map-utils';

export const FlightController = {
  async createFlight(req: Request, res: Response) {
    if (req.body) {
      res.status(200).json({ message: 'hi topre' });
    }
  },

  async getFlightRoute(req: Request, res: Response) {
    try {
      const flightId = req.params.id;
      if (!flightId) {
        res.status(400).json({ message: 'Flight id is required' });
      }

      const flight = await PrismaService.getFlightById(parseInt(flightId));

      const {
        bounds,
      }: {
        bounds: Bounds;
      } = req.body;

      if (!flight?.origin || !flight.destination) {
        return res.status(404).json({ message: 'Flight info not found' });
      }

      // const { lat, long }: { lat: number[]; long: number[] } =
      //   await WeatherService.generateLatLong(bounds);

      const latLongMatrix = await AeroguideService.getOptimalRouteV2(
        { lat: flight?.origin.location[0], long: flight?.origin.location[1] },
        {
          lat: flight?.destination.location[0],
          long: flight?.destination.location[1],
        },
      );
      console.log(latLongMatrix,typeof latLongMatrix)

      const { lat, long } = getLatAndLangFromMatrix2(latLongMatrix.matrix);
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

      // console.log(modifiedMatrix)
      const optimalRoute: any =
        await AeroguideService.getOptimalRoute(modifiedMatrix);

      res.status(200).json(optimalRoute);
    } catch (error: any) {
      console.error(error.message);
      res.status(400).json({ message: error });
    }
  },
  async getFlightDetails(req: Request, res: Response) {
    try {
      const data = await PrismaService.getAllScheduledFlights();

      res.status(200).json(data);
    } catch (e) {
      console.error(e);
    }
  },
  async getFlightById(req: Request, res: Response) {
    try {
      const flightId = req.params.id;
      if (!flightId) {
        res.status(400).json({ message: 'Flight id is required' });
      }
      const flight = await PrismaService.getFlightById(parseInt(flightId));
      const riskAssessment = await PrismaService.getRiskAssessment(
        parseInt(flightId),
      );
      if (!flight?.origin) {
        return res.status(404).json({ message: 'Flight info not found' });
      }
      console.log(flight?.origin.location[0], flight?.origin.location[1]);
      const weatherInfo = await WeatherService.getWeatherByLatLong(
        flight?.origin.location[0],
        flight?.origin.location[1],
      );
      console.log(weatherInfo);
      res.status(200).json({ flight, weatherInfo, riskAssessment });
    } catch (error) {}
  },

  // async getFlightPlannedRoute(req:Request,res:Response){
  //   try{
  //     const flightId = req.params.id;
  //     if (!flightId) {
  //       res.status(400).json({ message: 'Flight id is required' });
  //     }

  //     const flight = await PrismaService.getFlightById(parseInt(flightId));

  //     res.json(flight.plannedRoute)
  //   }
  //   catch(e){
  //     console.error(e);
  //   }
  // }
};
