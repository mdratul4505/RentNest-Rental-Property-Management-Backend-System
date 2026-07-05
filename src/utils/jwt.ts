import jwt, { Secret, SignOptions } from "jsonwebtoken";

const createToken = (
  payload: Record<string, any>,
  secret: Secret,
  options: SignOptions
) => {
  return jwt.sign(payload, secret, options);
};

export const jwtUtils = {
  createToken,
};
