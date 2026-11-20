import { Schema, model, models } from "mongoose"
import User from "./user"

const CommunityPostSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 140 },
  content: { type: String, required: true, trim: true, maxlength: 10000 },
  category: { type: String, enum: ["housing", "student-life", "neighborhoods", "general"], default: "general" },
  author: { type: Schema.Types.ObjectId, ref: User.modelName, required: true },
  reportedBy: [{ type: Schema.Types.ObjectId, ref: User.modelName }],
  status: { type: String, enum: ["published", "hidden"], default: "published" },
}, { timestamps: true })

CommunityPostSchema.index({ status: 1, createdAt: -1 })
const CommunityPost = models?.CommunityPost || model("CommunityPost", CommunityPostSchema)
export default CommunityPost
