import { NextRequest, NextResponse } from "next/server"
import { connectToDB } from "@utils/database"
import Conversation from "@models/conversation"
import Chat from "@models/chat"
import { auth } from "@auth"
import { ably } from "@/lib/server/ably"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ conversationId: string }> }) {
  try {
    await connectToDB()
    const userId = (await auth())?.user?.id
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    const { conversationId } = await params
    const { action } = await req.json()
    const conversation: any = await Conversation.findOne({ _id: conversationId, userIds: userId })
    if (!conversation) return NextResponse.json({ message: "Conversation not found" }, { status: 404 })
    if (action === "pin") await Conversation.updateOne({ _id: conversationId }, { $addToSet: { pinnedBy: userId } })
    else if (action === "unpin") await Conversation.updateOne({ _id: conversationId }, { $pull: { pinnedBy: userId } })
    else return NextResponse.json({ message: "Unsupported action" }, { status: 400 })
    const updated = await Conversation.findById(conversationId).lean()
    await ably.channels.get(`inbox:${userId}`).publish("conversation:update", updated)
    return NextResponse.json(updated)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Failed to update conversation" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ conversationId: string }> }) {
  try {
    await connectToDB()
    const userId = (await auth())?.user?.id
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    const { conversationId } = await params
    const conversation: any = await Conversation.findOne({ _id: conversationId, userIds: userId })
    if (!conversation) return NextResponse.json({ message: "Conversation not found" }, { status: 404 })
    await Conversation.updateOne({ _id: conversationId }, { $addToSet: { hiddenFor: userId } })
    await Chat.updateMany({ conversationId, senderId: userId }, { $set: { deletedAt: new Date(), text: "" }, $unset: { audio: 1, attachments: 1 } })
    await Chat.updateMany({ conversationId, senderId: { $ne: userId } }, { $addToSet: { deletedFor: userId } })
    await ably.channels.get(`inbox:${userId}`).publish("conversation:delete", { conversationId })
    return NextResponse.json({ message: "Conversation hidden" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Failed to delete conversation" }, { status: 500 })
  }
}
