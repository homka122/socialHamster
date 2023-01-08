import { Router } from "express";
import conversationsController from "../controller/conversations.js";
import { isLogin } from "../middleware/isLogin.js";
import { roleCheck } from "../middleware/roleCheck.js";

const router = Router()

router.use(isLogin)

router.route('/')
  .get(conversationsController.getUserConversations)

router.use(roleCheck('ADMIN'))

router.route('/admin')
  .get(conversationsController.getAll)
  .post(conversationsController.createOne)

router.route('/admin/:id')
  .get(conversationsController.getOne)
  .patch(conversationsController.updateOne)
  .delete(conversationsController.deleteOne)

export default router