import { connectToDB } from "@utils/database"
import Request from "@models/request"
import { NextResponse } from "next/server"
import { auth } from "@auth"

export const GET = async (req) => {
  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get("page")) || 1
  const limit = Number(searchParams.get("limit")) || 10
  const school = searchParams.get("school")
  const status = searchParams.get("status") || ""
  const requestType = searchParams.get("requestType") || ""
  const skipNum = (page - 1) * limit
  let cursor = page

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
    matchConditions.push({"listing.school": {$regex: school, $options: "i"}})
  }

  try {
    const session = await auth()
    await connectToDB()

    const matchStage =
      matchConditions.length > 0 ? { $match: { $and: matchConditions } } : { $match: {} }

    const totalRequests = await Request.countDocuments(matchStage.$match)
    const numOfPages = Math.ceil(totalRequests / limit)
    if (cursor > numOfPages) cursor = numOfPages

    const decayFactor = 1.3

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
        $unwind: "$requester",
      },
    ]

    const requests = await Request.aggregate([
      ...viewsPipeline,
      { $sort: { viewsDecay: -1 } },
      { $skip: skipNum },
      { $limit: limit },

      ...populatePipeline,
      {
        $project: {
          status: 1,
          requestType: 1,
          budget: 1,
          description: 1,
          requestType: 1,
          views: 1,
          "requester.profilePic": 1,
          // 'requester._id': 1,
          "requester.username": 1,
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
      matchStage,
    ])

    return NextResponse.json({ requests, totalRequests, page: cursor, numOfPages }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export const POST = async (req) => {
  try {
    const session = await auth()
    await connectToDB()
    const { requester, listing, requestType, budget, description } = await req.json()

    const newRequest = new Request({
      requester: session?.user.id || requester,
      listing,
      requestType,
      budget,
      description,
    })

    await newRequest.save()

    return NextResponse.json({ newRequest }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
