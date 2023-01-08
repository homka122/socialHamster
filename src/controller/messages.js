import factoryRoutes from "../utils/factoryRoutes.js"
import MessageRepository from '../models/message.js'
import ConversationRepository from "../models/conversation.js"

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

  sendMessageFromConversation = async (req, res, next) => {
    const { id } = req.params

    const conversation = await ConversationRepository.findById(id)

    if (!this.isUserHaveAccessToConverastion(req.user, conversation)) {
      return next(new Error('Нет доступа к данной переписке или её не существует'))
    }

    const { text } = req.body
    const message = await MessageRepository.create({ sender: req.user._id, text, conversation })
    res.status(201).json({ status: 'success', data: { message: message.text } })
  }
}

const messagesController = new MessagesController()

export default messagesController;