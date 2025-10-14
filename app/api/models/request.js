import { Schema, model, models } from "mongoose"
import User from "./user"
import Listing from "./listing"

const RequestSchema = new Schema(
  {
    requester: {
      type: Schema.Types.ObjectId,
      ref: User.modelName,
      required: [true, "Requester is required"],
    },
    listing: {
      type: Schema.Types.ObjectId,
      ref: Listing.modelName,
      required: [true, "Listing is required"],
    },
    requestType: {
      type: String,
      enum: ["roommate", "co-rent"],
      required: [true, "Request type is required"],
    },
    budget: {
      type: Number,
      required: false,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxLength: [600, "Description cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    },
    moveInDate: {
      type: Date,
      required: false,
    },
    expirationDate: {
      type: Date,
      required: false,
    },
    preferredGender: {
      type: String,
      enum: ["male", "female"],
      required: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

RequestSchema.index({ expirationDate: 1 }, { expireAfterSeconds: 0 },{name:"expirationDate_for_rooommate__and_co-rent_requests"})

const Request = models?.Request || model("Request", RequestSchema)
export default Request

