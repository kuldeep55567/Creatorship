// Zod schemas for input validation
import { UserSchema } from "../Model/UserModel.js";
export const RegisterUserSchema = UserSchema.pick({
    name: true,
    email: true,
    password: true,
    userType: true
});
