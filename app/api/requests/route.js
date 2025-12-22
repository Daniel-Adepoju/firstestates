import { connectToDB } from "@utils/database"
import Request from "@models/request"
import { NextResponse } from "next/server"
import { auth } from "@auth"
import mongoose from "mongoose"
import { sendEmail } from "@lib/server/sendEmail"

export const GET = async (req) => {
  const { searchParams } = new URL(req.url)

  const page = Number(searchParams.get("page") || 1)
  const limit = Number(searchParams.get("limit") || 10)

  const filters = {
    school: searchParams.get("school") || "",
    status: searchParams.get("status") || "",
    currentUser: searchParams.get("currentUser") || "",
    requestType: searchParams.get("requestType") || "",
    agent: searchParams.get("agent") || "",
    listing: searchParams.get("listing") || "",
    isBookmarked: searchParams.get("isBookmarked") || "",
  }

  const skipNum = (page - 1) * limit
  let cursor = page

  await connectToDB()
  const session = await auth()

  // func for converting to mongodb object
  //  await Request.updateMany({},{$set: {bookmarkedBy: ['691e0b9027bef81e688fc3fe']}})

  const toId = (id) =>
    mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null

  const currentUserId = toId(filters.currentUser)
  const agentObjectId = toId(filters.agent)
  const listingObjectId = toId(filters.listing)

  // MATCH CONDITIONS BUILDER

  const match = {}

  // status
  if (["pending", "accepted"].includes(filters.status)) {
    match.status = filters.status
  }

  // requestType
  if (["roommate", "co-rent"].includes(filters.requestType)) {
    match.requestType = filters.requestType
  }

  // school
  if (filters.school) {
    match["listing.school"] = { $regex: filters.school, $options: "i" }
  }

  // exclude currentUser's request

  if (currentUserId) {
    match["requester._id"] = { $ne: currentUserId }
  }

  // filter by agent
  if (agentObjectId) {
    match["listing.agent"] = agentObjectId
  }

  // listingId
  if (listingObjectId) {
    match["listing._id"] = listingObjectId
  }

  if (filters.isBookmarked === "true") {
    match.bookmarkedBy = { $in: [currentUserId] }
  }

  // check for bookmarked requests

  const matchStage = { $match: match }

  //  PIPELINE SHARED PARTS

  const viewsPipeline = [
    {
      $addFields: {
        viewsDecay: {
          $subtract: [
            "$views",
            {
              $pow: [
                {
                  $divide: [{ $subtract: [new Date(), "$createdAt"] }, 1000 * 60 * 60 * 24],
                },
                1.3,
              ],
            },
          ],
        },
      },
    },
  ]

  const populatePipeline = [
    {
      $lookup: {
        from: "listings",
        localField: "listing",
        foreignField: "_id",
        as: "listing",
      },
    },
    { $unwind: "$listing" },
    {
      $lookup: {
        from: "users",
        localField: "requester",
        foreignField: "_id",
        as: "requester",
      },
    },
    {
      $unwind: {
        path: "$requester",
        preserveNullAndEmptyArrays: true,
      },
    },
  ]

  // MAIN REQUESTS PIPELINE
  // console.log({ currentUserId, bookmarkrd: filters.isBookmarked })
  const requestsPipeline = [
    ...viewsPipeline,
    {
      $addFields: {
        isBookmarked: {
          $in: [toId(session?.user.id), "$bookmarkedBy"],
        },
      },
    },
    ...populatePipeline,
    matchStage,

    { $sort: { viewsDecay: -1 } },
    { $skip: skipNum },
    { $limit: limit },
    {
      $project: {
        status: 1,
        requestType: 1,
        budget: 1,
        preferredGender: 1,
        description: 1,
        views: 1,
        isBookmarked: 1,
        bookmarkedBy: 1,
        "requester.profilePic": 1,
        "requester._id": 1,
        "requester.username": 1,
        "listing._id": 1,
        "listing.mainImage": 1,
        "listing.price": 1,
        "listing.address": 1,
        "listing.location": 1,
        "listing.school": 1,
        "listing.bedrooms": 1,
        "listing.bathrooms": 1,
        "listing.toilets": 1,
      },
    },
  ]

  // COUNT PIPELINE
  const countPipeline = [...viewsPipeline, ...populatePipeline, matchStage, { $count: "total" }]

  const countResult = await Request.aggregate(countPipeline)
  const totalRequests = countResult[0]?.total || 0
  const numOfPages = Math.ceil(totalRequests / limit)
  cursor = Math.min(page, numOfPages)

  // Pending requests for agent
  const pendingRequests = await Request.aggregate([
    ...populatePipeline,
    {
      $match: {
        status: "pending",
        "listing.agent": toId(session?.user.id),
      },
    },
    { $count: "total" },
  ])

  const pendingRequestsLength = pendingRequests[0]?.total || 0

  const requests = await Request.aggregate(requestsPipeline)

  return NextResponse.json(
    { requests, totalRequests, cursor, numOfPages, pendingRequestsLength },
    { status: 200 }
  )
}

export const POST = async (req) => {
  try {
    const session = await auth()
    await connectToDB()
    const { val } = await req.json()

    const newRequest = new Request({
      ...val,
      requester: session?.user.id,
    })

    await newRequest.save()

    return NextResponse.json({ newRequest }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export const PATCH = async (req) => {
  await connectToDB()

  const body = await req.json()
  const { action } = body

  // accept request
  if (action === "acceptRequest") {
    const { id, status } = body

    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate("requester")

    if (updatedRequest) {
      await sendEmail({
        to: updatedRequest.requester.email,
        subject: "Request Status Update",
        message: `Your ${updatedRequest.requestType} request has been accepted`,
      })
    }

    return NextResponse.json({ message: "Request updated" }, { status: 200 })
  }

  // bookmark request
  if (action === "bookmarkRequest") {
    const { requestId, userId } = body

    const request = await Request.findById(requestId)
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    const alreadyBookmarked = request.bookmarkedBy.includes(userId)

    if (alreadyBookmarked) {
      // REMOVE bookmark
      await Request.updateOne({ _id: requestId }, { $pull: { bookmarkedBy: userId } })
    } else {
      // ADD bookmark
      await Request.updateOne({ _id: requestId }, { $push: { bookmarkedBy: userId } })
    }

    return NextResponse.json(
      {
        message: alreadyBookmarked ? "Bookmark removed" : "Request bookmarked",
      },
      { status: 200 }
    )
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}

export const DELETE = async (req) => {
  try {
    await connectToDB()
    const { id } = await req.json()
    const singleRequest = await Request.findById(id).populate("requester")
    await sendEmail({
      to: singleRequest.requester.email,
      subject: "Request Status Update",
      message: `Your ${singleRequest.requestType} request has been declined`,
    })
    await singleRequest.deleteOne()
    return NextResponse.json({ message: "Request deleted" }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
