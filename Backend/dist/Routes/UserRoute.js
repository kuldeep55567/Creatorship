import express from 'express';
import { getAllUsers, registerUser, loginUser, getUserProfile } from '../Controller/User.js';
const userRouter = express.Router();
userRouter.post('/register', registerUser);
userRouter.get('/all', getAllUsers);
userRouter.post('/login', loginUser);
// userRouter.use(VerifyToken);
userRouter.get('/profile', getUserProfile);
export default userRouter;
