import { connectToDB } from "@utils/database"
import Listing from "@models/listing"
import Request from "@models/request"
import { NextResponse } from "next/server"

export const GET = async (req) => {
  const { searchParams } = new URL(req.url)
  const agentId = searchParams.get("id")
  const location = searchParams.get("location") || ""
  const school = searchParams.get("school") || ""
  const page = Number(searchParams.get("page") || 1)
  const limit = Number(searchParams.get("limit") || 10)
  const skipNum = (page - 1) * limit

  const status = searchParams.get("status") || "all"
  const date = searchParams.get("date") || "newest"
  const views = searchParams.get("views") || ""

  let cursor = page

  // -------------------------------
  // SORTING
  // -------------------------------
  const sortOptions = {}

  if (views === "highest") sortOptions.totalViews = -1
  else if (views === "lowest") sortOptions.totalViews = 1

  sortOptions.createdAt = date === "oldest" ? 1 : -1

  // -------------------------------
  // FILTERS
  // -------------------------------
  const filter = { agent: agentId }

  if (status !== "all") {
    filter.status = status.toLowerCase()
  }

  const searchOptions = []
  if (location) searchOptions.push({ location: { $regex: location, $options: "i" } })
  if (school) searchOptions.push({ school: { $regex: school, $options: "i" } })

  if (searchOptions.length > 0) {
    filter.$or = searchOptions
  }

  try {
    await connectToDB()

    // Counts
    const totalDocs = await Listing.countDocuments({ agent: agentId })
    const filterLength = await Listing.countDocuments(filter)
    const currentRentings = await Listing.countDocuments({
      agent: agentId,
      status: "rented",
    })

    const numOfPages = Math.ceil(filterLength / limit)
    if (cursor > numOfPages) cursor = numOfPages

    // Fetch listings
    let listings = await Listing.find(filter)
      .populate(["agent"])
      .skip(skipNum)
      .limit(limit)
      .sort(sortOptions)
      .lean()

    const listingIds = listings.map((l) => l._id)

    const requests = await Request.aggregate([
      {
        $match: {
          listing: { $in: listingIds },
          status: "accepted",
        },
      },
      {
        $group: {
          _id: "$listing",
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
    ])

    const requestMap = {}
    requests.forEach((r) => {
      requestMap[r._id.toString()] = {
        roommate: r.roommate,
        coRent: r.coRent,
      }
    })

    listings = listings.map((listing) => ({
      ...listing,
      requestCounts: requestMap[listing._id.toString()] || {
        roommate: 0,
        coRent: 0,
      },
    }))

    return NextResponse.json(
      {
        listings,
        currentListings: totalDocs,
        currentRentings,
        cursor,
        numOfPages,
      },
      { status: 200 }
    )
  } catch (err) {
    console.log(err)
    return NextResponse.json(err, { status: 500 })
  }
}
