import { Router } from "express";
import authController from "../controller/auth.js";

const router = Router()

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.get('/refresh', authController.refresh)

export default router