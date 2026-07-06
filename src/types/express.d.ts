import { TDecodedUser } from "../middleware/auth";

declare global {
  namespace Express {
    interface Request {
      user?: TDecodedUser;
    }
  }
}