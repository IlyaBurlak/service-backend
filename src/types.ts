import { User } from '@prisma/client';

export interface LoginResponse {
  access_token: string;
}

export interface RegisterBody {
  email: string;
  password: string;
  name: string;
  surname: string;
}

export type SafeUser = Omit<User, 'password'>;
