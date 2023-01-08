import factoryRoutes from "../utils/factoryRoutes.js"
import ConverationsRepository from '../models/conversation.js'

class ConverationsController {
  getAll = factoryRoutes.getAll(ConverationsRepository)
  getOne = factoryRoutes.getOne(ConverationsRepository)
  createOne = factoryRoutes.createOne(ConverationsRepository)
  updateOne = factoryRoutes.updateOne(ConverationsRepository)
  deleteOne = factoryRoutes.deleteOne(ConverationsRepository)
}

const conversationsController = new ConverationsController()

export default conversationsController;