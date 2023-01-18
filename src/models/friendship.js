import mongoose from "mongoose";
import FriendListRepository from "./friendList.js";

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
  const orCondition = { $or: [{ user1: this.reciever, user2: this.sender }, { user1: this.sender, user2: this.reciever }] }
  const data = { user1: this.sender, user2: this.reciever, currentStatus: this }
  await FriendListRepository.updateOne(orCondition, data, { upsert: true })
  next()
})

const FriendshipRepository = mongoose.model('Friendship', friendshipSchema)

export default FriendshipRepository