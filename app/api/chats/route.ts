import { connectToDB } from "@utils/database"
import { NextResponse, NextRequest } from "next/server"
import Chat from "@models/chat"
import Conversation from "@models/conversation"
import { ably } from "@/lib/server/ably"

import { sendEmail } from "@/lib/server/sendEmail"
import User from "@models/user"
import Listing from "@models/listing"

export async function POST(req: NextRequest) {
  try {
    await connectToDB()

    const { text, senderId, receiverId, replyingTo, listingId, attachments = [] } = await req.json()

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

    if (listingId) {
      try {
        // const [recipient, listing] = await Promise.all([
        //   User.findById(receiverId).lean(),
        //   Listing.findById(listingId).lean(),
        // ])

        const recipient: any = await User.findById(receiverId).lean()
        const listing: any = await Listing.findById(listingId).lean()

        if (recipient && recipient.email && listing) {
          const subject = "Inquiry about a listing"
          const message = `A client has chatted you regarding a listing at ${listing.location} ___ ${listing.address}. Check your inbox and respond to them.`

          // sendEmail is non-blocking for the request flow; log any errors
          sendEmail({ to: recipient.email, subject, message }).catch((err: any) => {
            console.error("Failed to send listing inquiry email:", err)
          })
        }
      } catch (err) {
        console.error("Error while preparing/sending listing email:", err)
      }
    }

    const message = await Chat.create({
      conversationId: conversation._id,
      senderId,
      receiverId,
      text,
      replyingTo,
      attachments,
      readBy: [senderId],
      listingId,
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

    const ids = [senderId, receiverId].sort().join("_")

    // Notify everyone viewing this chat
    await ably.channels.get(`chat:${ids}`).publish("message:create", message)

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
    const limit = 112
    // Number(searchParams.get("limit") || 20)
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
      .populate("listingId")

    const firstUnread = await Chat.findOne({
      conversationId: conversation._id,
      receiverId: senderId,
      senderId: {
        $ne: senderId,
      },
      readBy: {
        $ne: senderId,
      },
    })
      .sort({ createdAt: 1 }) // oldest unread
      .select("_id")
      .lean()

    const firstUnreadId = (firstUnread as any)?._id ?? null

    const unreadCount = await Chat.countDocuments({
      conversationId: conversation._id,
      receiverId: senderId,
      senderId: {
        $ne: senderId,
      },
      readBy: {
        $ne: senderId,
      },
    })
    return NextResponse.json(
      {
        conversationId: conversation?._id,
        messages,
        firstUnreadId,
        unreadCount,
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





// export async function GET(req: NextRequest) {
//   try {
//     await connectToDB()

//     const searchParams = req.nextUrl.searchParams

//     const senderId = searchParams.get("senderId")
//     const receiverId = searchParams.get("receiverId")

//     const before = searchParams.get("before")
//     const after = searchParams.get("after")

//     // const limit = Number(searchParams.get("limit") || 20)
//     const limit = 4

//     if (!senderId || !receiverId) {
//       return NextResponse.json(
//         {
//           message: "senderId and receiverId are required",
//         },
//         {
//           status: 400,
//         },
//       )
//     }

//     const conversation: any = await Conversation.findOne({
//       userIds: {
//         $all: [senderId, receiverId],
//       },
//     }).lean()

//     // First time chatting
//     if (!conversation) {
//       return NextResponse.json(
//         {
//           conversationId: null,
//           messages: [],
//           firstUnreadId: null,
//           unreadCount: 0,
//           prevCursor: null,
//           nextCursor: null,
//         },
//         {
//           status: 200,
//         },
//       )
//     }

//     const filter: any = {
//       conversationId: conversation._id,
//     }

//     if (before) {
//       filter._id = {
//         $lt: before,
//       }
//     }

//     if (after) {
//       filter._id = {
//         $gt: after,
//       }
//     }

//     // Initial load and loading older messages:
//     // fetch newest -> oldest then reverse
//     let query = Chat.find(filter).populate("listingId").lean().sort('-createdAt')

//     if (after) {
//       query = query.sort({ _id: 1 })
//     } else {
//       query = query.sort({ _id: -1 })
//     }

//     let messages = await query.limit(limit)

//     if (!after) {
//       messages.reverse
//     }

//     let prevCursor: string | null = null
//     let nextCursor: string | null = null

//     if (messages.length) {
//       const oldest = messages[0]
//       const newest = messages[messages.length - 1]

//       const olderExists = await Chat.exists({
//         conversationId: conversation._id,
//         _id: {
//           $lt: oldest._id,
//         },
//       })

//       const newerExists = await Chat.exists({
//         conversationId: conversation._id,
//         _id: {
//           $gt: newest._id,
//         },
//       })

//       prevCursor = olderExists ? oldest._id.toString() : null
//       nextCursor = newerExists ? newest._id.toString() : null
//     }

//     const firstUnread = await Chat.findOne({
//       conversationId: conversation._id,
//       receiverId: senderId,
//       senderId: {
//         $ne: senderId,
//       },
//       readBy: {
//         $ne: senderId,
//       },
//     })
//       .sort({ createdAt: 1 })
//       .select("_id")
//       .lean()

//     const firstUnreadId = (firstUnread as any)?._id ?? null

//     const unreadCount = await Chat.countDocuments({
//       conversationId: conversation._id,
//       receiverId: senderId,
//       senderId: {
//         $ne: senderId,
//       },
//       readBy: {
//         $ne: senderId,
//       },
//     })

//     return NextResponse.json(
//       {
//         conversationId: conversation._id,
//         messages,
//         firstUnreadId,
//         unreadCount,
//         prevCursor,
//         nextCursor,
//       },
//       {
//         status: 200,
//       },
//     )
//   } catch (err) {
//     console.error(err)

//     return NextResponse.json(
//       {
//         message: "Failed to fetch messages",
//       },
//       {
//         status: 500,
//       },
//     )
//   }
// }