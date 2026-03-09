import { Response, NextFunction } from 'express';
import User from '../../models/user.model';
import { sendResponse, HTTP_STATUS, AppError } from '../../utils';
import { AuthRequest } from '../../middleware/auth.middleware';

export const getAllUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Ensure page and limit are positive integers, defaulting to 1 and 10 respectively, 1, parseint
    // If page or limit is invalid (e.g., negative, zero, or non-numeric), it will default to 1 for page and 10 for limit
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    // Ensure limit is a positive integer, default to 10 if not provided or invalid
    const limit = Math.max(1, parseInt(req.query.limit as string) || 10);

    const skip = (page - 1) * limit;

    const total = await User.countDocuments();

    //fetching pagination data from database, excluding password field
    const users = await User.find().select('-password').skip(skip).limit(limit);

    return sendResponse(
      //response in output
      res,
      HTTP_STATUS.OK,
      'Users fetched successfully',
      {
        users,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      }
    );
  } catch (error) {
    next(error);
  }
};

// ==============================
// GET USER BY ID (Admin Only)
// ==============================
export const getUserById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return next(new AppError('User not found', HTTP_STATUS.NOT_FOUND));
    }

    return sendResponse(res, HTTP_STATUS.OK, 'User fetched successfully', user);
  } catch (error) {
    next(error);
  }
};
