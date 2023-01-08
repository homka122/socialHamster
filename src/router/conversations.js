import { Router } from "express";
import conversationsController from "../controller/conversations.js";
import { isLogin } from "../middleware/isLogin.js";
import { roleCheck } from "../middleware/roleCheck.js";

const router = Router()

router.use(isLogin)
router.use(roleCheck('ADMIN'))

router.route('/')
  .get(conversationsController.getAll)
  .post(conversationsController.createOne)

router.route('/:id')
  .get(conversationsController.getOne)
  .patch(conversationsController.updateOne)
  .delete(conversationsController.deleteOne)

export default router