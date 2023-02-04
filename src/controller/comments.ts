import { Request, Response, NextFunction } from 'express';
import CommentRepository from '../models/comment';
import { ApiError } from '../utils/ApiError';
import { catchAsync } from '../utils/catchAsync';

export const getAllComments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { postId } = req.params;
  const comments = await CommentRepository.find({ post: postId })
    .populate('user', 'username')
    .populate('likeUsers', 'username')
    .select('-__v')
    .sort('createdAt');

  res.status(200).json({ status: 'success', data: { comments } });
});

export const addComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { postId } = req.params;
  const { text } = req.body;

  const comment = await CommentRepository.create({ post: postId, user: req.user._id, text });
  let formattedComment: any = (await comment.populate('user', 'username')).toJSON();
  formattedComment.likeUsers = [];
  delete formattedComment.__v;

  res.status(200).json({ status: 'success', data: { comment: formattedComment } });
});

export const likeComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { commentId } = req.params;

  const comment = await CommentRepository.findById(commentId);

  if (!comment) return next(new ApiError('Комментария с данным ID нет'));

  let expression;

  const isCommentLikedByUser = comment.likeUsers.includes(req.user._id);
  if (isCommentLikedByUser) {
    expression = { likeUsers: comment.likeUsers.filter((user) => !user.equals(req.user._id)) };
  } else {
    expression = { $push: { likeUsers: req.user._id } };
  }

  const updatedComment = await CommentRepository.findByIdAndUpdate(commentId, expression, { new: true })
    .populate('likeUsers', 'username')
    .populate('user', 'username')
    .select('-__v');

  res.status(200).json({ status: 'success', data: { comment: updatedComment } });
});
