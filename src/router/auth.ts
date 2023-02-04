import { Router } from 'express';
import authController from '../controller/auth';
import { userDto } from '../dto/userDto';
import { validate } from '../middleware/validate';

const router = Router();

router.post('/signup', validate(userDto), authController.signup);
router.post('/login', validate(userDto), authController.login);
router.get('/refresh', authController.refresh);

export default router;
