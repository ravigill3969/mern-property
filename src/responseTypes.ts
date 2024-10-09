import { ObjectId } from "mongoose";

// Define the type for a single listing response
export interface ListingResponse {
  _id: ObjectId;                // Listing's ObjectId
  fullname: string;             // Full name of the owner
  email: string;                // Email of the owner
  phoneNumber: string;          // Phone number of the owner
  addressLine1: string;         // Address Line 1
  addressLine2?: string;        // Optional Address Line 2
  city: string;                 // City
  state: string;                // State
  country: string;              // Country
  postalCode: string;           // Postal Code
  propertyType: "Apartment" | "House" | "Condominium" | "Commercial Property" | "Land" | "Office Space";  // Property Type
  rentOrSale: "rent" | "sale";  // Rent or Sale
  monthlyRent?: string;         // Monthly Rent (optional for sale listings)
  securityDeposit?: string;     // Security Deposit
  leaseTerms?: string;          // Lease Terms
  moveInDate?: string;          // Move-in Date
  propertySize: string;         // Size of the property
  numberOfBedrooms: string;     // Number of Bedrooms
  numberOfBathrooms: string;    // Number of Bathrooms
  furnishedStatus: string;      // Furnished Status
  parkingAvailability?: boolean;  // Parking availability (optional)
  utilitiesIncluded?: boolean;  // Utilities included (optional)
  petPolicy: string;            // Pet Policy
  nearbyFacilities: string[];   // List of nearby facilities
  images: string[];             // List of image URLs
  userId: ObjectId;             // Reference to the user's ObjectId
  createdAt: Date;              // Creation timestamp
  updatedAt: Date;              // Last updated timestamp
}

// Define the type for an array of listings
export type ListingsResponse = ListingResponse[];