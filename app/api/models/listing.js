import { Schema, model, models } from "mongoose"
import User from "./user"

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
    listingType: {
      type: String,
      // required: [true, "Listing type is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    priceUnit: {
      type: String,
      enum: ["perPerson", "perRoom", "entireUnit", "perBed"],
      required: true,
    },

    priceDuration: {
      type: String,
      // enum: ["monthly", "semester", "session", "yearly"],
      required: true,
    },
    tags: {
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
    listingTierWeight: {
      type: Number,
      default: 3,
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
    expiringWarningSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

// set priority based on tier
ListingSchema.pre("save", function (next) {
  const weightMap = { first: 1, gold: 2, standard: 3 }
  this.listingTierWeight = weightMap[this.listingTier] || 3
  next()
})

// Validate Price
// ListingSchema.pre("validate", function (next) {
//   if (this.listingType === "Shared Room" && this.priceUnit !== "per_person") {
//     return next(new Error("Shared room price must be per person"))
//   }

//   if (
//     ["Apartment", "House"].includes(this.listingType) &&
//     this.priceUnit !== "entire_unit"
//   ) {
//     return next(new Error("Apartment/House price must be entire unit"))
//   }

//   next()
// })

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
  },
)

const Listing = models?.Listing || model("Listing", ListingSchema)

export default Listing
