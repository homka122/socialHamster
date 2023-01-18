import FriendListRepository from "../models/friendList.js";
import FriendshipRepository from "../models/friendship.js";
import UserRepository from "../models/user.js";
import { ApiError } from "../utils/ApiError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const sendFriendRequest = catchAsync(async (req, res, next) => {
  // type = 'add' || 'delete'
  const { username, type } = req.body

  if (req.user.username === username) {
    return next(new ApiError('Нельзя добавлять в друзья самого себя', 400))
  }

  const reciever = await UserRepository.findOne({ username })
  if (!reciever) {
    return next(new ApiError('Пользователя с таким именем нет.', 400))
  }

  const currentFriendship = await FriendshipRepository.findOne({ $or: [{ reciever: reciever, sender: req.user }, { reciever: req.user, sender: reciever }] }).sort('-createdAt')

  if (type === 'add') {

    if (!currentFriendship || currentFriendship.status === 'Cancelled') {
      const friendship = await FriendshipRepository.create({ reciever, sender: req.user, status: 'Requested' })
      return res.status(200).json({ status: 'success', data: { friendship } })
    }

    if (currentFriendship.status === 'Accepted') {
      return next(new ApiError('Вы уже друзья.', 400))
    }

    const didUserSendRequestAlready = (currentFriendship.status === 'Requested' && currentFriendship.sender.equals(req.user._id))
    if (didUserSendRequestAlready) {
      return next(new ApiError('Заявка уже была отправлена'))
    }

    const isItAcceptRequest = (currentFriendship.status === 'Requested' && currentFriendship.reciever.equals(req.user._id))
    if (isItAcceptRequest) {
      const friendship = await FriendshipRepository.create({ reciever, sender: req.user, status: 'Accepted' })
      return res.status(200).json({ status: 'success', data: { friendship } })
    }

    const isItAddAfterDeclined = (currentFriendship.status === 'Declined' && currentFriendship.sender.equals(req.user._id))
    if (isItAddAfterDeclined) {
      const friendship = await FriendshipRepository.create({ reciever, sender: req.user, status: 'Accepted' })
      return res.status(200).json({ status: 'success', data: { friendship } })
    }

    return next(new ApiError('Bad Request', 400))
  }

  if (type === 'delete') {
    if (!currentFriendship || currentFriendship.status === 'Cancelled') {
      return next(new ApiError('Пользователь не отправлял вам заявки в друзья', 400))
    }

    const isItDeclineRequest = (currentFriendship.status === 'Requested' && currentFriendship.reciever.equals(req.user._id))
    if (isItDeclineRequest) {
      const friendship = await FriendshipRepository.create({ reciever, sender: req.user, status: 'Declined' })
      return res.status(200).json({ status: 'success', data: { friendship } })
    }

    const isItRemoveRequest = (currentFriendship.status === 'Accepted')
    if (isItRemoveRequest) {
      const friendship = await FriendshipRepository.create({ reciever, sender: req.user, status: 'Declined' })
      return res.status(200).json({ status: 'success', data: { friendship } })
    }

    const isItCancelRequest = ((currentFriendship.status === 'Requested' && currentFriendship.sender.equals(req.user._id) || currentFriendship.status === 'Declined' && currentFriendship.reciever.equals(req.user._id)))
    if (isItCancelRequest) {
      const friendship = await FriendshipRepository.create({ reciever, sender: req.user, status: 'Cancelled' })
      return res.status(200).json({ status: 'success', data: { friendship } })
    }

    return next(new ApiError('Bad Request', 400))
  }
})

export const getFriendsAndSubscribers = catchAsync(async (req, res, next) => {
  const list = await FriendListRepository.find({ $or: [{ user1: req.user }, { user2: req.user }] }).populate('user1', 'username').populate('user2', 'username').populate('currentStatus')
  console.log(list)
  let friends = []
  let subscribers = []
  list.forEach(friendship => {
    const anotherUser = friendship.user1.username === req.user.username ? friendship.user2 : friendship.user1

    if (friendship.currentStatus.status === 'Accepted') {
      friends.push(anotherUser)
    }

    if (friendship.currentStatus.status === 'Requested' && friendship.currentStatus.sender.equals(anotherUser._id) || friendship.currentStatus.status === 'Declined' && friendship.currentStatus.reciever.equals(anotherUser._id)) {
      subscribers.push(anotherUser)
    }

  })

  res.status(200).json({ status: 'success', data: { friends, subscribers } })
})