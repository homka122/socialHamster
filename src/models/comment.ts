import mongoose, { Schema } from 'mongoose';

export interface IComment {
  _id: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  likeUsers: mongoose.Types.Array<mongoose.Types.ObjectId>;
  text: string;
  createdAt: Date;
}

const commentSchema = new mongoose.Schema<IComment>({
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likeUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CommentRepository = mongoose.model<IComment>('Comment', commentSchema);

export default CommentRepository;
