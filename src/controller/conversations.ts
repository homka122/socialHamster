import factoryRoutes from '../utils/factoryRoutes.js';
import ConversationRepository, { IConversation } from '../models/conversation.js';
import { catchAsync } from '../utils/catchAsync.js';
import { websocketEmitter } from '../websocketApp.js';
import { NextFunction, query, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { IMessage } from '../models/message.js';
import { IUser } from '../models/user.js';
import { Document } from 'mongoose';

class ConverationsController {
  getAll = factoryRoutes.getAll(ConversationRepository);
  getOne = factoryRoutes.getOne(ConversationRepository);
  createOne = factoryRoutes.createOne(ConversationRepository);
  updateOne = factoryRoutes.updateOne(ConversationRepository);
  deleteOne = factoryRoutes.deleteOne(ConversationRepository);

  getUserConversations = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = ConversationRepository.find({ $or: [{ user1: req.user._id }, { user2: req.user._id }] })
      .populate({
        path: 'lastMessage',
        select: 'text createdAt sender',
        populate: {
          path: 'sender',
          select: 'username',
        },
      })
      .populate<{ user1: IUser }>('user1', 'username')
      .populate<{ user2: IUser }>('user2', 'username')
      .select('-__v')
      .sort('-lastMessage.createdAt');

    const userConversations = await query;

    // Define "peer" field
    const formatedUserConversations = userConversations.map((conversation) => {
      let conversationForSend: any = { ...conversation.toObject() };

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
