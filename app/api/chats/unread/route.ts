import { connectToDB } from "@utils/database"
import { NextRequest, NextResponse } from "next/server"
import Chat from "@models/chat"

export async function GET(req: NextRequest) {
  try {
    await connectToDB()

    const userId = req.nextUrl.searchParams.get("userId")

    const unread = await Chat.countDocuments({
      receiverId: userId,
      senderId: {
        $ne: userId,
      },
      readBy: {
        $ne: userId,
      },
    })

    return NextResponse.json({
      unread,
    })
  } catch (err) {
    console.error(err)

    return NextResponse.json({ message: "Failed to fetch unread chats" }, { status: 500 })
  }
}
