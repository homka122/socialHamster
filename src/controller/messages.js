import factoryRoutes from "../utils/factoryRoutes.js"
import MessageRepository from '../models/message.js'

class MessagesController {
  getAll = factoryRoutes.getAll(MessageRepository)
  getOne = factoryRoutes.getOne(MessageRepository)
}

const messagesController = new MessagesController()

export default messagesController;