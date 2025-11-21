import { connectToDB } from "@utils/database"
import Listing from "@models/listing"
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
  const date = searchParams.get("date") || "oldest"
  const views = searchParams.get("views") || ""

  let cursor = page

  // build sort object
  const sortOptions = {}

  if (views === "highest") sortOptions.totalViews = -1
  else if (views === "lowest") sortOptions.totalViews = 1
  sortOptions.createdAt = date === "oldest" ? 1 : -1

  // build query filter
  const filter = { agent: agentId }

  // only add status if it's not "all"
  if (status && status !== "all") {
    filter.status = status.toLowerCase()
  }

  // build search options
  const searchOptions = []
  if (location) searchOptions.push({ location: { $regex: location, $options: "i" } })
  if (school) searchOptions.push({ school: { $regex: school, $options: "i" } })

  if (searchOptions.length > 0) {
    filter.$or = searchOptions
  }

  try {
    await connectToDB()

    const totalDocs = await Listing.countDocuments({ agent: agentId })
    const filterLength = await Listing.countDocuments(filter)
    const currentRentings = await Listing.countDocuments({ agent: agentId, status: "rented" })

    const numOfPages = Math.ceil(filterLength / limit)
    if (cursor > numOfPages) cursor = numOfPages

    let listingQuery = Listing.find(filter)
      .populate(["agent"])
      .skip(skipNum)
      .limit(limit)
      .sort(sortOptions)
    const listings = await listingQuery

    return NextResponse.json(
      { listings, currentListings: totalDocs, currentRentings, cursor, numOfPages },
      { status: 200 }
    )
  } catch (err) {
    console.log(err)
    return NextResponse.json(err, { status: 500 })
  }
}
