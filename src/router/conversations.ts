import { Router } from 'express';
import conversationsController from '../controller/conversations';
import { isLogin } from '../middleware/isLogin';

const router = Router();

router.use(isLogin);

router.route('/').get(conversationsController.getUserConversations);
router.route('/:id').get(conversationsController.getUserConversation);

export default router;
