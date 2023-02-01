import FriendListRepository from '../models/friendList.js';

class FriendshipService {
  populateQuery(query) {
    return query
      .populate('user1', 'username')
      .populate('user2', 'username')
      .populate('currentStatus', '-__v')
      .select('-__v');
  }

  async findCurrentStatus(user1, user2) {
    const condition = {
      $or: [
        { user1, user2 },
        { user1: user2, user2: user1 },
      ],
    };
    const query = this.populateQuery(FriendListRepository.findOne(condition));
    const result = await query;
    return result;
  }

  async findAllStatuses(user) {
    const condition = { $or: [{ user1: user }, { user2: user }] };
    const query = this.populateQuery(FriendListRepository.find(condition));
    const result = await query;
    return result;
  }

  friendsAndSubscribersFromStatuses(list, userId) {
    let friends = [];
    let subscribers = [];
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
