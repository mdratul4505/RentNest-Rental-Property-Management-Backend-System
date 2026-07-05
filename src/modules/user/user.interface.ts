import { Role } from "../../../generated/prisma/enums";

export type RegisterUserPayload = {
  name: string;
  email: string;
  password: string;
  role: Role; 
};