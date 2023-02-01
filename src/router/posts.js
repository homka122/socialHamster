import { Router } from 'express';
import { isLogin } from '../middleware/isLogin.js';
import postsController from '../controller/posts.js';
import commentsRouter from './comments.js';
import { validate } from '../middleware/validate.js';
import { createPostDto } from '../dto/createPostDto.js';

const router = Router();

router.use(isLogin);

router.route('/').get(postsController.getAllPosts).post(validate(createPostDto), postsController.createPost);

router.use('/:postId/comments', commentsRouter);

export default router;
