import { Router } from 'express';
import usersController from '../controller/users.js';
import { uploadAvatar } from '../middleware/fileUpload.js';
import { isLogin } from '../middleware/isLogin.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = Router();

router.use(isLogin);

router.patch('/updatePhoto', uploadAvatar.single('avatar'), usersController.updatePhoto);
router.get('/getPhoto', usersController.getPhoto);

router.route('/:id').get(usersController.getUserInfo);

router.use(roleCheck('ADMIN'));

router.route('/').get(usersController.getAll).post(usersController.createOne);

router.route('/:id').get(usersController.getOne).patch(usersController.updateOne).delete(usersController.deleteOne);

export default router;
