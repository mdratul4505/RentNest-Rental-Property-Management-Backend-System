import { Role } from "@prisma/client";

export type RegisterUserPayload = {
  name: string;
  email: string;
  password: string;
  role: Role; 
  image?: string;
};