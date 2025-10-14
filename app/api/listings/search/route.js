import { connectToDB } from "@utils/database"
import Listing from "@models/listing"
import { NextResponse } from "next/server"

export const GET = async (req) => {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "10")
  const search = searchParams.get("search") || ""
  const location = searchParams.get("location") || ""
  const school = searchParams.get("school") || ""
  const agentName = searchParams.get("agentName") || ""
  const skip = (page - 1) * limit

  try {
    await connectToDB()
    // Base aggregation pipeline

    const basePipeline = [
      {
        $lookup: {
          from: "users",
          localField: "agent",
          foreignField: "_id",
          as: "agent",
        },
      },
      { $unwind: "$agent" },
    ]

    // Hybrid search logic
    if (search) {
      if (search.length >= 4 && search.includes(" ")) {
        // Full-text search for multi-word / long queries
        basePipeline.push({
          $match: { $text: { $search: search } },
        })
        basePipeline.push({
          $addFields: { score: { $meta: "textScore" } },
        })
        basePipeline.push({ $sort: { score: -1, createdAt: -1 } })
      } else {
        // Regex for short / partial search
        regexConditions.push(
          { school: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
          { "agent.username": { $regex: search, $options: "i" } }
        )

        basePipeline.push({ $match: { $or: regexConditions } })
        basePipeline.push({ $sort: { createdAt: -1 } })
      }
    } else {
      // Default filtering by individual fields if no main search
      const matchConditions = []
      if (school) matchConditions.push({ school: { $regex: school, $options: "i" } })
      if (location) matchConditions.push({ location: { $regex: location, $options: "i" } })
      if (agentName)
        matchConditions.push({ "agent.username": { $regex: agentName, $options: "i" } })

      if (matchConditions.length > 0) {
        basePipeline.push({ $match: { $or: matchConditions } })
      }
      basePipeline.push({ $sort: { createdAt: -1 } })
    }

    // Total matched documents for pagination
    const countPipeline = [...basePipeline, { $count: "total" }]
    const countResult = await Listing.aggregate(countPipeline)
    const totalDocs = countResult[0]?.total || 0

    // Pagination
    basePipeline.push({ $skip: skip })
    basePipeline.push({ $limit: limit })

    const posts = await Listing.aggregate(basePipeline)

    // Additional stats
    const totalListings = await Listing.countDocuments()
    const rentedListings = await Listing.countDocuments({ status: "rented" })
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
        reportedListings,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json(err, { status: 500 })
  }
}
