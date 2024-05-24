import { fetchWeatherApi } from 'openmeteo';
import {
  changeInLatitude,
  changeInLongitude,
  generateMatrix,
} from '../utils/map-utils';
import { Bounds } from '../interfaces/map-interface';

const weather_url = 'https://api.open-meteo.com/v1/forecast';

export const WeatherService = {
  async getWeatherByLatLong(lat: number, long: number) {
    let params: any = {};
    params['latitude'] = lat;
    params['longitude'] = long;
    params['hourly'] = [
      'rain',
      'snowfall',
      'weather_code',
      'cloud_cover',
      'visibility',
      'wind_speed_180m',
      'wind_direction_180m',
    ];
    params['forecast_days'] = 1;

    const response: any = await fetchWeatherApi(weather_url, params);

    if (!response) {
      throw new Error('No weather data found');
    }
    return response.data;
  },

  async getBulkWeatherByLatLong(lat: number[], long: number[]) {
    if (lat.length !== long.length) {
      throw new Error(
        'Latitude and longitude arrays must be of the same length',
      );
    }
    let params: any = {};
    params['latitude'] = [...lat];
    params['longitude'] = [...long];
    (params['hourly'] = [
      'rain',
      'weather_code',
      'cloud_cover',
      'visibility',
      'wind_speed_180m',
      'wind_direction_180m',
    ]),
      (params['forecast_days'] = 1);

    try {
      const responses: any = await fetchWeatherApi(weather_url, params);

      if (responses.length === 0) {
        throw new Error('No weather data found');
      }

      // Helper function to form time ranges
      const range = (start: number, stop: number, step: number) =>
        Array.from(
          { length: (stop - start) / step },
          (_, i) => start + i * step,
        );

      const weatherDataArray = responses.map((response: any) => {
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const lat = response.latitude();
        const long = response.longitude();
        const hourly = response.hourly()!;

        const weatherData = {
          hourlyData: {
            time: range(
              Number(hourly?.time()),
              Number(hourly?.timeEnd()),
              hourly?.interval(),
            ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
            rain: hourly.variables(0)!.valuesArray()!,
            weatherCode: hourly.variables(1)!.valuesArray()!,
            cloudCover: hourly.variables(2)!.valuesArray()!,
            visibility: hourly.variables(3)!.valuesArray()!,
            windSpeed180m: hourly.variables(4)!.valuesArray()!,
            windDirection180m: hourly.variables(5)!.valuesArray()!,
          },
        };

        const formattedHourlyData = weatherData.hourlyData.time.map(
          (timestamp: any, index: number) => ({
            time: timestamp, // Convert Unix timestamp to Date
            rain: weatherData.hourlyData.rain[index],
            visibility: weatherData.hourlyData.visibility[index],
            weatherCode: weatherData.hourlyData.weatherCode[index],
            cloudCover: weatherData.hourlyData.cloudCover[index],
            windSpeed180m: weatherData.hourlyData.windSpeed180m[index],
            windDirection180m: weatherData.hourlyData.windDirection180m[index],
          }),
        );

        return { lat, long, formattedHourlyData };
      });
      let weatherMatrix: any[] = [];
      let prevLat = weatherDataArray[0].lat;
      let row: any[] = [];
      weatherDataArray.forEach((weatherData: any) => {
        if (weatherData.lat !== prevLat ) {
          weatherMatrix.push(row);
          row = [weatherData];
          prevLat = weatherData.lat;
        } else {
          row.push(weatherData);
        }
      });
      return weatherMatrix;
    } catch (error) {
      console.error(error);
      // throw new Error(`${error}`);
    }
  },

  async generateLatLong(bounds: Bounds) {
    // generate a matrix with the bounds being the corners indices of the matrix
    //and the source and destination being any node in the matrix
    // the matrix will be a 2D array of lat and long
    // the matrix will be of size can be any depending on the bounds distance between them
    // the distance between any node has to be 5km
    // each node should have a lat and long

    const distance = 75; // 60km

    const latlongMatrix = generateMatrix(bounds, distance);

    const lat: number[] = [];
    const long: number[] = [];
    latlongMatrix.forEach((row) => {
      row.forEach((node) => {
        lat.push(node.lat);
        long.push(node.long);
      });
    });
    return { lat, long };
  },
};
