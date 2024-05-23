const aeroguideBaseUrl = 'https://7953-106-206-21-4.ngrok-free.app/';
import axios from 'axios';

export const AeroguideService = {
  //
  async getOptimalRoute(flightMatrix: any) {
    const response = await axios.post(`${aeroguideBaseUrl}`, flightMatrix);

    return response.data;
  },
};
