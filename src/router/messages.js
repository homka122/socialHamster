import { Router } from "express";
import messagesController from "../controller/messages.js";
import { isLogin } from "../middleware/isLogin.js";

const router = Router()

router.use(isLogin)

router.route('/').get(messagesController.getAll)
router.route('/:id').get(messagesController.getOne)

export default router