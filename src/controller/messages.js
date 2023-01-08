import factoryRoutes from "../utils/factoryRoutes.js"
import MessageRepository from '../models/message.js'
import ConversationRepository from "../models/conversation.js"
import UserRepository from "../models/user.js"

class MessagesController {
  getAll = factoryRoutes.getAll(MessageRepository)
  getOne = factoryRoutes.getOne(MessageRepository)
  createOne = factoryRoutes.createOne(MessageRepository)
  updateOne = factoryRoutes.updateOne(MessageRepository)
  deleteOne = factoryRoutes.deleteOne(MessageRepository)

  isUserHaveAccessToConverastion = async (user, conversation) => {
    if (!conversation) {
      return false
    }

    if (!conversation.user1.equals(user._id) && !conversation.user2.equals(user._id)) {
      return false
    }

    return true;
  }

  getUserMessagesFromConversation = async (req, res, next) => {
    const { id } = req.params
    const count = req.query.count || 200;
    const offset = req.query.offset || 0

    const conversation = await ConversationRepository.findById(id)

    if (!this.isUserHaveAccessToConverastion(req.user, conversation)) {
      return next(new Error('Нет доступа к данной переписке или её не существует'))
    }

    const messages = await MessageRepository.find({ conversation: conversation._id }).sort('-createdAt').limit(count).skip(offset)
    res.status(200).json({ status: 'success', data: messages })
  }

  sendMessageToUser = async (req, res, next) => {
    const { text, username } = req.body

    const userThatGet = await UserRepository.findOne({ username })
    if (!userThatGet) {
      return next(new Error('Пользователя с таким именем нет'))
    }

    let conversation;

    const conversationCandidate = await ConversationRepository.findOne({ $or: [{ user1: req.user._id, user2: userThatGet._id }, { user1: userThatGet._id, user2: req.user._id }] })
    if (!conversationCandidate) {
      conversation = await ConversationRepository.create({ user1: req.user, user2: userThatGet })
    } else {
      conversation = conversationCandidate
    }

    const message = await MessageRepository.create({ sender: req.user._id, text, conversation })
    res.status(201).json({ status: 'success', data: { message: message.text } })
  }
}

const messagesController = new MessagesController()

export default messagesController;