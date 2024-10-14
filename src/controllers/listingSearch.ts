import Listing, { IListing } from "../models/listing";
import catchAsync from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";

export const searchListing = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      parking: parkingAvailability,
      utilities: utilitiesIncluded,
      sortOption = "lastUpdated",
      typeOfProperty = "Apartment",
      type = "rent",
      page = "1",
      rentPrice = "0",
      salePrice = "0",
    } = req.query;

    // Parse and validate query parameters
    const parsedPage = parseInt(page as string);
    const parsedRentPrice = parseInt(rentPrice as string);
    const parsedSalePrice = parseInt(salePrice as string);

    if (isNaN(parsedPage) || parsedPage < 1) {
      return res.status(400).json({ error: "Invalid page number" });
    }

    if (isNaN(parsedRentPrice) || parsedRentPrice < 0) {
      return res.status(400).json({ error: "Invalid rent price" });
    }

    if (isNaN(parsedSalePrice) || parsedSalePrice < 0) {
      return res.status(400).json({ error: "Invalid sale price" });
    }

    // Build query object
    const query: any = {
      rentOrSale: type as IListing["rentOrSale"],
      propertyType: typeOfProperty as IListing["propertyType"],
      ...(parkingAvailability !== undefined && {
        parkingAvailability: parkingAvailability === "true",
      }),
      ...(utilitiesIncluded !== undefined && {
        utilitiesIncluded: utilitiesIncluded === "true",
      }),
    };

    // Handling rent-specific queries
    if (type === "sale") {
      query.askingPrice = { $lte: parsedSalePrice.toString() };
    }

    // Define sort options
    const sortOptions: { [key: string]: any } = {
      lastUpdated: { updatedAt: -1 },
      priceLowToHigh: type === "rent" ? { monthlyRent: 1 } : { askingPrice: 1 },
      priceHighToLow:
        type === "rent" ? { monthlyRent: -1 } : { askingPrice: -1 },
    };
    console.log(query);

    try {
      // Perform database query
      const results = await Listing.find(query)
        .sort(sortOptions[sortOption as string] || sortOptions.lastUpdated)
        .skip((parsedPage - 1) * 10)
        .limit(10);


      const totalCount = await Listing.countDocuments(query);

      res.status(200).json({
        results,
        totalCount,
        currentPage: parsedPage,
        totalPages: Math.ceil(totalCount / 10),
      });
    } catch (error) {
      console.error("Database query error:", error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching listings" });
    }
  }
);
