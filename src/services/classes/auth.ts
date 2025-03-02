import crypto from 'crypto';
import { ILogin, ISignup, LoginData, SignupData } from '../../types/auth';
import { ResultFunction, signJwt } from '../../helpers/utils';
import { ReturnStatus } from '../../types/generic';
import { comparePassword, hashPassword } from '../../helpers/hash';
import User from '../../models/user';
import { loginValidator, signupValidator } from '../../validators/auth';
import prisma from '../../helpers/prisma';

class Auth {
	public async login(input: ILogin) {
		try {
			const { email, password } = input;
			// validation
			const user = await prisma.user.findUnique({
				where: {
					email: email,
				},
				select: {
					id: true,
					name: true,
					email: true,
					password: true,
				},
			});
			if (user) {
				// console.log(user.password.length);

				const passwordMatch = comparePassword(user.password, password);
				if (!passwordMatch) {
					return ResultFunction(
						false,
						'invalid email or password',
						400,
						ReturnStatus.BAD_REQUEST,
						null
					);
				}
				const jwtToken = signJwt(user);
				if (!jwtToken) {
					return ResultFunction(
						false,
						'server error',
						500,
						ReturnStatus.NOT_OK,
						null
					);
				}
				const data: LoginData = {
					token: jwtToken,
					user: {
						email,
						name: user.name,
					},
				};
				return ResultFunction(
					true,
					'login successful',
					200,
					ReturnStatus.OK,
					data
				);
			} else {
				return ResultFunction(
					false,
					'user does not exist',
					400,
					ReturnStatus.BAD_REQUEST,
					null
				);
			}

			// check db

			// generate access token
			// maybe use jwt???
		} catch (error: any) {
			console.error(error);
			return ResultFunction(
				false,
				'something went wrong',
				422,
				ReturnStatus.NOT_OK,
				null
			);
		}
	}

	public async signup(input: ISignup) {
		try {
			const { name, email, password } = input;
			// console.log('req reaches here');

			const data: SignupData = {
				user: {
					name,
					email,
					password,
				},
			};

			// abstract into function
			const targetUser = await prisma.user.findUnique({
				where: {
					email: email,
				},
			});
			if (targetUser) {
				return ResultFunction(
					false,
					'user exists already',
					400,
					ReturnStatus.BAD_REQUEST,
					null
				);
			} else {
				try {
					const hashedPassword = await hashPassword(data.user.password)
					if (hashedPassword) {
						data.user.password = hashedPassword
					} else {


						return ResultFunction(
							false,
							'Something went wrong',
							500,
							ReturnStatus.NOT_OK,
							null
						)
					}

					const user = await prisma.user.create({
						data: {
							name: name,
							email: email,
							password: hashedPassword,
						},
					});
					// console.log(newUser);

					const { password, ...other } = user;
					// console.log(other);
					// console.log(password);

					// data.user = other
					return ResultFunction(
						true,
						'signup successful',
						200,
						ReturnStatus.OK,
						other
					);
				} catch (error) {
					console.log(error);

					return ResultFunction(
						false,
						'sigunp failed',
						400,
						ReturnStatus.UNAUTHORIZED,
						null
					);
				}
			}
		} catch (error: any) {
			console.log(error);
			// console.log('here');

			return ResultFunction(
				false,
				'something went wrong',
				422,
				ReturnStatus.NOT_OK,
				null
			);
		}
	}
}

export default Auth;
