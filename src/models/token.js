import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  }
})

const TokenRepository = mongoose.model('Token', tokenSchema)

export default TokenRepository