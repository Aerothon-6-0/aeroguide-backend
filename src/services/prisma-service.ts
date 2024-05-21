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
    return prisma.account.create({
      data: {
        email,
        name,
      },
    });
  },
};
