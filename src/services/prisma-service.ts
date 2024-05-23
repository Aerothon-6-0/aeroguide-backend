import { PrismaClient } from '@prisma/client';

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

  // async createFlight(userId: number) {
  //   return await prisma.flight.;
  // },

  async getAllScheduledFlights(){
    const currentDate = new Date();
    const fiveMinutesLater = new Date(currentDate.getTime() + 5 * 60 * 1000);
    return await prisma.flight.findMany({
      where :{
        scheduledDeparture :{
          gte:currentDate,
          lte:fiveMinutesLater
        },
      }
    })
  }
};
