import { catchAsync } from '../utils/catchAsync';
import PostRepository, { IPost } from '../models/post';
import UserRepository, { IUser } from '../models/user';
import mongoose, { PipelineStage } from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';

class PostsController {
  createPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { text } = req.body;
    const post = await PostRepository.create({ text, author: req.user });

    let formattedPost: IPost & { isLiked: boolean; likesCount: number; commentsCount: number };
    formattedPost = (await post.populate('author', 'username')).toJSON();
    formattedPost.isLiked = false;
    formattedPost.likesCount = 0;
    formattedPost.commentsCount = 0;

    res.status(200).json({ status: 'success', data: { post: formattedPost } });
  });

  getAllPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.query.userId;
    const count = Number(req.query.count) || 20;
    const offset = Number(req.query.offset) || 0;

    if (count < 0 || offset < 0) {
      return next(new ApiError('Bad request'));
    }

    const aggregate: PipelineStage[] = [
      { $sort: { createdAt: -1 } },
      { $limit: count },
      { $skip: offset },
      { $lookup: { from: 'likes', localField: '_id', foreignField: 'post', as: 'likes' } },
      { $lookup: { from: 'comments', localField: '_id', foreignField: 'post', as: 'comments' } },
      {
        $addFields: {
          likesCount: { $size: '$likes' },
          commentsCount: { $size: '$comments' },
          likeIDs: { $map: { input: '$likes', as: 'likeObj', in: '$$likeObj.user' } },
        },
      },
      {
        $addFields: {
          isLiked: {
            $cond: {
              if: { $in: [req.user._id, '$likeIDs'] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          likes: 0,
          comments: 0,
          likeIDs: 0,
          __v: 0,
        },
      },
    ];

    if (userId) {
      aggregate.unshift({ $match: { author: new mongoose.Types.ObjectId(String(userId)) } });
    }

    const posts = await PostRepository.aggregate(aggregate);
    await UserRepository.populate(posts, { path: 'author', select: 'username' });

    res.status(200).json({ status: 'success', data: { posts } });
  });

  deletePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;

    const post = await PostRepository.findById(postId);
    if (!post) return next(new ApiError('Поста с данным ID нет.'));

    if (!post.author.equals(req.user._id)) {
      return next(new ApiError('Нет доступа'));
    }

    await post.delete();
    res.status(204).json({ status: 'success' });
  });
}

const postsController = new PostsController();

export default postsController;
