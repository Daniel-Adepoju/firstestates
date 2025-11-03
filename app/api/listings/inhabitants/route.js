import { connectToDB } from "@utils/database"
import Inhabitant from "@models/inhabitant"
import User from "@models/user"
import Listing from "@models/listing"
import { NextResponse } from "next/server"
import { auth } from "@auth"

export const GET = async (req) => {
  try {
    await connectToDB()
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get("page") || 1)
    const limit = Number(searchParams.get("limit") || 10)
    const skipNum = (page - 1) * limit
    let cursor = page

    const matchConditions = []

    if (searchParams.get("listingId")) {
      matchConditions.push({ listing: searchParams.get("listingId") })
    }
    if (searchParams.get("agent")) {
      matchConditions.push({ agent: searchParams.get("agent") })
    }

    //  Handle search
    const searchValue = searchParams.get("search")
    if (searchValue) {
      
      // search for users
      const users = await User.find({
        $or: [
          { username: { $regex: searchValue, $options: "i" } },
          { email: { $regex: searchValue, $options: "i" } },
        ],
      }).select("_id")

            // Find listings by location
      const listings = await Listing.find({
        $or: [
          { location: { $regex: searchValue, $options: "i" } },
        ],
      }).select("_id")

      const userIds = users.map((u) => u._id)
      const listingIds = listings.map((l) => l._id)

      //  Combine user/listing match with $or
      if (userIds.length > 0 || listingIds.length > 0) {
        matchConditions.push({
          $or: [
            userIds.length > 0 ? { user: { $in: userIds } } : null,
            listingIds.length > 0 ? { listing: { $in: listingIds } } : null,
          ].filter(Boolean),
        })
      } else {
        // nothing found for that search
        return NextResponse.json({ inhabitants: [], cursor: 1, numOfPages: 1 }, { status: 200 })
      }
    }
    

    const query = matchConditions.length > 0 ? { $and: matchConditions } : {}

    const inhabitantsCount = await Inhabitant.countDocuments(query)
    const numOfPages = Math.max(1, Math.ceil(inhabitantsCount / limit))
    if (cursor > numOfPages) cursor = numOfPages

    const inhabitants = await Inhabitant.find(query)
      .populate([
        { path: "user", select: "username email profilePic"},
        { path: "listing", select: "mainImage location" },
      ])
      .sort("-createdAt")
      .skip(skipNum)
      .limit(limit)

    return NextResponse.json({ inhabitants, cursor, numOfPages }, { status: 200 })
  } catch (err) {
    console.error("GET Inhabitants error:", err)
    return NextResponse.json({ message: "Failed to fetch inhabitants" }, { status: 500 })
  }
}
