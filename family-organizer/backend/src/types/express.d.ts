import { User as AppUser } from './user';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      firstName?: string;
      lastName?: string;
      familyId?: string;
      role?: string;
    }
  }
}

export {};
