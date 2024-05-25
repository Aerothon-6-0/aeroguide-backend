const aeroguideBaseUrl =
  'https://83b2-2401-4900-33b5-5391-48a1-2719-7af1-630e.ngrok-free.app';
import axios from 'axios';

export const AeroguideService = {
  //
  async getOptimalRoute(flightMatrix: any) {
    const response = await axios.post(`${aeroguideBaseUrl}`, flightMatrix);

    return response.data;
  },

  async getOptimalRouteV2(
    source: { lat: number; long: number },
    destination: { lat: number; long: number },
  ) {
    console.log(source, destination);
    const response = await axios.post(`${aeroguideBaseUrl}/getMatrix`, {
      source,
      destination,
    });

    return response.data;
  },
};
