import { Router } from "express";
import messagesController from "../controller/messages.js";

const router = Router()

router.route('/').get(messagesController.getAll)
router.route('/:id').get(messagesController.getOne)

export default router