import factoryRoutes from "../utils/factoryRoutes.js"
import UserRepository from '../models/user.js'
import { catchAsync } from "../utils/catchAsync.js"
import { ApiError } from "../utils/ApiError.js"
import PostRepository from "../models/post.js"

class PostsController {
  getAllUserPosts = catchAsync(async (req, res, next) => {
    const posts = await PostRepository.find({ author: req.user }).sort('-createdAt')

    res.status(200).json({ status: 'success', data: { posts } })
  })

  createPost = catchAsync(async (req, res, next) => {
    const { text } = req.body;
    const post = await PostRepository.create({ text, author: req.user._id })

    res.status(200).json({ status: 'success', data: { post } })
  })
}

const postsController = new PostsController()

export default postsController;