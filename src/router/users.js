import { Router } from "express";
import usersController from "../controller/users.js";
import { isLogin } from "../middleware/isLogin.js";

const router = Router()

router.use(isLogin)

router.route('/').get(usersController.getAll)
router.route('/:id').get(usersController.getOne)

export default router