import { Schema, model, models } from "mongoose"
import Conversation from "./conversation"
import Listing from './listing'
const attachmentSchema = new Schema(
  {
    url: String,
    type: {
      type: String,
      enum: ["image", "video", "audio", "file"],
    },
    name: String,
    size: Number,
  },
  { _id: false },
)

const chatSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: Conversation.modelName,
      required: true,
      index: true,
    },

    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    text: {
      type: String,
      default: "",
      trim: true,
    },

    messageType: {
      type: String,
      enum: ["text", "voice"],
      default: "text",
      index: true,
    },

    audio: {
      url: String,
      duration: Number,
      waveform: [Number],
    },

    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      default: null,
      index: true,
    },

    editedAt: {
      type: Date,
      default: null,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    deletedFor: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],

    starredBy: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],

    replyingTo: {
      type: String,
      default: null,
    },
listingId: {
   type: Schema.Types.ObjectId,
   ref:Listing.modelName,
},
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    attachments: [attachmentSchema],
  },
  {
    timestamps: true,
  },
)

chatSchema.index({ conversationId: 1, createdAt: -1 })
chatSchema.index({ conversationId: 1, deletedAt: 1, deletedFor: 1 })
chatSchema.index({ conversationId: 1, starredBy: 1 })

const Chat = models?.Chat || model("Chat", chatSchema)
export default Chat
