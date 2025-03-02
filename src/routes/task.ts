import { Router } from 'express';

import { loginController, signupController } from '../controllers/auth';
import joiMiddleware from '../middlewares/joiMiddleware';
// import { loginValidator, signupValidator } from '../validators/auth';
import { getAllTasksController, getTaskController } from '../controllers/task'

const taskRouter = Router();

taskRouter.get('/', getAllTasksController);
taskRouter.get('/:id', getTaskController);

export default taskRouter;
