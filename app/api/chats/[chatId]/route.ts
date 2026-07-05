import { connectToDB } from "@utils/database"
import { NextRequest, NextResponse } from "next/server"
import Chat from "@models/chat"
import Conversation from "@models/conversation"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    await connectToDB()

    const { chatId } = await params

    const message = await Chat.findById(chatId)

    if (!message) {
      return NextResponse.json(
        { message: "Message not found" },
        { status: 404 }
      )
    }

    const conversationId = message.conversationId

    await Chat.findByIdAndDelete(chatId)

    const latestMessage = await Chat.findOne({ conversationId })
      .sort({ createdAt: -1 })

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: latestMessage?.text ?? "",
      updatedAt: new Date(),
    })

    // Publish to Ably here

    return NextResponse.json({
      message: "Message deleted successfully",
    })
  } catch (err) {
    console.error(err)

    return NextResponse.json(
      { message: "Failed to delete message" },
      { status: 500 }
    )
  }
}