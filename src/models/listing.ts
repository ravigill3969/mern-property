import mongoose, { Schema, Document, Types } from "mongoose";

// Define the TypeScript interface for a listing
export interface IListing extends Document {
  userId: Types.ObjectId; // userId is stored as an ObjectId in MongoDB
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
}

// Define the Mongoose schema for Listing
const ListingSchema: Schema<IListing> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" }, // Reference to User model
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
    propertyType: {
      type: String,
      required: true,
      enum: [
        "Apartment",
        "House",
        "Condominium",
        "Commercial Property",
        "Land",
        "Office Space",
      ],
    },
    rentOrSale: { type: String, required: true, enum: ["rent", "sale"] },
    monthlyRent: { type: String },
    securityDeposit: { type: String },
    leaseTerms: { type: String },
    moveInDate: { type: String },
    propertySize: { type: String, required: true },
    numberOfBedrooms: { type: String, required: true },
    numberOfBathrooms: { type: String, required: true },
    furnishedStatus: { type: String, required: true },
    parkingAvailability: { type: Boolean },
    utilitiesIncluded: { type: Boolean },
    petPolicy: { type: String },
    nearbyFacilities: { type: [String], required: true },
    askingPrice: { type: String },
    hoaFees: { type: String },
    propertyTaxes: { type: String },
    legalClearances: { type: String },
    mortgageAssistance: { type: Boolean },
    images: { type: [String], required: true, maxlength: 6 },
  },
  {
    timestamps: true, // Add createdAt and updatedAt timestamps
  }
);

// Export the model
const Listing = mongoose.model<IListing>("Listing", ListingSchema);
export default Listing;
