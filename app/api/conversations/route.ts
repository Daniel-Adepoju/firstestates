import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"

import { connectToDB } from "@utils/database"

import Conversation from "@models/conversation"
import Chat from "@models/chat"
import User from "@models/user"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const senderId = searchParams.get("senderId")
  const page = Number(searchParams.get("page") || 1)
  const limit = Number(searchParams.get("limit") || 15)

  if (!senderId) {
    return NextResponse.json({ message: "senderId is required" }, { status: 400 })
  }

  try {
    await connectToDB()

    const senderObjectId = new mongoose.Types.ObjectId(senderId)
    const skip = (page - 1) * limit

    const conversations = await Conversation.aggregate([
      // -----------------------------
      // Fetch my conversations
      // -----------------------------
      {
        $match: {
          userIds: senderObjectId,
        },
      },

      {
        $sort: {
          updatedAt: -1,
        },
      },

      {
        $skip: skip,
      },

      {
        $limit: limit,
      },

      // -----------------------------
      // Populate all participants
      // -----------------------------
      {
        $lookup: {
          from: "users",
          localField: "userIds",
          foreignField: "_id",
          as: "participants",
        },
      },

      // -----------------------------
      // Keep only the other participant
      // -----------------------------
      {
        $addFields: {
          participant: {
            $first: {
              $filter: {
                input: "$participants",
                as: "participant",
                cond: {
                  $ne: ["$$participant._id", senderObjectId],
                },
              },
            },
          },
        },
      },

      // -----------------------------
      // Remove fields we don't need
      // -----------------------------
      {
        $project: {
          participants: 0,
          "participant.password": 0,
          "participant.__v": 0,
          "participant.createdAt": 0,
          "participant.updatedAt": 0,
        },
      },

      // -----------------------------
      // Count unread messages
      // -----------------------------
      {
        $lookup: {
          from: Chat.collection.name,
          let: {
            conversationId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$conversationId", "$$conversationId"],
                    },
                    {
                      $eq: ["$receiverId", senderObjectId],
                    },
                    {
                      $ne: ["$senderId", senderObjectId],
                    },
                    {
                      $not: {
                        $in: [senderObjectId, "$readBy"],
                      },
                    },
                  ],
                },
              },
            },
            {
              $count: "count",
            },
          ],
          as: "unread",
        },
      },

      // -----------------------------
      // Extract unread count
      // -----------------------------
      {
        $addFields: {
          unreadCount: {
            $ifNull: [
              {
                $first: "$unread.count",
              },
              0,
            ],
          },
        },
      },

      // -----------------------------
      // Cleanup
      // -----------------------------
      {
        $project: {
          unread: 0,
        },
      },
    ])

    const total = await Conversation.countDocuments({
      userIds: senderObjectId,
    })

    return NextResponse.json({
      conversations,
      total,
      numOfPages: Math.ceil(total / limit),
      cursor: page,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        message: "Failed to fetch conversations",
      },
      {
        status: 500,
      },
    )
  }
}
