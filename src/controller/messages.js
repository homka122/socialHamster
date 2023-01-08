import factoryRoutes from "../utils/factoryRoutes.js"
import MessageRepository from '../models/message.js'

class MessagesController {
  getAll = factoryRoutes.getAll(MessageRepository)
  getOne = factoryRoutes.getOne(MessageRepository)
  createOne = factoryRoutes.createOne(MessageRepository)
  updateOne = factoryRoutes.updateOne(MessageRepository)
  deleteOne = factoryRoutes.deleteOne(MessageRepository)
}

const messagesController = new MessagesController()

export default messagesController;