import factoryRoutes from '../utils/factoryRoutes.js';
import MessageRepository from '../models/message.js';
import ConversationRepository from '../models/conversation.js';
import UserRepository from '../models/user.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiError } from '../utils/ApiError.js';
import { websocketEmitter } from '../websocketApp.js';

class MessagesController {
  getAll = factoryRoutes.getAll(MessageRepository);
  getOne = factoryRoutes.getOne(MessageRepository);
  createOne = factoryRoutes.createOne(MessageRepository);
  updateOne = factoryRoutes.updateOne(MessageRepository);
  deleteOne = factoryRoutes.deleteOne(MessageRepository);

  isUserHaveAccessToConverastion = (user, conversation) => {
    if (!conversation) {
      return false;
    }

    if (conversation.user1.equals(user._id) || conversation.user2.equals(user._id)) {
      return true;
    }

    return false;
  };

  getMessagesFromConversation = catchAsync(async (req, res, next) => {
    const { id } = req.query;
    if (!id) {
      return next(new ApiError('Для получения сообщений необходимо указать ID беседы.', 400));
    }

    const count = req.query.count || 200;
    const offset = req.query.offset || 0;

    const conversation = await ConversationRepository.findById(id).populate('user1').populate('user2');

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

  sendMessageToUser = catchAsync(async (req, res, next) => {
    const { text, username } = req.body;

    const receiver = await UserRepository.findOne({ username });
    if (!receiver) {
      return next(new ApiError('Пользователя с таким именем нет'));
    }

    let conversation;

    const conversationCandidate = await ConversationRepository.findOne({
      $or: [
        { user1: req.user._id, user2: receiver._id },
        { user1: receiver._id, user2: req.user._id },
      ],
    });
    if (!conversationCandidate) {
      conversation = await ConversationRepository.create({ user1: req.user, user2: receiver });
    } else {
      conversation = conversationCandidate;
    }

    const message = await MessageRepository.create({ sender: req.user._id, text, conversation: conversation._id });
    websocketEmitter.emit('fromServer', { event: 'sendMessage', sender: req.user, reciever: receiver, message });
    res.status(201).json({ status: 'success', data: { message } });
  });
}

const messagesController = new MessagesController();

export default messagesController;
