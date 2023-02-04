import { Router } from 'express';
import messagesController from '../controller/messages';
import { isLogin } from '../middleware/isLogin';
import { roleCheck } from '../middleware/roleCheck';

const router = Router();

router.use(isLogin);

router.route('/').get(messagesController.getMessagesFromConversation).post(messagesController.sendMessageToUser);

router.use(roleCheck('ADMIN'));

router.route('/admin').get(messagesController.getAll).post(messagesController.createOne);

router
  .route('/admin/:id')
  .get(messagesController.getOne)
  .patch(messagesController.updateOne)
  .delete(messagesController.deleteOne);

export default router;
