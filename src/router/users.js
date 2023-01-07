import { Router } from "express";
import usersController from "../controller/users.js";
import { isLogin } from "../middleware/isLogin.js";
import { roleCheck } from "../middleware/roleCheck.js";

const router = Router()

router.use(isLogin, roleCheck('ADMIN'))

router.route('/').get(usersController.getAll)
router.route('/:id').get(usersController.getOne)

export default router