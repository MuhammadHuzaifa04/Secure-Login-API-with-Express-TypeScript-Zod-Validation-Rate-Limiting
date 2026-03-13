import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  profileImage?: string; // link of uploaded image. incase of single image, remain same for
  //field because we use one image for profile and rest for documents.
  profileImages?: string[]; // link of uploaded image. incase of array
  documents?: string[]; //incase of fields, single image for profile and some for documents,
  //  so we can have separate field for documents.
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    // profileImage: { incase of single image
    //   type: String,
    // },
    // profileImages: { //incase of array of images
    //   type: [String],
    // },
    profileImage: {
      type: String,
    },
    documents: {
      type: [String],
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', userSchema);
