import { NextFunction, Request, Response } from "express";
import Listing from "../models/listing";
import catchAsync from "../utils/catchAsync";

import cloudinary from "cloudinary";

export const createListing = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("userID:", req.userId); // Log the form data

    const imageFiles = req.files as Express.Multer.File[];

    const imageUrls = await uploadImage(imageFiles);
    const newListing = new Listing(req.body);
    newListing.userId = req.userId;
    newListing.images = imageUrls;

    await newListing.save();
    console.log(newListing)

    res.status(201).json(newListing);
  }
);

export const getMyListings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    console.log(userId)
    const listings = await Listing.find({userId})

    // console.log(listings)

    res.status(200).send(listings)
  }
);

const uploadImage = async (imageFiles: Express.Multer.File[]) => {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");

    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI);

    return res.url;
  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
};
