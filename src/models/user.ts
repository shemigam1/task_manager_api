import mongoose, { Schema } from "mongoose";
import { ISignup } from "../types/auth";
import { comparePassword, hashPassword } from "../helpers/hash";

const UserSchema: Schema = new Schema<ISignup>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
})

UserSchema.pre('save', async function (next) {
    const user = this;
    const hash = await hashPassword(this.password)
    this.password = hash

    next()
})

UserSchema.methods.isValidPassword = async function (password: string) {
    const user = this;
    return comparePassword(password, user.password)
}

const User = mongoose.model<ISignup>('User', UserSchema)
export default User