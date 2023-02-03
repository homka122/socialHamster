import factoryRoutes from '../utils/factoryRoutes.js';
import UserRepository from '../models/user.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiError } from '../utils/ApiError.js';
import { __dirname } from '../utils/__dirname.js';
import { NextFunction, Request, Response } from 'express';

class UsersController {
  getAll = factoryRoutes.getAll(UserRepository);
  getOne = factoryRoutes.getOne(UserRepository);
  createOne = factoryRoutes.createOne(UserRepository);
  updateOne = factoryRoutes.updateOne(UserRepository);
  deleteOne = factoryRoutes.deleteOne(UserRepository);

  getUserInfo = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await UserRepository.findById(id).select('username');

    if (!user) {
      return next(new ApiError('Пользователя с таким ID нет.'));
    }

    res.status(200).json({ status: 'success', data: { user } });
  });

  updatePhoto = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return next(new ApiError('Нет приложенного файла'));

    await UserRepository.findByIdAndUpdate(req.user._id, { profilePhoto: req.file.filename });
    res.status(200).send({ status: 'success' });
  });
}

const usersController = new UsersController();

export default usersController;
