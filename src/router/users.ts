import { Router } from 'express';
import usersController from '../controller/users';
import { uploadAvatar } from '../middleware/fileUpload';
import { isLogin } from '../middleware/isLogin';
import { roleCheck } from '../middleware/roleCheck';

const router = Router();

router.use(isLogin);
router.patch('/updatePhoto', uploadAvatar.single('avatar'), usersController.updatePhoto);
router.route('/:id').get(usersController.getUserInfo);

router.use(roleCheck('ADMIN'));
router.route('/').get(usersController.getAll).post(usersController.createOne);
router.route('/:id').get(usersController.getOne).patch(usersController.updateOne).delete(usersController.deleteOne);

export default router;
