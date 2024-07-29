import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();
// Define Zod schema for environment variables
const EnvSchema = z.object({
    SECRET_AUTH: z.string().min(10)
});
// Validate environment variables
const env = EnvSchema.parse(process.env);
// Define Zod schema for JWT payload
const JwtPayloadSchema = z.object({
    userID: z.string()
});
// Define Zod schema for the Authorization header
const AuthHeaderSchema = z.string().regex(/^Bearer /);
const VerifyToken = (req, res, next) => {
    try {
        // Validate the Authorization header
        const authHeader = AuthHeaderSchema.parse(req.headers.authorization);
        // Extract the token
        const token = authHeader.split(' ')[1];
        // Verify and decode the token
        const decoded = jwt.verify(token, env.SECRET_AUTH);
        // Validate the decoded payload
        const { userID } = JwtPayloadSchema.parse(decoded);
        // Add userID to the request body
        req.body.userID = userID;
        next();
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            // Handle Zod validation errors
            res.status(400).json({ message: "Invalid token format", errors: error.errors });
        }
        else {
            // Handle other errors (including jwt.JsonWebTokenError)
            res.status(401).json({ message: "Please login first" });
        }
    }
};
export default VerifyToken;
