import { catchAsync } from '../utils/catchAsync.js';
import PostRepository from '../models/post.js';
import UserRepository from '../models/user.js';
import mongoose from 'mongoose';

class PostsController {
  createPost = catchAsync(async (req, res, next) => {
    const { text } = req.body;
    const post = await PostRepository.create({ text, author: req.user._id });
    let formattedPost = (await post.populate('author', 'username')).toJSON();
    formattedPost.isLiked = false;
    formattedPost.likesCount = 0;
    formattedPost.commentsCount = 0;

    res.status(200).json({ status: 'success', data: { post: formattedPost } });
  });

  getAllPosts = catchAsync(async (req, res, next) => {
    const { userId } = req.query;
    const aggregate = [
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'post',
          as: 'likes',
        },
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'post',
          as: 'comments',
        },
      },
      {
        $addFields: {
          likesCount: {
            $size: '$likes',
          },
          commentsCount: {
            $size: '$comments',
          },
          likeIDs: {
            $map: {
              input: '$likes',
              as: 'likeObj',
              in: '$$likeObj.user',
            },
          },
        },
      },
      {
        $addFields: {
          isLiked: {
            $cond: {
              if: {
                $in: [req.user._id, '$likeIDs'],
              },
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
      {
        $sort: {
          createdAt: -1,
        },
      },
    ];

    if (userId) {
      aggregate.unshift({ $match: { author: mongoose.Types.ObjectId(userId) } });
    }

    const posts = await PostRepository.aggregate(aggregate);
    await UserRepository.populate(posts, { path: 'author', select: 'username' });

    res.status(200).json({ status: 'success', data: { posts } });
  });
}

const postsController = new PostsController();

export default postsController;
