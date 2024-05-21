import { Request, Response } from 'express';
import { PrismaService } from '../services/prisma-service';

export const AccountController = {
  async createAccount(req: Request, res: Response) {
    try {
      console.log(req.body);
      if (!req.body.data) {
        res.status(500).json({ message: 'User data is required' });
      }

      const { email_addresses, first_name, last_name } = req.body.data;

      const email = email_addresses[0].email_address;
      const name = `${first_name} ${last_name}`;

      const account = await PrismaService.createAccount(email, name);

      if (!account) {
        res.status(500).json({ message: 'Account not created' });
      }
      res.status(200).json({ message: 'Account created' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};
