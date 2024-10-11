import { ObjectId } from "mongoose";

// Define the type for a single listing response
export interface ListingResponse {
  _id:ObjectId;
  userId: ObjectId; // userId is stored as an ObjectId in MongoDB
  fullname: string;
  email: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  propertyType:
    | "Apartment"
    | "House"
    | "Condominium"
    | "Commercial Property"
    | "Land"
    | "Office Space";
  rentOrSale: "rent" | "sale";
  monthlyRent?: string;
  securityDeposit?: string;
  leaseTerms?: string;
  moveInDate?: string;
  propertySize: string;
  numberOfBedrooms: string;
  numberOfBathrooms: string;
  furnishedStatus: string;
  parkingAvailability?: boolean;
  utilitiesIncluded?: boolean;
  petPolicy: string;
  nearbyFacilities: string[];
  askingPrice?: string;
  hoaFees?: string;
  propertyTaxes?: string;
  legalClearances?: string;
  mortgageAssistance?: boolean;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type ListingsResponse = ListingResponse[];
