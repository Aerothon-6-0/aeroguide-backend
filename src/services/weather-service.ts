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
    params['lat'] = lat;
    params['lon'] = long;
    params['current'] = ["rain", "snowfall", "weather_code", "cloud_cover", "wind_speed_10m", "wind_direction_10m"];
    params['hourly'] =  ["rain", "snowfall", "weather_code", "cloud_cover", "visibility", "wind_speed_180m", "wind_direction_180m"];
    console.log(params)

    const response: any = await fetchWeatherApi(weather_url, params);

    if (!response) {
      throw new Error('No weather data found');
    }
    return response.data;
  },


  async getBulkWeatherByLatLong(lat: number[], long: number[]) {
    if (lat.length !== long.length) {
      throw new Error('Latitude and longitude arrays must be of the same length');
  }
    let params: any = {};
    params['lat'] = [...lat];
    params['lon'] = [...long];
    params['current'] = ["rain", "snowfall", "weather_code", "cloud_cover", "wind_speed_10m", "wind_direction_10m"];
    params['hourly'] =  ["rain", "snowfall", "weather_code", "cloud_cover", "visibility", "wind_speed_180m", "wind_direction_180m"];
console.log(params)
    const responses: any = await fetchWeatherApi(weather_url, params);
    if (!responses) {
      throw new Error('No weather data found');
    }
    
    const latLongTuple = lat.map((lat, index) => {
      return { lat, long: long[index] };
    })
 const data = await responses

 return latLongTuple
  
  },
  async generateLatLong(bounds: Bounds) {
    // generate a matrix with the bounds being the corners indices of the matrix
    //and the source and destination being any node in the matrix
    // the matrix will be a 2D array of lat and long
    // the matrix will be of size can be any depending on the bounds distance between them
    // the distance between any node has to be 5km
    // each node should have a lat and long

    const distance = 1000; // 60km

    const latlongMatrix = generateMatrix(bounds, distance);

    const lat:number[] =[]
    const long:number[]=[]
    latlongMatrix.forEach((row)=>{
        row.forEach((node)=>{
            lat.push(node.lat)
            long.push(node.long)
        })
    })
    return {lat,long}
  },
};
