import { Request, Response, NextFunction } from 'express';
import User from '../../models/user.model';
import {
  comparePassword,
  generateToken,
  sendResponse,
  HTTP_STATUS,
  hashPassword,
} from '../../utils';
import { AppError } from '../../utils';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(
        new AppError('All fields are required', HTTP_STATUS.BAD_REQUEST)
      );
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return next(new AppError('User already exists', HTTP_STATUS.CONFLICT));
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken({
      id: user._id,
      role: user.role,
    });

    // Remove password from response
    const userObj = user.toObject();
    const { password: _removed, ...safeUser } = userObj;

    return sendResponse(
      res,
      HTTP_STATUS.CREATED,
      'User registered successfully',
      {
        user: safeUser,
        accessToken: token,
      }
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(
        new AppError('Email and password are required', HTTP_STATUS.BAD_REQUEST)
      );
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(
        new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED)
      );
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return next(
        new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED)
      );
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken({
      id: user._id,
      role: user.role,
    });

    // Remove password from response
    const userObj = user.toObject();
    const { password: _removed, ...safeUser } = userObj;

    return sendResponse(res, HTTP_STATUS.OK, 'Login successful', {
      user: safeUser,
      accessToken: token,
    });
  } catch (error) {
    next(error);
  }
};
