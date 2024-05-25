import cron from 'node-cron';
import axios from 'axios';
import { PrismaService } from '../services/prisma-service';
let count = 0;
const uniqueAirlines = new Set();
export const GetOptimalRouteJob = () => {
  cron.schedule('* * * * *', async () => {
    //get scheduled flight from next 5min
    // create the matrix for the flight
    // get the weather info of the flight matrix
    // call the aeroguide service with all the info
    console.log('Running a task every minute');
    fetchAndStorFlight();
  });
};

async function fetchAndStoreAirlines() {
  if (count <= 20) {
    console.log(count);
    try {
      const response = await axios.get(
        'http://api.aviationstack.com/v1/airlines',
        {
          params: {
            access_key: process.env.AVIATIONSTACK_API_KEY,
          },
        },
      );

      count++;
      const airlines = response.data.data;

      await Promise.all(
        airlines.map(async (airline: any) => {
          console.log(airline);
          // Skip if any required information is missing or if the airline is already processed
          if (
            !airline.airline_name ||
            !airline.iata_code ||
            !airline.icao_code ||
            !airline.country_name ||
            uniqueAirlines.has(airline.iata_code) ||
            uniqueAirlines.has(airline.icao_code)
          ) {
            return;
          }

          // Add the airline to the set of processed airlines
          uniqueAirlines.add(airline.iata_code);
          uniqueAirlines.add(airline.icao_code);

          // Save the airline to the database
          await PrismaService.createAirline(
            airline.airline_name || 'NULL',
            airline.country_name || 'NULL',
            airline.iata_code || 'NULL',
            airline.icao_code || 'NULL',
          );
        }),
      );
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}

async function fetchAndStorFlight() {
  if (count < 20) {
    const response = await axios.get(
      'http://api.aviationstack.com/v1/flights',
      {
        params: {
          access_key: process.env.AVIATIONSTACK_API_KEY,
          limit: 1,
        },
      },
    );
    console.log(count);

    const flights = response.data.data;

    // check flights airline icao code
    // if that is present in the database then store the flight against the airline id
    // if not then skip the flight
    // store the flight in the database
    // increment the count

    await Promise.all(
      flights.map(async (flight: any) => {
        console.log(flight);
        if (
          !flight.airline.iata ||
          !flight.airline.icao ||
          !flight.departure.airport ||
          !flight.arrival.airport
        ) {
          return;
        }
        const airline = await PrismaService.findAirlineByIataOrIcao(
          flight.airline.iata,
          flight.airline.icao,
        );
        console.log(airline);
        if (!airline) {
          return;
        }
        let live = null;
        if (flight?.live) {
          live = { lat: flight.live.latitude, long: flight.live.longitude };
        }

        const originAirport = await PrismaService.findAirport(
          flight.departure.airport,
        );
        const distAirport = await PrismaService.findAirport(
          flight.arrival.airport,
        );

        if (!originAirport || !distAirport) {
          return;
        }

        await PrismaService.createFlight(
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

        count++;
      }),
    );
  }
}
