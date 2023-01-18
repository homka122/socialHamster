import { Router } from "express";
import { isLogin } from "../middleware/isLogin.js";
import postsController from "../controller/posts.js";

const router = Router()

router.use(isLogin)

router.route('/')
  .get(postsController.getAllUserPosts)
  .post(postsController.createPost)

export default router