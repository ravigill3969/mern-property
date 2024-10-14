import { searchListing } from "../controllers/listingSearch";
import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", searchListing);

export default router;
