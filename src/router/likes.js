import { Router } from 'express';
import { isLogin } from '../middleware/isLogin.js';
import * as likesController from '../controller/likes.js';

const router = Router();

router.use(isLogin);

router.route('/').post(likesController.likePost);

export default router;
