import { PrismaService } from '../services/prisma-service';
import { Request, Response } from 'express';
// import pLimit from 'p-limit';
import axios from 'axios';

export const dataFetch = {
  async addAirportDetails(req: Request, res: Response) {
    try {
      const response = await axios.get(
        'http://api.aviationstack.com/v1/airports',
        {
          params: {
            access_key: process.env.AVIATIONSTACK_API_KEY,
            limit: 100,
            offset:1200,

          },
        },
      );
  
      const airports = response.data.data;

  
      
        airports.map(async (airport: any) => {

         const data =  await PrismaService.searchAndUpdate(
            airport.iata_code || 'NULL',
            airport.airport_name || 'NULL',
            airport.city_iata_code || 'NULL',
            airport.country_name || 'NULL',
            [parseFloat(airport.latitude), parseFloat(airport.longitude)],
            0,
          );
          console.log(data)
        }),

  
      res.status(200).json({ message: 'data added', data: airports });
    } catch (error:any) {
      console.error(error)
      res.status(500).json({ message: 'An error occurred', error: error.message });
    }
  },
  async getCountAirport(req: Request, res: Response) {
    const count = await PrismaService.countAirport();

    res.status(200).json({ message: 'data added', data: count });
  },

  async createAirline(req: Request, res: Response) {
    const response = await axios.get(
      'http://api.aviationstack.com/v1/airlines',
      {
        params: {
          access_key: process.env.AVIATIONSTACK_API_KEY,
        },
      },
    );

    const airlines = response.data.data;

    await Promise.all(
      airlines.map(async (airline: any) => {
        await PrismaService.createAirline(
          airline.airline_name || 'NULL',
          airline.country_name || 'NULL',
          airline.iata_code || 'NULL',
          airline.icao_code || 'NULL',
        );
      }),
    );

    res.status(200).json({ message: 'data added', data: airlines });
  },

  async  findAndAddFlight(req: Request, res: Response) {

  
    try {
      const response = await axios.get(
        'http://api.aviationstack.com/v1/flights',
        {
          params: {
            access_key: process.env.AVIATIONSTACK_API_KEY,
            limit: 20,
            dep_iata:'AGR'
          },
        },
      );
  
      const flights = response.data.data;
      let processedFlights = [];
  
      for (const flight of flights) {
        // Skip flights with missing information
        if (!flight.airline.iata || !flight.airline.icao || !flight.departure.airport || !flight.arrival.airport) {
          continue;
        }

        const airline = await PrismaService.findAirlineByIataOrIcao(
          flight.airline.iata,
          flight.airline.icao,
        );

        if (!airline) {
          continue;
        }
  
     
  
        const originAirport = await PrismaService.findAirport(flight.departure.airport);
        const distAirport = await PrismaService.findAirport(flight.arrival.airport);

        if (!originAirport || !distAirport) {
          continue;
        }



        const flightData =  PrismaService.createFlight(
          airline.id,
          1,
          originAirport.code,
          distAirport.code,
          flight.departure.scheduled,
          flight.arrival.scheduled,
          flight.departure.actual,
          flight.arrival.actual,
          flight.flight_status,
          new Date(),
        );
  

        processedFlights.push(flightData);
      }
  
      res.status(200).json({ message: 'data added', data: processedFlights,totalFlight:flights });
    } catch (e:any) {
      console.error(e);
      res.status(500).json({ message: 'An error occurred', error: e.message });
    }
  },
  

  async getCountFlight(req: Request, res: Response) {
    const count = await PrismaService.countFlight();

    res.status(200).json({ message: 'data added', data: count });
  },
};
