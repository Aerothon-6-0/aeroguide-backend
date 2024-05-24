import { PrismaService } from '../services/prisma-service';
import { Request, Response } from 'express';
import axios from 'axios'

export const dataFetch = {
    async addAirportDetails (req: Request, res: Response){
        
            const response = await axios.get('http://api.aviationstack.com/v1/airports', {
              params: {
                access_key: process.env.AVIATIONSTACK_API_KEY,
              },
            });
      
            const airports = response.data.data;
            console.log(airports);
      
            await Promise.all(airports.map(async(airport: any) => {
                await PrismaService.searchAndUpdate(
                    airport.iata_code || "NULL",
                    airport.airport_name || "NULL",
                    airport.city_iata_code || "NULL",
                    airport.country_name || "NULL",
                    [parseFloat(airport.latitude), parseFloat(airport.longitude)],
                    0
                )
            } ))
              
              
            

            res.status(200).json({ message: 'data added', data: airports});
      
    
},
async getCountAirport (req: Request, res: Response){

    const count = await PrismaService.countAirport();

    res.status(200).json({ message: 'data added', data: count});

},

async createAirline(req: Request, res: Response){
            
    const response = await axios.get('http://api.aviationstack.com/v1/airlines', {
        params: {
          access_key: process.env.AVIATIONSTACK_API_KEY,
        },
      });

    const airlines = response.data.data;

    await Promise.all(airlines.map(async(airline: any) => {
        await PrismaService.createAirline(
            airline.airline_name || "NULL",
            airline.country_name || "NULL",
            airline.iata_code || "NULL",
            airline.icao_code || "NULL",
        )
    } ))

    res.status(200).json({ message: 'data added', data: airlines});

},

async findAndAddFlight(req: Request, res: Response) {
  const {user} = req.params;
  const userId = parseInt(user);
  const response = await axios.get('http://api.aviationstack.com/v1/flights', {
        params: {
          access_key: process.env.AVIATIONSTACK_API_KEY,
          limit: 10

        },
      });

  const flights = response.data.data;

  const currentTime = new Date();
  const fiveMinutesFromNow = new Date(currentTime.getTime() + 5 * 60000);

  

  const data = flights.filter((flight: any) => {
    const departureTime = new Date(flight.departure.estimated);
    return departureTime > fiveMinutesFromNow;
})

  let flightData: any[] = [];
  data.map((dat: any) => {
    const flight = {
      Time: dat.departure.estimated,
      FlightNum: dat.flight.number,
      Source: dat.departure.airport,
      Destination: dat.arrival.airport
  
    }

    flightData.push(flight);
  })

  
  // await Promise.all(
  //   data.map(async(dat: any) => {
  //     await PrismaService.createFlight(
        
  //          dat.aircraft.iata || "NULL",
  //          userId,
  //          dat.departure.airport,
  //          dat.arrival.airport,
  //          dat.departure.scheduled,
  //         dat.arrival.scheduled,
  //          dat.departure.actual,
  //         dat.arrival.actual,
  //          dat.flight_status,
  //          [dat.live.latitude,   dat.live.longitude ]  ,  
  //          dat.live.altitude, 
  //          new Date()
        
  //     )
  //   })
  // )

  
  

  res.status(200).json({ message: 'data added', data: flightData});

}

}
