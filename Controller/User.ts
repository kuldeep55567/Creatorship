import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { z } from 'zod';
import { generateToken } from '../Utils/index.js';
import { UserModel, IUser, UserSchema } from '../Model/UserModel.js';
import {RegisterUserSchema} from "../Validation/UserValidation.js";

dotenv.config();

// Extend the Request type to include the user property
interface AuthRequest extends Request {
    user?: IUser;
}


const LoginUserSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

const UpdateUserSchema = UserSchema.partial().omit({ isAdmin: true });

// Get all users
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await UserModel.find().select('-password');
    res.json(users);
});

// Register a new user
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { name, email, password, userType } = RegisterUserSchema.parse(req.body);
        
        const userExists = await UserModel.findOne({ email });
        if (userExists) {
            res.status(400).json({ id: 0, message: 'User already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword,
            userType,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ id: 0, message: 'Invalid user data' });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ id: 0, message: error.errors });
        } else {
            res.status(400).json({ id: 0, message: 'An error occurred' });
        }
    }
});

// User login
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { email, password } = LoginUserSchema.parse(req.body);
        
        const user = await UserModel.findOne({ email });
        if (!user) {
            res.status(400).json({ id: 0, message: 'User not found' });
            return;
        }
        
        if (await bcrypt.compare(password, user.password)) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ id: 0, message: 'Invalid email or password' });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ id: 0, message: error.errors });
        } else {
            res.status(400).json({ id: 0, message: 'An error occurred' });
        }
    }
});

// Get user profile
export const getUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userID = req.user?.id;
    try {
        if (!userID) {
            res.status(401).json({ id: 0, message: 'Not authorized' });
            return;
        }
        const user = await UserModel.findById(userID).select('-password');
        if (!user) {
            res.status(404).json({ id: 0, message: 'User not found' });
            return;
        }
        res.status(200).json(user);
    } catch (error: any) {
        res.status(400).json({ id: 0, message: error.message });
    }
});

// Update user profile
export const updateUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ id: 0, message: 'Not authorized' });
            return;
        }

        const updateData = UpdateUserSchema.parse(req.body);

        const user = await UserModel.findById(req.user.id);

        if (user) {
            user.name = updateData.name || user.name;
            user.email = updateData.email || user.email;

            if (updateData.password) {
                user.password = await bcrypt.hash(updateData.password, 10);
            }

            // Update other fields as necessary
            Object.assign(user, updateData);

            const updatedUser = await user.save();

            res.status(200).json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                userType: updatedUser.userType,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ id: 0, message: 'User not found' });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ id: 0, message: error.errors });
        } else {
            res.status(500).json({ id: 0, message: 'An error occurred' });
        }
    }
});