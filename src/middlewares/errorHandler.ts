import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { MongoError } from 'mongodb';
import { Error as MongooseError } from 'mongoose';
import { AxiosError } from 'axios';
import Logger from '../services/Logger';
import { ResultFunction } from '../helpers/utils';
import config from '../helpers/config';
import { JsonWebTokenError } from 'jsonwebtoken';
import { ReturnStatus } from '../types/generic';

const errorHandler = (
	err: ErrorRequestHandler | MongoError | AxiosError,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const logger = new Logger().logger;
	let message = 'Oops, something went wrong. Please try again later';
	let errCode = 422;

	console.log('error handler: ', (err as any).message);

	if (err instanceof MongooseError.CastError) {
		//handle mongoose cast error
		message = `Invalid ${err.path}: ${err.value}.`;
		errCode = 400;
	} else if (err instanceof MongooseError.ValidationError) {
		//handle mongoose field validation error
		const errors: string[] = Object.values(err.errors).map(
			(
				error:
					| MongooseError.CastError
					| MongooseError.ValidationError
					| MongooseError.ValidatorError
			) => error.message
		);

		message = `Invalid input data. ${errors.join('. ')}`;
		errCode = 400;
	} else if ((err as MongoError).code === 11000) {
		//handle mongoose duplicate field errors
		const value: string =
			(err as MongoError).errmsg?.match(/(["'])(\\?.)*?\1/)?.[0] || '';

		message = `An account with ${value} already exists! Please use another email`;
		errCode = 400;
	} else if ((err as AxiosError).isAxiosError) {
		//handle axios errors
		if ((err as AxiosError).response)
			message =
				// @ts-ignore
				(err as AxiosError).response?.data.error ||
				// @ts-ignore
				(err as AxiosError).response?.data.message;
		else message = (err as AxiosError).message;

		errCode = (err as AxiosError).response?.status || 500;
	} else if (err instanceof JsonWebTokenError) {
		//handle jwt errors
		// err.message contains the reason for the error (as per what's wrong with the token)
		// but in a more professional setting we return 'invalid or missing token'
		message = err.message;
		errCode = 403;
	} else if (err instanceof Error) {
		//handle multer errors
		message = err.message;
		errCode = 422;
	} else if (
		err instanceof SyntaxError ||
		err instanceof EvalError ||
		err instanceof RangeError ||
		err instanceof ReferenceError ||
		err instanceof TypeError ||
		err instanceof URIError
	) {
		//handle global error types
		message = err.message;
		errCode = 400;
	}

	logger.error(
		`[${req.method} ${req.url}] ${
			//convert other data types to strings to ensure readability in logs
			typeof message === 'string' ? message : JSON.stringify(message)
		}`
	);
	// if (config.nodeEnv !== 'test') console.error(err);

	const response = ResultFunction(
		false,
		message,
		errCode,
		ReturnStatus.NOT_OK,
		null
	);
	res.status(errCode).json(response);
};

export default errorHandler;
