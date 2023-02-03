import mongoose, { Schema } from 'mongoose';

export interface IPost {
  _id: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

const postSchema = new mongoose.Schema<IPost>({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: String,
  createdAt: {
    type: Date,
    default: () => new Date(Date.now()),
  },
});

const PostRepository = mongoose.model<IPost>('Post', postSchema);

export default PostRepository;
