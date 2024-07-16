import VerifyToken from '../Middleware/Auth';
import express from 'express';
import { getAllUsers, registerUser, loginUser,getUserProfile } from '../Controller/User';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.get('/all', getAllUsers);
// userRouter.use(VerifyToken);
// userRouter.post('/login', loginUser);
userRouter.get('/profile', getUserProfile);

export default userRouter;