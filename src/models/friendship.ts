import mongoose, { Schema } from 'mongoose';
import FriendListRepository from './friendList';

export interface IFriendship {
  _id: mongoose.Types.ObjectId;
  reciever: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  status: 'Requested' | 'Accepted' | 'Declined' | 'Blocked' | 'Cancelled';
  createdAt: Date;
}

const friendshipSchema = new mongoose.Schema<IFriendship>({
  reciever: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  sender: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['Requested', 'Accepted', 'Declined', 'Blocked', 'Cancelled'],
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

friendshipSchema.pre('save', async function (next) {
  const orCondition = {
    $or: [
      { user1: this.reciever, user2: this.sender },
      { user1: this.sender, user2: this.reciever },
    ],
  };
  const data = { user1: this.sender, user2: this.reciever, currentStatus: this };
  await FriendListRepository.updateOne(orCondition, data, { upsert: true });
  next();
});

const FriendshipRepository = mongoose.model<IFriendship>('Friendship', friendshipSchema);

export default FriendshipRepository;
