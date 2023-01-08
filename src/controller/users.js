import factoryRoutes from "../utils/factoryRoutes.js"
import UserRepository from '../models/user.js'

class UsersController {
  getAll = factoryRoutes.getAll(UserRepository)
  getOne = factoryRoutes.getOne(UserRepository)
  createOne = factoryRoutes.createOne(UserRepository)
  updateOne = factoryRoutes.updateOne(UserRepository)
  deleteOne = factoryRoutes.deleteOne(UserRepository)
}

const usersController = new UsersController()

export default usersController;