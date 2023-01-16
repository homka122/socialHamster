import { Router } from "express";
import authController from "../controller/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router()

router.post('/signup', validate.inputUser, authController.signup)
router.post('/login', validate.inputUser, authController.login)
router.get('/refresh', authController.refresh)

export default router