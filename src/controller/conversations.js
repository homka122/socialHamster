import factoryRoutes from "../utils/factoryRoutes.js"
import ConversationRepository from "../models/conversation.js"
import { catchAsync } from "../utils/catchAsync.js"
import { websocketEmitter } from "../websocketApp.js"

class ConverationsController {
  getAll = factoryRoutes.getAll(ConversationRepository)
  getOne = factoryRoutes.getOne(ConversationRepository)
  createOne = factoryRoutes.createOne(ConversationRepository)
  updateOne = factoryRoutes.updateOne(ConversationRepository)
  deleteOne = factoryRoutes.deleteOne(ConversationRepository)

  getUserConversations = catchAsync(async (req, res, next) => {
    const query = ConversationRepository
      .find({ $or: [{ user1: req.user._id }, { user2: req.user._id }] })
      .populate({
        path: 'lastMessage',
        select: 'text createdAt sender',
        populate: {
          path: 'sender',
          select: 'username'
        }
      })
      .populate('user1', 'username')
      .populate('user2', 'username')
      .select('-__v')
      .sort('-lastMessage.createdAt')

    const userConversations = await query

    // Define "peer" field
    const formatedUserConversations = userConversations.map(conversation => {
      let conversationForSend = { ...conversation.toObject() }

      if (conversation.user1.username === req.user.username) {
        conversationForSend.peer = conversation.user2;
        delete conversationForSend.user1;
        delete conversationForSend.user2;
      } else if (conversation.user2.username === req.user.username) {
        conversationForSend.peer = conversation.user1;
        delete conversationForSend.user1;
        delete conversationForSend.user2;
      }

      return conversationForSend
    })

    res.status(200).json({ status: 'success', data: { conversations: formatedUserConversations } })
    websocketEmitter.emit('fromServer', { message: 'test' })
  })
}

const conversationsController = new ConverationsController()

export default conversationsController;