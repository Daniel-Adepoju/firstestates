import { connectToDB } from "@utils/database"
import Request from "@models/request"
import { NextResponse } from "next/server"
import { auth } from "@auth"
import mongoose from "mongoose"

export const GET = async (req) => {

  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get("page")) || 1
  const limit = Number(searchParams.get("limit")) || 10
  const school = searchParams.get("school") || ""
  const status = searchParams.get("status") || ""
  const currentUser = searchParams.get("currentUser") || ""
  const requestType = searchParams.get("requestType") || ""
  const agentId = searchParams.get("agent") || ""
  const skipNum = (page - 1) * limit
  let cursor = page


  // validity of ids
  let currentUserId

  if (mongoose.Types.ObjectId.isValid(currentUser)) {
    currentUserId = new mongoose.Types.ObjectId(currentUser)
  }
  let agentObjectId

  if (mongoose.Types.ObjectId.isValid(agentId)) {
    agentObjectId = new mongoose.Types.ObjectId(agentId)
  }
  console.log({agentId,agentObjectId})

  // initialize match conditions

  const matchConditions = []

  // Filter by status
  if (status === "pending") {
    matchConditions.push({ status: "pending" })
  } else if (status === "accepted") {
    matchConditions.push({ status: "accepted" })
  }

  // Filter by requestType
  if (requestType === "roommate") {
    matchConditions.push({ requestType: "roommate" })
  } else if (requestType === "co-rent") {
    matchConditions.push({ requestType: "co-rent" })
  }

  // Filter by school in listing
  if (school) {
    matchConditions.push({ "listing.school": { $regex: school, $options: "i" } })
  }

  // Filter by currentUserId
  if (currentUserId) {
    matchConditions.push({ "requester._id": { $ne: currentUserId } })
  }

  // Filter by agentId
  if (agentObjectId) {
    matchConditions.push({ "listing.agent":  agentObjectId })
  }

  try {
    const session = await auth()
    await connectToDB()

    const matchStage =
      matchConditions.length > 0 ? { $match: { $and: matchConditions } } : { $match: {} }

    const decayFactor = 1.3

    // base pipelines

    const viewsPipeline = [
      {
        $addFields: {
          viewsDecay: {
            $subtract: [
              "$views",
              {
                $pow: [
                  { $divide: [{ $subtract: [new Date(), "$createdAt"] }, 1000 * 60 * 60 * 24] },
                  decayFactor,
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

    const requestsPipeline = [
      ...viewsPipeline,
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
          description: 1,
          requestType: 1,
          views: 1,
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

    // counting docs
    const countPipeline = [...viewsPipeline, ...populatePipeline, matchStage, { $count: "total" }]
    const countResult = await Request.aggregate(countPipeline)
    const totalRequests = countResult[0]?.total || 0
    const numOfPages = Math.ceil(totalRequests / limit)
    cursor = Math.min(page, numOfPages)

    
    const pendingRequestsPipeline = await Request.aggregate([
      ...populatePipeline,
     
      { $match: { status: "pending", "listing.agent":  mongoose.Types.ObjectId.createFromHexString(session?.user.id) } },
      { $count: "total" },
    ])
    
    const pendingRequestsLength = pendingRequestsPipeline[0]?.total || 0
    console.log(pendingRequestsLength,session?.user.id)
    // final
    const requests = await Request.aggregate(requestsPipeline)
    return NextResponse.json(
      { requests, totalRequests, cursor, numOfPages, pendingRequestsLength },
      { status: 200 }
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
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
  const { id, status } = await req.json()
  await Request.findByIdAndUpdate(id, { status }, { new: true, runValidators: true })
  return NextResponse.json({ message: "Request updated" }, { status: 200 })
}

export const DELETE = async (req) => {
  try {
    await connectToDB()
    const { id } = await req.json()
    await Request.findByIdAndDelete(id)
    return NextResponse.json({ message: "Request deleted" }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
