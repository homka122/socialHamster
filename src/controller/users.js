import factoryRoutes from "../utils/factoryRoutes.js"
import UserRepository from '../models/user.js'
import { catchAsync } from "../utils/catchAsync.js"
import { ApiError } from "../utils/ApiError.js"

class UsersController {
  getAll = factoryRoutes.getAll(UserRepository)
  getOne = factoryRoutes.getOne(UserRepository)
  createOne = factoryRoutes.createOne(UserRepository)
  updateOne = factoryRoutes.updateOne(UserRepository)
  deleteOne = factoryRoutes.deleteOne(UserRepository)

  getUserInfo = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const user = await UserRepository.findById(id).select('username')

    if (!user) {
      return next(new ApiError('Пользователя с таким ID нет.'))
    }

    res.status(200).json({ status: 'success', data: { user } })
  })
}

const usersController = new UsersController()

export default usersController;