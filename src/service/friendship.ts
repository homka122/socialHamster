import mongoose, { Query } from 'mongoose';
import FriendListRepository, { IFriendList } from '../models/friendList';
import { IFriendship } from '../models/friendship';
import { IUser } from '../models/user';

class FriendshipService {
  populateQuery(query: Query<any, any, any, any>) {
    return query
      .populate('user1', 'username')
      .populate('user2', 'username')
      .populate('currentStatus', '-__v')
      .select('-__v');
  }

  async findCurrentStatus(user1ID: mongoose.Types.ObjectId, user2ID: mongoose.Types.ObjectId) {
    const condition = {
      $or: [
        { user1: user1ID, user2: user2ID },
        { user1: user2ID, user2: user1ID },
      ],
    };
    const query = this.populateQuery(FriendListRepository.findOne(condition));
    const result = await query;
    return result;
  }

  async findAllStatuses(userId: mongoose.Types.ObjectId) {
    const condition = { $or: [{ user1: userId }, { user2: userId }] };
    const query = this.populateQuery(FriendListRepository.find(condition));
    const result = await query;
    return result;
  }

  friendsAndSubscribersFromStatuses(list: (IFriendList & { currentStatus: IFriendship })[], userId: string) {
    let friends: any = [];
    let subscribers: any = [];
    list.forEach((friendship) => {
      const anotherUser = friendship.user1.equals(userId) ? friendship.user2 : friendship.user1;

      if (friendship.currentStatus.status === 'Accepted') {
        friends.push(anotherUser);
      }

      if (
        (friendship.currentStatus.status === 'Requested' && friendship.currentStatus.reciever.equals(userId)) ||
        (friendship.currentStatus.status === 'Declined' && friendship.currentStatus.sender.equals(userId))
      ) {
        subscribers.push(anotherUser);
      }
    });

    return { friends, subscribers };
  }
}

export const friendshipService = new FriendshipService();
