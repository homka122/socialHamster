import factoryRoutes from '../utils/factoryRoutes.js';
import UserRepository from '../models/user.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiError } from '../utils/ApiError.js';
import { __dirname } from '../utils/__dirname.js';

class UsersController {
  getAll = factoryRoutes.getAll(UserRepository);
  getOne = factoryRoutes.getOne(UserRepository);
  createOne = factoryRoutes.createOne(UserRepository);
  updateOne = factoryRoutes.updateOne(UserRepository);
  deleteOne = factoryRoutes.deleteOne(UserRepository);

  getUserInfo = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await UserRepository.findById(id).select('username');

    if (!user) {
      return next(new ApiError('Пользователя с таким ID нет.'));
    }

    res.status(200).json({ status: 'success', data: { user } });
  });

  updatePhoto = catchAsync(async (req, res, next) => {
    await UserRepository.findByIdAndUpdate(req.user._id, { profilePhoto: req.file.filename });
    res.status(200).send({ status: 'success' });
  });

  getPhoto = catchAsync(async (req, res, next) => {
    let { username } = req.query;
    username = username || req.user.username;
    const user = await UserRepository.findOne({ username });

    if (!user) {
      return next(new ApiError('Пользователя с таким именем не существует', 400));
    }

    const filename = user.profilePhoto;
    if (!filename) {
      return next(new ApiError('У пользователя нет фото профиля', 400));
    }

    res.status(200).sendFile(__dirname + '/public/avatars/' + username + '-avatar.jpg');
  });
}

const usersController = new UsersController();

export default usersController;
