import { Router } from 'express';
import { isLogin } from '../middleware/isLogin';
import postsController from '../controller/posts';
import commentsRouter from './comments';
import { validate } from '../middleware/validate';
import { createPostDto } from '../dto/createPostDto';

const router = Router();

router.use(isLogin);

router.route('/').get(postsController.getAllPosts).post(validate(createPostDto), postsController.createPost);

router.use('/:postId/comments', commentsRouter);

export default router;
