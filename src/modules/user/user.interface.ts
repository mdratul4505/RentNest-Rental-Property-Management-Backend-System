import { Role } from "../../../generated/prisma";

export type RegisterUserPayload = {
  name: string;
  email: string;
  password: string;
  role: Role; 
};