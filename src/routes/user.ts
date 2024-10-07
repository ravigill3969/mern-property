import express, { Request, Response } from "express";
import validate, {
  registerValidation,
  loginValidation,
} from "../validators/user";
import { login, logout, register } from "../controllers/user";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.get(
  "/validate-token",
  verifyToken,
  async (req: Request, res: Response) => {
    res.status(200).json({ userId: req.userId });
  }
);

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/logout", logout);

export default router;
