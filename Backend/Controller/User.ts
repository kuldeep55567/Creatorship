import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { generateToken } from '../Utils';
import { UserModel, IUser } from '../Model/UserModel';

dotenv.config();

// Extend the Request type to include the user property
interface AuthRequest extends Request {
    user?: IUser;
}

// Get all users
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await UserModel.find().select('-password');
    res.json(users);
});

// Register a new user
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, userType } = req.body;
    try {
        const userExists = await UserModel.findOne({ email });
        if (userExists) res.status(400).json({ id: 0, message: 'User already exists' });

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
    } catch (error: any) {
        res.status(400).json({ id: 0, message: error.message });
    }

});

// User login
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) res.status(400).json({ id: 0, message: 'User not found' });
        if (user && (await bcrypt.compare(password, user.password))) {
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
    } catch (error: any) {
        res.status(400).json({ id: 0, message: error.message });
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
        res.status(401);
        throw new Error('Not authorized');
      }
  
      const user = await UserModel.findById(req.user.id);
  
      if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
  
        if (req.body.password) {
          user.password = await bcrypt.hash(req.body.password, 10);
        }
  
        // Update other fields as necessary
  
        const updatedUser = await user.save();
  
        res.status(200).json({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          userType: updatedUser.userType,
          token: generateToken(updatedUser._id),
        });
      } else {
        res.status(404).json({ id:0,message: 'User not found' });
      }
    } catch (error:any) {
        res.status(500).json({ id:0,message: error.message });
      }
  });