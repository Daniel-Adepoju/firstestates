import mongoose, { Schema, model, models } from "mongoose"

const conversationSchema = new Schema(
  {
    userIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    lastMessage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, 
  }
)

conversationSchema.index({ userIds: 1 })

 const Conversation = models?.Conversation || model("Conversation", conversationSchema)
 export default Conversation