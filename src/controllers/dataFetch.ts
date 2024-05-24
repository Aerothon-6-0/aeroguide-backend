import { PrismaService } from '../services/prisma-service';
import { Request, Response } from 'express';
// import pLimit from 'p-limit';
import axios from 'axios';

export const dataFetch = {
  async addAirportDetails(req: Request, res: Response) {
    const response = await axios.get(
      'http://api.aviationstack.com/v1/airports',
      {
        params: {
          access_key: process.env.AVIATIONSTACK_API_KEY,
          limit: 100,
          offset: 800
        },
      },
    );

    const airports = response.data.data;
    console.log(airports);

    await Promise.all(
      airports.map(async (airport: any) => {
        await PrismaService.searchAndUpdate(
          airport.iata_code || 'NULL',
          airport.airport_name || 'NULL',
          airport.city_iata_code || 'NULL',
          airport.country_name || 'NULL',
          [parseFloat(airport.latitude), parseFloat(airport.longitude)],
          0,
        );
      }),
    );

    res.status(200).json({ message: 'data added', data: airports });
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

  async findAndAddFlight(req: Request, res: Response) {

    const { default: pLimit } = await import('p-limit');
    

    const limit = pLimit(5);

    
      const response = await axios.get(
        'http://api.aviationstack.com/v1/flights',
        {
          params: {
            access_key: process.env.AVIATIONSTACK_API_KEY,
            limit: 20,
          },
        },
      );
      
  
      const flights = response.data.data;
  
      // check flights airline icao code
      // if that is present in the database then store the flight against the airline id
      // if not then skip the flight
      // store the flight in the database
      // increment the count
  
      try{
        flights.map(async(flight: any)  => {
        //  console.log(flight);
          if(!flight.airline.iata || !flight.airline.icao || !flight.departure.airport || !flight.arrival.airport){
            return;
          }

        //  console.log(flight.airline.iata);
          const airline = await PrismaService.findAirlineByIataOrIcao(
            flight.airline.iata,
            flight.airline.icao,
          );
        //  console.log(airline)
          if (!airline ) {
            return;
          }
          let live = null;
          if (flight?.live) {
            live = { lat: flight.live.latitude, long: flight.live.longitude };
          } 
  
          const originAirport = await PrismaService.findAirport(flight.departure.airport);
          const distAirport = await PrismaService.findAirport(flight.arrival.airport);
  
          if(!originAirport || !distAirport){
            return;
          }
          
            const flightData = await PrismaService.createFlight(
              airline.id,
              1,
              originAirport.code,
              distAirport.code,
              flight.departure.scheduled,
              flight.arrival.scheduled,
              flight.departure.actual,
              flight.arrival.actual,
              flight.flight_status,
              // flight.live.altitude,
              new Date(),
            );

            console.log(flightData);
          
          
  
          
        })

        res.status(200).json({ message: 'data added', data: flights });
      }
      catch(e){
        console.error(e);
      }
      
      
  },

  async getCountFlight(req: Request, res: Response) {
    const count = await PrismaService.countFlight();

    res.status(200).json({ message: 'data added', data: count });
  },
};
