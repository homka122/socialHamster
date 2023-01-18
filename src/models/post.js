import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: String,
  createdAt: {
    type: Date,
  },
})

postSchema.pre('save', async function (next) {
  this.createdAt = Date.now()
  next()
})

const PostRepository = mongoose.model('Post', postSchema)

export default PostRepository