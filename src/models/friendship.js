import mongoose from "mongoose";

const friendshipSchema = new mongoose.Schema({
  reciever: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  sender: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['Requested', 'Accepted', 'Declined', 'Blocked', 'Cancelled'],
    required: true,
  },
  createdAt: {
    type: Date
  }
})

friendshipSchema.pre('save', async function (next) {
  this.createdAt = Date.now()
  next()
})

const FriendshipRepository = mongoose.model('Friendship', friendshipSchema)

export default FriendshipRepository