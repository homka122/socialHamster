import factoryRoutes from "../utils/factoryRoutes.js"
import UserRepository from '../models/user.js'

class UsersController {
  getAll = factoryRoutes.getAll(UserRepository)
  getOne = factoryRoutes.getOne(UserRepository)
}

const usersController = new UsersController()

export default usersController;