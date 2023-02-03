import { Router } from "express";
import { isLogin } from "../middleware/isLogin.js";
import * as friendshipController from '../controller/friendshipController.js'

const router = Router()

router.use(isLogin)

router.route('/')
  .get(friendshipController.getAllFriendships)
  .post(friendshipController.sendFriendRequest)

router.route('/:userId')
  .get(friendshipController.getFriendsAndSubscribers)

router.route('/:userId/status')
  .get(friendshipController.getFriendshipStatus)

export default router