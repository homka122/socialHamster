import mongoose, { Schema } from 'mongoose';

export interface IFriendList {
  _id: mongoose.Types.ObjectId;
  user1: mongoose.Types.ObjectId;
  user2: mongoose.Types.ObjectId;
  currentStatus: mongoose.Types.ObjectId;
}

// TODO: change name to 'friendshipStatus'
const friendListSchema = new mongoose.Schema<IFriendList>({
  user1: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  user2: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  currentStatus: {
    type: Schema.Types.ObjectId,
    ref: 'Friendship',
  },
});

const FriendListRepository = mongoose.model<IFriendList>('FriendList', friendListSchema);

export default FriendListRepository;
