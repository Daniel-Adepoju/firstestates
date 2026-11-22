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

    pinnedBy: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],

    hiddenFor: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],
  },
  {
    timestamps: true, 
  }
)

conversationSchema.index({ userIds: 1 })
conversationSchema.index({ userIds: 1, hiddenFor: 1, updatedAt: -1 })
conversationSchema.index({ userIds: 1, pinnedBy: 1 })

 const Conversation = models?.Conversation || model("Conversation", conversationSchema)
 export default Conversation
