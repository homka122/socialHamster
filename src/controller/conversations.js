import factoryRoutes from "../utils/factoryRoutes.js"
import ConverationsRepository from '../models/message.js'

class ConverationsController {
  getAll = factoryRoutes.getAll(ConverationsRepository)
  getOne = factoryRoutes.getOne(ConverationsRepository)
}

const conversationsController = new ConverationsController()

export default conversationsController;