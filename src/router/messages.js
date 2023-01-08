import { Router } from "express";
import messagesController from "../controller/messages.js";
import { isLogin } from "../middleware/isLogin.js";

const router = Router()

router.use(isLogin)
router.use(roleCheck('ADMIN'))

router.route('/')
  .get(messagesController.getAll)
  .post(messagesController.createOne)

router.route('/:id')
  .get(messagesController.getOne)
  .patch(messagesController.updateOne)
  .delete(messagesController.deleteOne)


export default router