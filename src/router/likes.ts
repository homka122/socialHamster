import { Router } from 'express';
import { isLogin } from '../middleware/isLogin';
import * as likesController from '../controller/likes';

const router = Router();

router.use(isLogin);

router.route('/').post(likesController.likePost);

export default router;
