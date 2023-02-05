import { Router } from 'express';
import { isLogin } from '../middleware/isLogin';
import * as commentsController from '../controller/comments';

const router = Router({ mergeParams: true });

router.use(isLogin);

router.route('/').get(commentsController.getAllComments).post(commentsController.addComment);
router.route('/:commentId').delete(commentsController.deleteComment);

router.route('/:commentId/like').get(commentsController.likeComment);

export default router;
