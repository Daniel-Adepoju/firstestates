import { connectToDB } from "@utils/database"
import Listing from "@models/listing"
import { NextResponse } from "next/server"

export const GET = async (req) => {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "10")
  const searchText = searchParams.get("search")
  const search = searchText ? searchText.trim() : ""
  const location = searchParams.get("location") || ""
  const school = searchParams.get("school") || ""
  const agentName = searchParams.get("agentName") || ""
  const status = searchParams.get("status") || ""
  const skip = (page - 1) * limit

  const isAdmin = searchParams.get("isAdmin") === "true"
  const isPending = searchParams.get("isPending") === "true"
 
  try {
    await connectToDB()

    // === Stage groups ===
    let textStages = []
    const postTextStages = [
      {
        $lookup: {
          from: "users",
          localField: "agent",
          foreignField: "_id",
          as: "agent",
        },
      },
      { $unwind: "$agent" },

      //  join requests count
      {
        $lookup: {
          from: "requests",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$listing", "$$id"] },
                status: "accepted",
              },
            },
            {
              $group: {
                _id: null,
                roommate: {
                  $sum: {
                    $cond: [{ $eq: ["$requestType", "roommate"] }, 1, 0],
                  },
                },
                coRent: {
                  $sum: {
                    $cond: [{ $eq: ["$requestType", "co-rent"] }, 1, 0],
                  },
                },
              },
            },
          ],
          as: "requestCounts",
        },
      },
      {
        $addFields: {
          requestCounts: {
            $ifNull: [{ $arrayElemAt: ["$requestCounts", 0] }, { roommate: 0, coRent: 0 }],
          },
        },
      },
      // ----------------------------
    ]

    // Base match applied everywhere
    const baseMatch = isPending
      ? { status: "pending" }
      : !isAdmin
        ? { status: { $ne: "pending" } }
        : {}

    const defaultSort = isAdmin ? { createdAt: -1 } : { listingTierWeight: 1, createdAt: -1 }

    // === Hybrid search logic ===
    if (search) {
      if (search.length >= 4 && search.includes(" ")) {
        textStages = [
          {
            $match: {
              ...baseMatch,
              $text: { $search: search },
            },
          },
          { $addFields: { score: { $meta: "textScore" } } },
          {
            $sort: isAdmin
              ? { score: -1, createdAt: -1 }
              : { listingTierWeight: 1, score: -1, createdAt: -1 },
          },
        ]
      } else {
        const regexConditions = [
          { school: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
          { "agent.username": { $regex: search, $options: "i" } },
        ]

        postTextStages.push({
          $match: {
            ...baseMatch,
            $or: regexConditions,
          },
        })

        postTextStages.push({
          $sort: defaultSort,
        })
      }
    } else {
      const match = { ...baseMatch }

      if (school) {
        match.school = { $regex: school, $options: "i" }
      }

      if (location) {
        match.location = { $regex: location, $options: "i" }
      }

      if (agentName) {
        match["agent.username"] = { $regex: agentName, $options: "i" }
      }

      if (status) {
        match.status = { $regex: status, $options: "i" }
      }

      postTextStages.push({ $match: match })

      postTextStages.push({ $sort: defaultSort })
    }

    // === Combine stages in correct order ===
    const basePipeline = [...textStages, ...postTextStages]

    // === Count total documents ===
    const countPipeline = [...basePipeline, { $count: "total" }]
    const countResult = await Listing.aggregate(countPipeline)
    const totalDocs = countResult[0]?.total || 0

    // === Pagination ===
    const paginatedPipeline = [...basePipeline, { $skip: skip }, { $limit: limit }]

    const posts = await Listing.aggregate(paginatedPipeline)

    // === Additional stats ===
    const totalListings = await Listing.countDocuments()
    const rentedListings = await Listing.countDocuments({ status: "rented" })
    const reportedListings = await Listing.countDocuments({
      reportedBy: { $not: { $size: 0 } },
    })

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
      { status: 200 },
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json(err, { status: 500 })
  }
}
