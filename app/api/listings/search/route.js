import { connectToDB } from "@utils/database"
import Listing from "@models/listing"
import { NextResponse } from "next/server"

export const GET = async (req) => {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page')) || 1
  const limit = parseInt(searchParams.get('limit')) || 10
  const location = searchParams.get('location') || ''
  const school = searchParams.get('school') || ''
  const agentName = searchParams.get('agentName') || ''
  const skip = (page - 1) * limit

  try {
    await connectToDB()

    // Base match conditions
    const matchConditions = []

    if (location) {
      matchConditions.push({ location: { $regex: location, $options: "i" } })
    }

    if (school) {
      matchConditions.push({ school: { $regex: school, $options: "i" } })
    }

    if (agentName) {
      matchConditions.push({ "agent.username": { $regex: agentName, $options: "i" } })
    }

    // Aggregation Pipeline
    const basePipeline = [
      {
        $lookup: {
          from: "users",
          localField: "agent",
          foreignField: "_id",
          as: "agent"
        }
      },
      { $unwind: "$agent" },
    ]

    if (matchConditions.length > 0) {
      basePipeline.push({
        $match: { $or: matchConditions }
      })
    }

    // Total matched listings
   
    const countPipeline = [...basePipeline, { $count: "total" }]
    const countResult = await Listing.aggregate(countPipeline)
    const totalDocs = countResult[0]?.total || 0
 console.log('ff')
    // Paginated listings
    const listingsPipeline = [
      ...basePipeline,
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]

    const posts = await Listing.aggregate(listingsPipeline)

    // Additional stats
    const totalListings = await Listing.countDocuments()
    const rentedListings = await Listing.countDocuments({ status: 'rented' })
    const reportedListings = await Listing.countDocuments({ reportedBy: { $not: { $size: 0 } } })

    const numOfPages = Math.ceil(totalDocs / limit)
    const cursor = Math.min(page, numOfPages)

    return NextResponse.json(
      {
        posts,
        cursor,
        numOfPages,
        totalListings,
        rentedListings,
        reportedListings
      },
      { status: 200 }
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json(err, { status: 500 })
  }
}
