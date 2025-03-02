import { ILogin } from "../types/auth";
import { ISignup } from "../types/auth";
import Joi from "joi";

export const loginValidator = Joi.object<ILogin>({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

export const signupValidator = Joi.object<ISignup>({
    name: Joi.string().alphanum().required().min(3),
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

export const forgotPasswordValidator = Joi.object<ISignup>({
    email: Joi.string().email().required(),
})