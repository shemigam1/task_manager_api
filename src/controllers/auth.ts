import { NextFunction, Request, Response } from 'express';
import { ISignup, ILogin } from '../types/auth';
import { authFactory } from '../services/factories';

export const signupController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const input: ISignup = {
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
	};
	const response = await authFactory().signup(input);
	return res.status(response.code).json(response);
};
export const loginController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// console.log('entered controller');
	const input: ILogin = {
		email: req.body.email,
		password: req.body.password,
	};
	const response = await authFactory().login(input);
	return res.status(response.code).json(response);
};

