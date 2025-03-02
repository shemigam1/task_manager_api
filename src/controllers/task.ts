import { NextFunction, Request, Response } from 'express';
import { ISignup, ILogin } from '../types/auth';
import { taskFactory } from '../services/factories';

export const getAllTasksController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const response = await taskFactory().getAllTasks();
    return res.status(response.code).json(response);
};
export const getTaskController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // console.log('entered controller');
    const input: ILogin = {
        email: req.body.email,
        password: req.body.password,
    };
    const response = await taskFactory().getAllTasks();
    return res.status(response.code).json(response);
};

