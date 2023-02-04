import { NextFunction, Request, Response } from 'express';
import LikeRepository from '../models/like';
import PostRepository from '../models/post';
import { ApiError } from '../utils/ApiError';
import { catchAsync } from '../utils/catchAsync';

export const likePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { postId } = req.body;
  let type;

  const post = await PostRepository.findById(postId);
  if (!post) {
    return next(new ApiError('Такого поста нет'));
  }

  const like = await LikeRepository.findOne({ post: postId, user: req.user._id });
  if (like) {
    await LikeRepository.deleteOne({ _id: like._id });
    type = 'dislike';
  } else {
    await LikeRepository.create({ post: postId, user: req.user._id, status: true });
    type = 'like';
  }

  res.status(200).json({ status: 'success', data: { type } });
});
