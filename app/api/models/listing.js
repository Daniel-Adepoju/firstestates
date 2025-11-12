import { Schema, model, models } from "mongoose";
import User from "./user";

const ListingSchema = new Schema(
  {
    agent: {
      type: Schema.Types.ObjectId,
      ref: User.modelName,
      required: [true, "Agent is required"],
    },

    school: {
      type: String,
      required: [true, "School is required"],
    },
    mainImage: {
      type: String,
      required: [true, "Main image is required"],
    },
    gallery: {
      type: [String],
      required: [true, "Gallery images are required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    amenities: {
      type: [String],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    favorites: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    bedrooms: {
      type: Number,
      required: [true, "Number of bedrooms is required"],
    },
    bathrooms: {
      type: Number,
      required: [true, "Number of bathrooms is required"],
    },
    toilets: {
      type: Number,
      required: [true, "Number of toilets is required"],
    },
    status: {
      type: String,
      enum: ["available", "rented"],
      default: "available",
    },
    listingTier: {
      type: String,
      enum: ["standard", "gold", "first"],
      default: "standard",
    },
    validUntil: {
      type: Date,
      required: [true, "Valid until date is required"],
    },
    totalViews: {
      type: Number,
      default: 0,
    },
    weeklyViews: {
      type: Number,
      default: 0,
    },
    reportedBy: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true }
);

// Text index for search
ListingSchema.index(
  {
    school: "text",
    location: "text",
    "agent.username": "text",
  },
  {
    weights: {
      school: 5,
      location: 4,
      "agent.username": 3,
    },
    name: "TextIndex_School_Location_Agent",
  }
);

// Delete listings 1 day (86400s) after validUntil
ListingSchema.index({ validUntil: 1 }, { expireAfterSeconds: 86400 });

const Listing = models?.Listing || model("Listing", ListingSchema);

export default Listing;
