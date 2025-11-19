import { connectToDB } from "@utils/database"
import Listing from "@models/listing"
import { NextResponse } from "next/server"
import { auth } from "@auth"

export const GET = async (req) => {
  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get("page") || 1)
  const limit = Number(searchParams.get("limit") || 10)
  const skipNum = (page - 1) * limit

  const filters = [
    searchParams.get("location") && {
      location: { $regex: searchParams.get("location"), $options: "i" },
    },
    searchParams.get("school") && { school: { $regex: searchParams.get("school"), $options: "i" } },
    searchParams.get("minPrice") && { price: { $gte: Number(searchParams.get("minPrice")) } },
    searchParams.get("maxPrice") && { price: { $lte: Number(searchParams.get("maxPrice")) } },
    searchParams.get("beds") && { bedrooms: Number(searchParams.get("beds")) },
    searchParams.get("baths") && { bathrooms: Number(searchParams.get("baths")) },
    searchParams.get("toilets") && { toilets: Number(searchParams.get("toilets")) },
    searchParams.get("status") && { status: searchParams.get("status").toLowerCase() },
  ].filter(Boolean)

  const TIER_BOOSTS = { first: 3000, gold: 2000, standard: 0 }
  const PENALTY_PER_DAY = { first: 400, gold: 450, standard: 500 }

  try {
    await auth()
    await connectToDB()

    const total = await Listing.countDocuments(filters.length ? { $and: filters } : {})
    const numOfPages = Math.ceil(total / limit)
    const cursor = Math.min(page, numOfPages)

    const posts = await Listing.aggregate([
      { $match: filters.length ? { $and: filters } : {} },
      {
        $addFields: {
          daysOld: { $divide: [{ $subtract: [new Date(), "$createdAt"] }, 1000 * 60 * 60 * 24] },
        },
      },
      {
        $addFields: {
          priorityScore: {
            $subtract: [
              { $literal: 0 }, // placeholder to simplify
              { $literal: 0 },
            ],
          },
        },
      },
      {
        // cleaner tier boost + age penalty
        $addFields: {
          priorityScore: {
            $subtract: [
              {
                $switch: {
                  branches: Object.entries(TIER_BOOSTS).map(([tier, boost]) => ({
                    case: { $eq: ["$listingTier", tier] },
                    then: boost,
                  })),
                  default: 0,
                },
              },
              {
                $multiply: [
                  "$daysOld",
                  {
                    $switch: {
                      branches: Object.entries(PENALTY_PER_DAY).map(([tier, val]) => ({
                        case: { $eq: ["$listingTier", tier] },
                        then: val,
                      })),
                      default: 500,
                    },
                  },
                ],
              },
            ],
          },
        },
      },
      { $sort: { priorityScore: -1 } },
      { $skip: skipNum },
      { $limit: limit },
    ])

    await Listing.populate(posts, { path: "agent" })

    return NextResponse.json({ posts, cursor, numOfPages }, { status: 200 })
  } catch (err) {
    console.log(err)
    return NextResponse.json(err, { status: 500 })
  }
}
