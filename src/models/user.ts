import mongoose from 'mongoose';

export interface IUser {
  _id: mongoose.Types.ObjectId;
  username: string;
  password: string;
  role: 'ADMIN' | 'USER';
  profilePhoto?: string;
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: ['ADMIN', 'USER'],
    default: 'USER',
    required: true,
  },
  profilePhoto: {
    type: String,
  },
});

const UserRepository = mongoose.model<IUser>('User', userSchema);

export default UserRepository;
