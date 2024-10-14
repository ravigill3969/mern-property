import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import User from "../models/user";
import { AppError } from "../utils/error";
import catchAsync from "../utils/catchAsync";

export const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return next(new AppError("Email already in use", 401));
    }

    const user = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });

    await user.save();
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "24d" }
    );
    res.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "None",
    });
    res.status(201).json({
      userId: user._id,
      message: "User registered successfully",
    });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new AppError("Invalid credentials", 401));
    }

    const isMatch = user.comparePassword(req.body.password);
    if (!isMatch) {
      return next(new AppError("Invalid credentials", 401));
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "24d" }
    );
    res.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "None",
    });
    res.status(201).json({
      userId: user._id,
      message: "Logged in successfully",
    });
  }
);

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Clear the authentication cookie
    res.clearCookie("auth_token", {
      httpOnly: true, // Secure, HTTP-only cookie
      sameSite: "strict", // Protect against CSRF attacks
      secure: process.env.NODE_ENV === "production", // Secure cookies in production
    });

    // Send a success response
    res.status(200).json({
      status: "success",
      message: "Successfully logged out",
    });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
