import { NextFunction, Request, Response } from "express";
import Listing from "../models/listing";
import catchAsync from "../utils/catchAsync";

import cloudinary from "cloudinary";
import { AppError } from "../utils/error";

export const createListing = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const imageFiles = req.files as Express.Multer.File[];

    const imageUrls = await uploadImage(imageFiles);
    const newListing = new Listing(req.body);
    newListing.userId = req.userId;
    newListing.images = imageUrls;

    await newListing.save();

    res.status(201).json(newListing);
  }
);

export const getMyListings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const listings = await Listing.find({ userId });

    res.status(200).send(listings);
  }
);

export const updateMyListing = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    let listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(new AppError("Listing not found", 404));
    }

    if (req.userId.toString() !== listing.userId.toString()) {
      return next(
        new AppError("You are not allowed to update this listing", 403) // Use 403 for permission issues
      );
    }

    const imageFiles = req.files as Express.Multer.File[];
    const imageUrls = await uploadImage(imageFiles);

    const keptImages = req.body.keptImages || [];

    const updatedImages = [...keptImages, ...imageUrls];

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...req.body,
          images: updatedImages,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedListing);
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

export const getMySingleListing = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(new AppError("No listing found", 401));
    }
    res.status(201).json(listing);
  }
);
