import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const hashPassword = (password: string) => bcrypt.hash(password, 10);

export const comparePassword = (password: string, hashed: string) =>
  bcrypt.compare(password, hashed);

export const generateToken = (payload: object) =>
  jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: '1h',
  });

export const verifyToken = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET as string);
