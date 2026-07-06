import jwt, { Secret, SignOptions } from "jsonwebtoken";

const createToken = (
  payload: Record<string, any>,
  secret: Secret,
  options: SignOptions
) => {
  return jwt.sign(payload, secret, options);
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret);
};

export const jwtUtils = {
  createToken,
  verifyToken,
};
