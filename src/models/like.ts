import mongoose, { Schema } from 'mongoose';

export interface ILike {
  _id: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
}

const likesSchema = new mongoose.Schema<ILike>({
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    require: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const LikeRepository = mongoose.model<ILike>('Like', likesSchema);

export default LikeRepository;
