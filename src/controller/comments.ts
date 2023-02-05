import { Request, Response, NextFunction } from 'express';
import CommentRepository from '../models/comment';
import { ApiError } from '../utils/ApiError';
import { catchAsync } from '../utils/catchAsync';

export const getAllComments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { postId } = req.params;
  const count = Number(req.query.count) || 50;
  const offset = Number(req.query.offset) || 0;

  const comments = await CommentRepository.find({ post: postId })
    .sort('createdAt')
    .limit(count)
    .skip(offset)
    .populate('user', 'username')
    .populate('likeUsers', 'username')
    .select('-__v');

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

export const deleteComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const commentId = req.params.postId;

  const comment = await CommentRepository.findById(commentId);
  if (!comment) return next(new ApiError('Комментария с данным ID нет.'));

  if (!comment.user.equals(req.user._id)) {
    return next(new ApiError('Нет доступа'));
  }

  await comment.delete();
  res.status(204).json({ status: 'success' });
});
