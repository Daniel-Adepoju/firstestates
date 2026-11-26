import { connectToDB } from "@utils/database"
import { NextRequest, NextResponse } from "next/server"
import Chat from "@models/chat"
import Conversation from "@models/conversation"
import { ably } from "@/lib/server/ably"
import { auth } from "@auth"

async function getUser() {
  return (await auth())?.user?.id || null
}

async function getMessageForUser(bubbleId: string, userId: string) {
  const message: any = await Chat.findById(bubbleId)
  if (!message) return { error: NextResponse.json({ message: "Message not found" }, { status: 404 }) }
  const conversation = await Conversation.findOne({ _id: message.conversationId, userIds: userId })
  if (!conversation) return { error: NextResponse.json({ message: "Forbidden" }, { status: 403 }) }
  return { message, conversation }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectToDB()
    const userId = await getUser()
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    const { bubbleId, action, text } = await req.json()
    const result: any = await getMessageForUser(bubbleId, userId)
    if (result.error) return result.error
    const { message, conversation } = result
    if (action === "star") {
      const starred = (message.starredBy || []).some((id: any) => String(id) === userId)
      await Chat.updateOne({ _id: message._id }, starred ? { $pull: { starredBy: userId } } : { $addToSet: { starredBy: userId } })
    } else if (action === "edit") {
      if (String(message.senderId) !== userId || message.messageType !== "text") return NextResponse.json({ message: "Only your text messages can be edited" }, { status: 403 })
      if (!String(text || "").trim()) return NextResponse.json({ message: "Text cannot be empty" }, { status: 400 })
      await Chat.updateOne({ _id: message._id }, { $set: { text: String(text).trim(), editedAt: new Date() } })
    } else return NextResponse.json({ message: "Unsupported action" }, { status: 400 })
    const updated = await Chat.findById(message._id).lean()
    const ids = [String(message.senderId), String(message.receiverId)].sort().join("_")
    await ably.channels.get(`chat:${ids}`).publish("message:update", updated)
    await ably.channels.get(`inbox:${userId}`).publish("conversation:update", conversation)
    return NextResponse.json(updated)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Failed to update message" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ chatId: string }> }) {
  try {
    await connectToDB()
    const userId = await getUser()
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    const { chatId } = await params
    const { bubbleId, mode = "personal" } = await req.json()
    const result: any = await getMessageForUser(bubbleId, userId)
    if (result.error) return result.error
    const { message, conversation } = result
    const owned = String(message.senderId) === userId
    if (mode === "global") {
      if (!owned) return NextResponse.json({ message: "You can only delete your own message for everyone" }, { status: 403 })
      await Chat.updateOne({ _id: message._id }, { $set: { deletedAt: new Date(), text: "" }, $unset: { audio: 1, attachments: 1 } })
    } else {
      await Chat.updateOne({ _id: message._id }, { $addToSet: { deletedFor: userId } })
    }
    const latest: any = await Chat.findOne({ conversationId: message.conversationId, deletedAt: null, deletedFor: { $ne: userId } }).sort({ createdAt: -1 }).lean()
    await Conversation.updateOne({ _id: conversation._id }, { lastMessage: latest?.messageType === "voice" ? "Voice message" : latest?.text || "", updatedAt: new Date() })
    await ably.channels.get(`chat:${chatId}`).publish("message:delete", { ...message.toObject(), deletedAt: mode === "global" ? new Date() : null, deletedFor: [userId] })
    await ably.channels.get(`inbox:${userId}`).publish("conversation:update", conversation)
    return NextResponse.json({ message: "Message deleted" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Failed to delete message" }, { status: 500 })
  }
}
