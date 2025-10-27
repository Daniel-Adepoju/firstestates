import { Schema, model, models } from "mongoose"
import User from "./user"
import Listing from "./listing"

const InhabitantSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: User.modelName,
      required: [true, "User is required"],
    },
    agent: {
   type: Schema.Types.ObjectId,
     ref: User.modelName,
      required: [true, "Agent is required"],
    },
    listing: {
      type: Schema.Types.ObjectId,
      ref: Listing.modelName,
      required: [true, "Listing is required"],
    },
  },
  { timestamps: true }
)

const Inhabitant = models?.Inhabitant || model("Inhabitant", InhabitantSchema)

export default Inhabitant
