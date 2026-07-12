import { connectToDB } from "@utils/database"
import { NextRequest, NextResponse } from "next/server"
import Chat from "@models/chat"
import Conversation from "@models/conversation"
import { ably } from "@/lib/server/ably"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> },
) {
  try {
    await connectToDB()

    const { chatId } = await params
    const {bubbleId} = await req.json()

  console.log({chatId,bubbleId})
    const message = await Chat.findById(bubbleId)

    if (!message) {
      return NextResponse.json({ message: "Message not found" }, { status: 404 })
    }

    const conversationId = message.conversationId

    await Chat.findByIdAndDelete(bubbleId)

    const latestMessage = await Chat.findOne({ conversationId }).sort({ createdAt: -1 })

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: latestMessage?.text ?? "",
      updatedAt: new Date(),
    })

    // Publish to Ably here

    // Notify everyone viewing this chat
    await ably.channels.get(`chat:${chatId}`).publish("message:delete", message)
  // console.log('yepikay ye')  
  return NextResponse.json({
      message: "Message deleted successfully",
    })
  } catch (err) {
    console.error(err)

    return NextResponse.json({ message: "Failed to delete message" }, { status: 500 })
  }
}
