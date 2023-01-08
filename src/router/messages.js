import { Router } from "express";
import messagesController from "../controller/messages.js";
import { isLogin } from "../middleware/isLogin.js";
import { roleCheck } from "../middleware/roleCheck.js";

const router = Router()

router.use(isLogin)

router.route('/:id')
  .get(messagesController.getUserMessagesFromConversation)
  .post(messagesController.sendMessageFromConversation)

router.use(roleCheck('ADMIN'))

router.route('/admin')
  .get(messagesController.getAll)
  .post(messagesController.createOne)

router.route('/admin/:id')
  .get(messagesController.getOne)
  .patch(messagesController.updateOne)
  .delete(messagesController.deleteOne)


export default router