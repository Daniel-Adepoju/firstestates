import { connectToDB } from "@utils/database"
import { NextRequest, NextResponse } from "next/server"
import Chat from "@models/chat"
import {auth} from '@auth'

export async function GET(req: NextRequest) {
  try {
    await connectToDB()
  const session = await auth()
  const userId = session?.user?.id

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
