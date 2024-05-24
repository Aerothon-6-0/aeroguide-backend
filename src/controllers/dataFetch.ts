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

}

}
