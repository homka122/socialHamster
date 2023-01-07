import { Router } from "express";
import conversationsController from "../controller/conversations.js";

const router = Router()

router.route('/').get(conversationsController.getAll)
router.route('/:id').get(conversationsController.getOne)

export default router