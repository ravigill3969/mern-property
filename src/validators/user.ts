import { NextFunction, Response, Request } from "express";
import { body, validationResult } from "express-validator";

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors);
    return;
  }
  next();
};

export const registerValidation = [
  body("username")
    .isLength({ min: 4 })
    .withMessage("username must be at least 4 characters long.")
    .isString()
    .withMessage("username should be a string"),
  body("email").isEmail().withMessage("please provide a valid email"),
  body("password")
    .isLength({ min: 4 })
    .withMessage(
      "password is required and should be at least 4 charaters long."
    ),
  validate,
];
export const loginValidation = [
  body("email").isEmail().withMessage("please provide a valid email"),
  body("password").isLength({ min: 1 }).withMessage("password is required"),
  validate,
];

export default validate;
