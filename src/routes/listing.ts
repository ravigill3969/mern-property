import express, { NextFunction, Request, Response } from "express";
import { verifyToken } from "../middleware/verifyToken";
import {
  createListing,
  getMyListings,
  getMySingleListing,
  updateMyListing,
} from "../controllers/listing";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

function test(req: Request, res: Response, next: NextFunction) {
  console.log("water");
  try {
    console.log(req.body);
    console.log(req.files);
    res.send("received");
  } catch (error) {
    console.log(error);
  }
  next();
}

const router = express.Router();

router.get("/", verifyToken, getMyListings);
router.get("/:id", getMySingleListing);
router.post("/", verifyToken, upload.array("files", 6), createListing);
router.put("/:id", verifyToken, upload.array("files", 6), updateMyListing);

export default router;
