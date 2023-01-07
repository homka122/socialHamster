import { Router } from "express";
import usersController from "../controller/users.js";

const router = Router()

router.route('/').get(usersController.getAll)
router.route('/:id').get(usersController.getOne)

export default router