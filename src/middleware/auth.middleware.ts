import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils';
import { HTTP_STATUS } from '../utils';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'user' | 'admin';
  };
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token) as {
      id: string;
      role: 'user' | 'admin';
    };

    req.user = decoded;
    next();
  } catch {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

export const authorize = (...roles: ('user' | 'admin')[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Forbidden',
      });
    }
    next();
  };
};
