import ConversationRepository, { IConversation } from '../models/conversation';
import { catchAsync } from '../utils/catchAsync';
import { NextFunction, query, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { IUser } from '../models/user';
import { Document } from 'mongoose';

class ConverationsController {
  getUserConversations = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const count = Number(req.query.count) || 50;
    const offset = Number(req.query.offset) || 0;

    const query = ConversationRepository.aggregate([
      { $match: { $or: [{ user1: req.user._id }, { user2: req.user._id }] } },
      { $limit: count },
      { $skip: offset },
      {
        $lookup: {
          from: 'messages',
          localField: 'lastMessage',
          foreignField: '_id',
          as: 'lastMessage',
          pipeline: [{ $project: { text: 1, createdAt: 1, sender: 1 } }],
        },
      },
      { $unwind: '$lastMessage' },
      {
        $lookup: {
          from: 'users',
          localField: 'lastMessage.sender',
          foreignField: '_id',
          as: 'lastMessage.sender',
          pipeline: [{ $project: { username: 1 } }],
        },
      },
      { $unwind: '$lastMessage.sender' },
      {
        $lookup: {
          from: 'users',
          localField: 'user1',
          foreignField: '_id',
          as: 'user1',
          pipeline: [{ $project: { username: 1 } }],
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user2',
          foreignField: '_id',
          as: 'user2',
          pipeline: [{ $project: { username: 1 } }],
        },
      },
      { $unwind: '$user1' },
      { $unwind: '$user2' },
      { $project: { __v: 0 } },
      { $sort: { 'lastMessage.createdAt': -1 } },
    ]);

    // const query = ConversationRepository.find({ $or: [{ user1: req.user._id }, { user2: req.user._id }] })
    //   .limit(count)
    //   .skip(offset)
    //   .populate({
    //     path: 'lastMessage',
    //     select: 'text createdAt sender',
    //     populate: {
    //       path: 'sender',
    //       select: 'username',
    //     },
    //     options: {
    //       sort: { createdAt: -1 },
    //     },
    //   })
    //   .populate<{ user1: IUser }>('user1', 'username')
    //   .populate<{ user2: IUser }>('user2', 'username')
    //   .select('-__v');

    const userConversations = await query;

    // Define "peer" field
    const formatedUserConversations = userConversations.map((conversation) => {
      let conversationForSend: any = { ...conversation };

      if (conversation.user1.username === req.user.username) {
        conversationForSend.peer = conversation.user2;
        delete conversationForSend.user1;
        delete conversationForSend.user2;
      } else if (conversation.user2.username === req.user.username) {
        conversationForSend.peer = conversation.user1;
        delete conversationForSend.user1;
        delete conversationForSend.user2;
      }

      return conversationForSend;
    });

    res.status(200).json({ status: 'success', data: { conversations: formatedUserConversations } });
  });

  getUserConversation = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const query = ConversationRepository.findById(id)
      .populate({
        path: 'lastMessage',
        select: 'text createdAt sender',
        populate: {
          path: 'sender',
          select: 'username',
        },
      })
      .populate<{ user1: Document & IUser }>('user1', 'username')
      .populate<{ user2: Document & IUser }>('user2', 'username')
      .select('-__v');

    const userConversation = await query;

    if (!userConversation) return next(new ApiError('Беседы с данным ID не существует'));

    if (!userConversation.user1.equals(req.user) && !userConversation.user2.equals(req.user)) {
      return next(new ApiError('Нет доступа', 400));
    }

    const formatUserConversation = (conversation: any) => {
      let conversationForSend = { ...conversation.toObject() };

      if (conversation.user1.username === req.user.username) {
        conversationForSend.peer = conversation.user2;
        delete conversationForSend.user1;
        delete conversationForSend.user2;
      } else if (conversation.user2.username === req.user.username) {
        conversationForSend.peer = conversation.user1;
        delete conversationForSend.user1;
        delete conversationForSend.user2;
      }

      return conversationForSend;
    };

    const formatedUserConversation = formatUserConversation(userConversation);
    res.status(200).json({ status: 'success', data: { conversation: formatedUserConversation } });
  });
}

const conversationsController = new ConverationsController();

export default conversationsController;
