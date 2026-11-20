import { Schema, model, models } from "mongoose"
import User from "./user"

const SavedAgentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: User.modelName, required: true },
    agent: { type: Schema.Types.ObjectId, ref: User.modelName, required: true },
  },
  { timestamps: true },
)

SavedAgentSchema.index({ user: 1, agent: 1 }, { unique: true })

const SavedAgent = models?.SavedAgent || model("SavedAgent", SavedAgentSchema)
export default SavedAgent
