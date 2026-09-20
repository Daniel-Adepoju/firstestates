import { parseSearch } from "@lib/ai/parseSearch"
import { connectToDB } from "@utils/database"
import Listing from "@models/listing"
import { PipelineStage } from "mongoose"
import { NextResponse } from "next/server"

function buildListingFilter(intent: any) {
  const match: any = {}
  const hasValue = (value: unknown) => value !== null && value !== undefined && value !== ""

  if (hasValue(intent.school)) match.school = { $regex: intent.school, $options: "i" }
  if (hasValue(intent.location)) match.location = { $regex: intent.location, $options: "i" }
  if (hasValue(intent.agentName)) {
    match["agent.username"] = { $regex: intent.agentName, $options: "i" }
  }

  if (hasValue(intent.bedrooms)) match.bedrooms = intent.bedrooms
  if (hasValue(intent.bathrooms)) match.bathrooms = intent.bathrooms
  if (hasValue(intent.toilets)) match.toilets = intent.toilets
  if (hasValue(intent.listingType)) {
    match.listingType = { $regex: intent.listingType, $options: "i" }
  }

  if (hasValue(intent.minPrice) || hasValue(intent.maxPrice)) {
    match.price = {}
    if (hasValue(intent.minPrice)) match.price.$gte = intent.minPrice
    if (hasValue(intent.maxPrice)) match.price.$lte = intent.maxPrice
  }

  if (hasValue(intent.priceUnit)) match.priceUnit = intent.priceUnit
  if (hasValue(intent.priceDuration)) match.priceDuration = intent.priceDuration

  return match
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const query = typeof body.query === "string" ? body.query.trim() : ""
    const page = Math.max(Number.parseInt(body.page || "1", 10) || 1, 1)
    const limit = Math.min(Math.max(Number.parseInt(body.limit || "10", 10) || 10, 1), 50)
    const skip = (page - 1) * limit

    const intent = await parseSearch(query)
    const listingFilter = buildListingFilter(intent)
    await connectToDB()

    const listingPipeline: PipelineStage[] = [
      {
        $lookup: {
          from: "users",
          localField: "agent",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                username: 1,
                email: 1,
                phone: 1,
                profilePic: 1,
                isPremium: 1,
              },
            },
          ],
          as: "agent",
        },
      },
      { $unwind: "$agent" },
      { $match: { status: { $ne: "pending" }, ...listingFilter } },
      {
        $addFields: {
          daysOld: {
            $divide: [{ $subtract: [new Date(), "$createdAt"] }, 1000 * 60 * 60 * 24],
          },
        },
      },
      {
        $addFields: {
          priorityScore: {
            $subtract: [
              {
                $switch: {
                  branches: [
                    { case: { $eq: ["$listingTier", "first"] }, then: 3000 },
                    { case: { $eq: ["$listingTier", "gold"] }, then: 2000 },
                    { case: { $eq: ["$listingTier", "standard"] }, then: 0 },
                  ],
                  default: 0,
                },
              },
              {
                $multiply: [
                  "$daysOld",
                  {
                    $switch: {
                      branches: [
                        { case: { $eq: ["$listingTier", "first"] }, then: 400 },
                        { case: { $eq: ["$listingTier", "gold"] }, then: 450 },
                        { case: { $eq: ["$listingTier", "standard"] }, then: 500 },
                      ],
                      default: 500,
                    },
                  },
                ],
              },
            ],
          },
        },
      },
      { $sort: { priorityScore: -1, createdAt: -1 } },
    ]

    const countPipeline: PipelineStage[] = listingPipeline.slice()
    countPipeline.push({ $count: "total" })
    const countResult = await Listing.aggregate(countPipeline)
    const total = countResult[0]?.total || 0
    const numOfPages = Math.ceil(total / limit)
    const cursor = total ? Math.min(page, numOfPages) : 0
    const postsPipeline: PipelineStage[] = listingPipeline.slice()
    postsPipeline.push({ $skip: skip }, { $limit: limit })
    const posts = await Listing.aggregate(postsPipeline)

    return NextResponse.json({ posts, cursor, numOfPages, intent }, { status: 200 })
  } catch (error: any) {
    console.error("AI SEARCH ERROR:", error)

    if (error?.status === 429) {
      return NextResponse.json(
        { error: "AI search quota exceeded. Please try again later." },
        { status: 429 },
      )
    }

    return NextResponse.json({ error: "Something went wrong with AI search." }, { status: 500 })
  }
}
