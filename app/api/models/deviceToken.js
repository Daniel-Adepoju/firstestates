import { Schema, model, models } from "mongoose"
import User from "./user"

const DeviceTokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: User.modelName, required: true },
  token: { type: String, required: true, unique: true, trim: true },
  platform: { type: String, enum: ["web", "android", "ios"], default: "web" },
  lastSeenAt: { type: Date, default: Date.now },
}, { timestamps: true })

DeviceTokenSchema.index({ user: 1, token: 1 }, { unique: true })
const DeviceToken = models?.DeviceToken || model("DeviceToken", DeviceTokenSchema)
export default DeviceToken
