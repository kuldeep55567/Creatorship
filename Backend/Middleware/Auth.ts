import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


interface AuthenticatedRequest extends Request {
  body: {
    userID?: string;
  };
}

const VerifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_AUTH!) as { userID: string };
      if (decoded) {
        const userid = decoded.userID;
        req.body.userID = userid;
        next();
      } else {
        res.status(401).send({ "mssg": "Please login first" });
      }
    } catch (err) {
      res.status(401).send({ "mssg": "Please login first" });
    }
  } else {
    res.status(401).send({ "mssg": "Please login first" });
  }
};

export default  VerifyToken;
