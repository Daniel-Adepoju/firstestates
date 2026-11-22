import { connectToDB } from "@utils/database"
import { NextRequest, NextResponse } from "next/server"
import Chat from "@models/chat"
import { auth } from "@auth"
import {ably} from "@lib/server/ably"

export async function PATCH(req: NextRequest) {
  try {
    await connectToDB()

    const { userId, conversationId } = await req.json()
    const session = await auth()
    if (!session?.user?.id || session.user.id !== userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const result = await Chat.updateMany(
      {
        conversationId,
        receiverId: userId,
        senderId: { $ne: userId },
        readBy: { $ne: userId },
      },
      {
        $addToSet: {
          readBy: userId,
        },
      },
    )

    // ably for inbox
    ably.channels.get(`inbox:${userId}`).publish("conversation:read", {
      conversationId,
      userId,
    })
    return NextResponse.json(result)
  } catch (err) {
    console.error(err)

    return NextResponse.json({ message: "Failed to update read status" }, { status: 500 })
  }
}
