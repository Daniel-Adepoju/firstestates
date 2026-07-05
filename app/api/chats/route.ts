import { connectToDB } from "@utils/database"
import { NextResponse, NextRequest } from "next/server"
import Chat from "@models/chat"
import Conversation from "@models/conversation"
import { ably } from "@/lib/server/ably"

export async function POST(req: NextRequest) {
  try {
    await connectToDB()

    const { text, senderId, receiverId, attachments = [] } = await req.json()

    let conversation = await Conversation.findOne({
      userIds: {
        $all: [senderId, receiverId],
      },
    })

    if (!conversation) {
      conversation = await Conversation.create({
        userIds: [senderId, receiverId],
      })
    }
    const message = await Chat.create({
      conversationId: conversation._id,
      senderId,
      receiverId,
      text,
      replyingTo: null,
      attachments,
      readBy: [senderId],
    })

    await Conversation.findByIdAndUpdate(
      conversation._id,
      {
        lastMessage: message.text,
        updatedAt: new Date(),
      },
      { new: true },
    )

    console.log("Created message:", message)

    // Notify everyone viewing this chat
    // await ably.channels.get(`chat:${senderId} ${receiverId}`).publish("message:create", message)

    // Notify each user's inbox
    await Promise.all([
      ably.channels.get(`inbox:${senderId}`).publish("conversation:update", conversation),

      ably.channels.get(`inbox:${receiverId}`).publish("conversation:update", conversation),
    ])
    return NextResponse.json(message, { status: 201 })
  } catch (err) {
    console.error(err)

    return NextResponse.json({ message: "Failed to send message" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDB()

    const searchParams = req.nextUrl.searchParams

    const senderId = searchParams.get("senderId")
    const receiverId = searchParams.get("receiverId")

    const page = Number(searchParams.get("page") || 1)
    const limit = Number(searchParams.get("limit") || 20)

    if (!senderId || !receiverId) {
      return NextResponse.json(
        {
          message: "senderId and receiverId are required",
        },
        {
          status: 400,
        },
      )
    }

    const conversation: any = await Conversation.findOne({
      userIds: {
        $all: [senderId, receiverId],
      },
    }).lean()

    // First time chatting
    if (!conversation) {
      return NextResponse.json(
        {
          conversationId: null,
          messages: [],
          total: 0,
          numOfPages: 0,
          cursor: 1,
        },
        {
          status: 200,
        },
      )
    }

    const skipNum = (page - 1) * limit

    const filter = {
      conversationId: conversation?._id,
    }

    const total = await Chat.countDocuments(filter)

    const totalPages = Math.ceil(total / limit)

    const messages = await Chat.find(filter)
      .sort({ createdAt: -1 })
      .skip(skipNum)
      .limit(limit)
      .lean()

    return NextResponse.json(
      {
        conversationId: conversation?._id,
        messages: messages.reverse(),
        total,
        numOfPages: totalPages,
        cursor: Math.min(page, Math.max(totalPages, 1)),
      },
      {
        status: 200,
      },
    )
  } catch (err) {
    console.error(err)

    return NextResponse.json(
      {
        message: "Failed to fetch messages",
      },
      {
        status: 500,
      },
    )
  }
}
