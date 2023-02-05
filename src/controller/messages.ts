import factoryRoutes from '../utils/factoryRoutes';
import MessageRepository from '../models/message';
import ConversationRepository, { IConversation } from '../models/conversation';
import UserRepository, { IUser } from '../models/user';
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../utils/ApiError';
import { websocketEmitter, WS_EVENTS } from '../websocketApp';
import { NextFunction, Request, Response } from 'express';
import * as messagesService from '../service/messages';

class MessagesController {
  getAll = factoryRoutes.getAll(MessageRepository);
  getOne = factoryRoutes.getOne(MessageRepository);
  createOne = factoryRoutes.createOne(MessageRepository);
  updateOne = factoryRoutes.updateOne(MessageRepository);
  deleteOne = factoryRoutes.deleteOne(MessageRepository);

  isUserHaveAccessToConverastion = (user: IUser, conversation: IConversation): boolean => {
    if (conversation.user1.equals(user._id) || conversation.user2.equals(user._id)) {
      return true;
    }

    return false;
  };

  getMessagesFromConversation = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const count = Number(req.query.count) || 200;
    const offset = Number(req.query.offset) || 0;
    const { id } = req.query;

    if (!id) {
      return next(new ApiError('Для получения сообщений необходимо указать ID беседы.', 400));
    }

    const conversation = await ConversationRepository.findById(id);

    if (!conversation) {
      return next(new ApiError('Беседы с таким ID не существует'));
    }

    if (!this.isUserHaveAccessToConverastion(req.user, conversation)) {
      return next(new ApiError('Нет доступа к данной переписке или её не существует', 400));
    }

    const messages = await MessageRepository.find({ conversation: conversation._id })
      .sort('createdAt')
      .select('-__v')
      .limit(count)
      .skip(offset);

    res.status(200).json({ status: 'success', data: { messages } });
  });

  sendMessageToUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { text, username } = req.body;

    const receiver = await UserRepository.findOne({ usernameLowerCase: username.toLowerCase() });
    if (!receiver) {
      return next(new ApiError('Пользователя с таким именем нет'));
    }

    const conversation = await messagesService.getConversation(req.user, receiver);

    const message = await MessageRepository.create({ sender: req.user._id, text, conversation: conversation._id });
    websocketEmitter.emit(WS_EVENTS.fromServer, {
      event: WS_EVENTS.newMessage,
      sender: req.user,
      reciever: receiver,
      message,
    });
    res.status(201).json({ status: 'success', data: { message } });
  });
}

const messagesController = new MessagesController();

export default messagesController;
