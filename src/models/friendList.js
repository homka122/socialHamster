import mongoose from "mongoose";

const friendListSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  user2: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  currentStatus: {
    type: mongoose.Types.ObjectId,
    ref: 'Friendship',
  }
})


const FriendListRepository = mongoose.model('FriendList', friendListSchema)

export default FriendListRepository