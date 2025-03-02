import { Router } from 'express';

import { loginController, signupController } from '../controllers/auth';
import joiMiddleware from '../middlewares/joiMiddleware';
import { loginValidator, signupValidator } from '../validators/auth';

const authRouter = Router();

authRouter.post('/login', joiMiddleware(loginValidator), loginController);
authRouter.post('/signup', joiMiddleware(signupValidator), signupController);

export default authRouter;
