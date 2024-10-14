import Listing, { IListing } from "../models/listing";
import catchAsync from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";

type SearchQueryParams = {
  parkingAvailability?: string;
  utilitiesIncluded?: string;
  sortOption?: "lastUpdated" | "priceLowToHigh" | "priceHighToLow";
  typeOfProperty?: IListing["propertyType"];
  type?: IListing["rentOrSale"];
  page?: string;
  rentPrice?: string;
  salePrice?: string;
  destination?: string;
};

type MongoQuery = {
  rentOrSale: IListing["rentOrSale"];
  propertyType: IListing["propertyType"];
  parkingAvailability?: boolean;
  utilitiesIncluded?: boolean;
  monthlyRent?: { $lte: number };
  askingPrice?: { $lte: number };
  $or?: Array<{ city: RegExp } | { state: RegExp } | { country: RegExp }>;
};

export const searchListing = catchAsync(
  async (
    req: Request<{}, {}, {}, SearchQueryParams>,
    res: Response,
    next: NextFunction
  ) => {
    const {
      parkingAvailability,
      utilitiesIncluded,
      sortOption = "lastUpdated",
      typeOfProperty = "Apartment",
      type = "rent",
      page = "1",
      rentPrice = "0",
      salePrice = "0",
      destination,
    } = req.query;

    const parsedPage = Math.max(1, parseInt(page));
    const parsedRentPrice = Math.max(0, parseInt(rentPrice));
    const parsedSalePrice = Math.max(0, parseInt(salePrice));

    if (isNaN(parsedPage)) {
      return res.status(400).json({ error: "Invalid page number" });
    }

    if (isNaN(parsedRentPrice)) {
      return res.status(400).json({ error: "Invalid rent price" });
    }

    if (isNaN(parsedSalePrice)) {
      return res.status(400).json({ error: "Invalid sale price" });
    }

    const query: MongoQuery = {
      rentOrSale: type as IListing["rentOrSale"],
      propertyType: typeOfProperty as IListing["propertyType"],
    };

    // Fix: Correctly handle parkingAvailability
    if (parkingAvailability !== undefined) {
      query.parkingAvailability = parkingAvailability === "true";
    }

    // Fix: Correctly handle utilitiesIncluded
    if (utilitiesIncluded !== undefined) {
      query.utilitiesIncluded = utilitiesIncluded === "true";
    }

    if (type === "rent" && parsedRentPrice > 0) {
      query.monthlyRent = { $lte: parsedRentPrice };
    }

    if (type === "sale" && parsedSalePrice > 0) {
      query.askingPrice = { $lte: parsedSalePrice };
    }

    if (destination) {
      query.$or = [
        { city: new RegExp(destination, "i") },
        { state: new RegExp(destination, "i") },
        { country: new RegExp(destination, "i") },
      ];
    }

    const sortOptions: Record<typeof sortOption, Record<string, 1 | -1>> = {
      lastUpdated: { updatedAt: -1 },
      priceLowToHigh: type === "rent" ? { monthlyRent: 1 } : { askingPrice: 1 },
      priceHighToLow:
        type === "rent" ? { monthlyRent: -1 } : { askingPrice: -1 },
    };

    console.log("Query:", query);

    try {
      const results = await Listing.find(query)
        .sort(sortOptions[sortOption])
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
