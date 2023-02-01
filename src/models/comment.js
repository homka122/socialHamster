import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likeUsers: [{
    type: mongoose.Types.ObjectId,
    ref: 'User'
  }],
  text: {
    type: String,
    required: true
  },
  createdAt: Date,
})

commentSchema.pre('save', async function (next) {
  this.createdAt = Date.now()
  next()
})

const CommentRepository = mongoose.model('Comment', commentSchema)

export default CommentRepository