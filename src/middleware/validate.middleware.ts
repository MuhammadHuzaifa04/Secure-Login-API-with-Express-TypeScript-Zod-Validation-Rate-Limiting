import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError, HTTP_STATUS } from '../utils';

export const validate =
  (schema: z.ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.issues?.[0]?.message || 'Validation failed';

      return next(new AppError(message, HTTP_STATUS.BAD_REQUEST));
    }

    // Overwrite body with validated data
    req.body = result.data;

    next();
  };
