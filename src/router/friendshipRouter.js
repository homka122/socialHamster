import { Router } from "express";
import { isLogin } from "../middleware/isLogin.js";
import * as friendshipController from '../controller/friendshipController.js'

const router = Router()

router.use(isLogin)

router.route('/')
  .get(friendshipController.getMyFriendsAndSubscribers)
  .post(friendshipController.sendFriendRequest)

export default router