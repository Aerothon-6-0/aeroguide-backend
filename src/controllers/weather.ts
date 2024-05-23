import { Request, Response } from 'express';
import { WeatherService } from '../services/weather-service';
import { Bounds } from '../interfaces/map-interface';

export const WeatherController = {
  async getWeatherByLatLong(req: Request, res: Response) {
    try {
      const { lat, long } = req.body;

      if (!lat || !long) {
        return res
          .status(500)
          .json({ message: 'Latitude and Longitude are required' });
      }
      const weatherInfo = await WeatherService.getWeatherByLatLong(lat, long);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getBulkWeatherByLatLong(req: Request, res: Response) {
    try {
      const bounds: Bounds = req.body.bounds;
      if (!bounds) {
        return res.status(500).json({ message: 'Bounds are required' });
      }
      const { lat, long }: { lat: number[]; long: number[] } =
        await WeatherService.generateLatLong(bounds);
      const weatherInfo = await WeatherService.getBulkWeatherByLatLong(
        lat,
        long,
      );

      res.status(200).json(weatherInfo);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },
};
