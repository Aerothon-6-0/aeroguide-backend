const aeroguideBaseUrl = 'https://aeroguide-algorithm-1.onrender.com/';
import axios from 'axios';

export const AeroguideService = {
  //
  async getOptimalRoute(flightMatrix: any) {
    const response = await axios.post(`${aeroguideBaseUrl}`, flightMatrix);

    return response.data;
  },
};
