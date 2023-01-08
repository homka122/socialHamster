import factoryRoutes from "../utils/factoryRoutes.js"
import ConverationsRepository from '../models/conversation.js'

class ConverationsController {
  getAll = factoryRoutes.getAll(ConverationsRepository)
  getOne = factoryRoutes.getOne(ConverationsRepository)
  createOne = factoryRoutes.createOne(ConverationsRepository)
  updateOne = factoryRoutes.updateOne(ConverationsRepository)
  deleteOne = factoryRoutes.deleteOne(ConverationsRepository)

  getUserConversations = async (req, res, next) => {
    const userConversations = await ConverationsRepository.find({ $or: [{ user1: req.user._id }, { user2: req.user._id }] }).populate('lastMessage', 'text createdAt')
    res.status(200).json({ status: 'success', data: userConversations })
  }
}

const conversationsController = new ConverationsController()

export default conversationsController;