import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
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
  req: AuthRequest,
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

    // Create image URL if file uploaded, single image upload,
    // const imageUrl = req.file incase single image upload
    //   ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    //   : undefined;

    //for array of images
    // const files = req.files as Express.Multer.File[]; //incase array of images uploaded

    // const imageUrls = files
    //   ? files.map(
    //       file =>
    //         `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
    //     )
    //   : [];

    //for fields of images
    const files = req.files as {
      profileImage?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    };
    const profileImageUrl = files.profileImage
      ? //now coming lines will use to create url for profile image and documents,
        // since we are using fields for upload, so we can have separate field for profile image and
        // documents, so we can create url separately for both.
        `${req.protocol}://${req.get('host')}/uploads/${files.profileImage[0].filename}`
      : undefined; //req.protocol=https then :// means https:// and req.get('host') means localhost:5000 or whatever host and port we are using,
    // then /uploads/ means we made app.use(/uploads in server) and
    // filename to get the complete url of the uploaded image.
    const documentUrls = files.documents
      ? files.documents.map(
          file =>
            `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
        )
      : [];
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      // profileImage: imageUrl, // for single image
      // profileImages: imageUrls, //for array of images
      profileImage: profileImageUrl, // for single image
      documents: documentUrls, //for array of images
    });

    const token = generateToken({
      id: user._id,
      role: user.role,
    });

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
  req: AuthRequest,
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
