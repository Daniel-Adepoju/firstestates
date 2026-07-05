import { connectToDB } from "@utils/database"
import { NextRequest, NextResponse } from "next/server"
import Chat from "@models/chat"

export async function PATCH(req: NextRequest) {
  try {
    await connectToDB()

    const { userId, conversationId } = await req.json()

    const result = await Chat.updateMany(
      {
        conversationId,
        receiverId: userId,
        senderId: { $ne: userId },
        readBy: { $ne: userId },
      },
      {
        $push: {
          readBy: userId,
        },
      },
    )

    return NextResponse.json(result)
  } catch (err) {
    console.error(err)

    return NextResponse.json({ message: "Failed to update read status" }, { status: 500 })
  }
}
