import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies["auth_token"];
  // console.log(token)
  if (!token) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.userId = (decoded as JwtPayload).userId;
    const user = await User.findOne((decoded as JwtPayload).userId);
    if (!user) {
     res.status(400).json("User no longer exists!");
     return 
    }
    next();
  } catch (error) {
    // console.log("error verify token", error);
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }
};
