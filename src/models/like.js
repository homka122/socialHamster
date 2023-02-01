import mongoose from "mongoose";

const likesSchema = new mongoose.Schema({
  post: {
    type: mongoose.Types.ObjectId,
    ref: 'Post',
    require: true
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    require: true
  },
  status: {
    type: Boolean,
    require: true,
  },
  createdAt: Date,
})

likesSchema.pre('save', async function (next) {
  this.createdAt = Date.now()
  next()
})

const LikeRepository = mongoose.model('Like', likesSchema);

export default LikeRepository;