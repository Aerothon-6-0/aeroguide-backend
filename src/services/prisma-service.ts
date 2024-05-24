import { Prisma, PrismaClient } from '@prisma/client';
import { Geography } from '../interfaces/map-interface';

const prisma = new PrismaClient();

export const PrismaService = {
  /**
   * Create a new account
   * @param email
   * @param name
   * @returns
   */
  async createAccount(email: string, name: string) {
    return await prisma.account.create({
      data: {
        email,
        name,
      },
    });
  },
  async createAirline(
    name: string,
    country: string,
    IATA_code: string,
    ICAO_code: string,
  ) {
    return await prisma.airline.create({
      data: {
        name,
        country,
        IATA_code,
        ICAO_code,
      },
    });
  },

  async createAircraft(
    model: string,
    manufacturer: string,
    capacity: number,
    airlineId: number,
    healthMetrics: Prisma.InputJsonValue,
    lastMaintenance: Date,
  ) {
    return await prisma.aircraft.create({
      data: {
        model,
        manufacturer,
        capacity,
        airlineId,
        healthMetrics,
        lastMaintenance,
      },
    });
  },

  async createAirport(
    code: string,
    name: string,
    city: string,
    country: string,
    location: number[],
    elevation: number,
  ) {
    return await prisma.airport.create({
      data: {
        code,
        name,
        city,
        country,
        location,
        elevation,
      },
    });
  },
  async findAirport(
    name: string
  ){
    return await prisma.airport.findFirst({
      where:{
        name: name
      }
    })
  },
  async searchAndUpdate(
    code: string,
    name: string,
    city: string,
    country: string,
    location: number[],
    elevation: number,
  ) {
  try {
    return await prisma.airport.upsert({
      where: { code: code },
      update: { name: name },
      create: { code, name, city, country, location, elevation },
    });
  } catch (error) {
    console.error(error)
  }
  },

  async countAirport() {
    return await prisma.airport.count();
  },
  

  async createFlight(
    airlineId: number,
    userId: number,
    originCode: string,
    destinationCode: string,
    scheduledDeparture: Date,
    scheduledArrival: Date,
    actualDeparture: Date,
    actualArrival: Date,
    status: string,
    // currLocation: { lat: number; long: number },
    // altitude: number,
    lastUpdated: Date,
  ) {
try {
  
  console.log("runn");
  return await prisma.flight.create({
    data: {
      airlineId,
      userId,
      originCode,
      destinationCode,
      scheduledDeparture,
      scheduledArrival,
      actualDeparture,
      actualArrival,
      status,
      // altitude,
      lastUpdated,
    },
  });
} catch (error) {
  console.error(error)
  throw new Error("Error in creating flight")
}
  },


  async countFlight(){
    return await prisma.flight.count();
  },

  async getFlightById(id: number) {
    return prisma.flight.findUnique({
      where: { id },
      include: {
        origin: true,
        destination: true,
      },
    });
  },

  async getFlights() {
    return prisma.flight.findMany();
  },

  async updateFlight(id: number, data: Prisma.FlightUpdateInput) {
    return prisma.flight.update({
      where: { id },
      data,
    });
  },

  async deleteFlight(id: number) {
    return prisma.flight.delete({
      where: { id },
    });
  },

  async createWeatherCondition(data: Prisma.WeatherConditionCreateInput) {
    return prisma.weatherCondition.create({
      data,
    });
  },

  async getWeatherConditionById(id: number) {
    return prisma.weatherCondition.findUnique({
      where: { id },
    });
  },

  async getWeatherConditions() {
    return prisma.weatherCondition.findMany();
  },

  async updateWeatherCondition(
    id: number,
    data: Prisma.WeatherConditionUpdateInput,
  ) {
    return prisma.weatherCondition.update({
      where: { id },
      data,
    });
  },

  async deleteWeatherCondition(id: number) {
    return prisma.weatherCondition.delete({
      where: { id },
    });
  },

  // async createFlight(userId: number) {
  //   return await prisma.flight.;
  // },

  async getAllScheduledFlights() {
    const currentDate = new Date();
    const fiveMinutesLater = new Date(currentDate.getTime() + 5 * 60 * 1000);
    return await prisma.flight.findMany({
      where: {
        scheduledDeparture: {
          gte: fiveMinutesLater,
        },
      },
      include:{
        origin: true,
        destination: true,
        Airline: true
      }
    });
  },

  async findAirlineByIataOrIcao(iata: string, icao: string) {
    return await prisma.airline.findFirst({
      where: {
        OR: [{ IATA_code: iata }, { ICAO_code: icao }],
      },
    });
  },
};
