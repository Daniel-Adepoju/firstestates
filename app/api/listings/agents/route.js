import { connectToDB } from "@utils/database"
import Listing from "@models/listing"
import { NextResponse } from "next/server"
import { auth } from "@auth"

export const GET = async (req) => {
  const { searchParams } = new URL(req.url)
  const school = searchParams.get("school") || ""
  const page = Number(searchParams.get("page") || 1)
  const limit = Number(searchParams.get("limit") || 10)
  const skipNum = (page - 1) * limit

  if (!school) {
    return NextResponse.json({ error: "School query param is required" }, { status: 400 })
  }

  try {
    await auth()
    await connectToDB()

    // aggregate agent for count
    const totalAgentsAgg = await Listing.aggregate([
      { $match: { school: { $regex: school, $options: "i" } } },
      { $group: { _id: "$agent" } },
      { $count: "total" },
    ])
    const totalAgents = totalAgentsAgg[0]?.total || 0
    const numOfPages = Math.ceil(totalAgents / limit)
    const cursor = Math.min(page, numOfPages)


    // agents aggregate for render
  const agents = await Listing.aggregate([
  { $match: { school: { $regex: school, $options: "i" } } },
  { $sort: { createdAt: -1 } },
  {
    $group: {
      _id: "$agent",
      latestListingAt: { $first: "$createdAt" },
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "agent",
    },
  },
  { $unwind: "$agent" },
  {
    $addFields: {
      score: "$latestListingAt",
    },
  },
  { $sort: { score: -1 } },
  { $skip: skipNum },
  { $limit: limit },
  {
    $project: {
      _id: "$agent._id",
      username: "$agent.username",
      profilePic: "$agent.profilePic",
      email: "$agent.email",
      phone: "$agent.phone",
      isVerified: "$agent.isVerified",
      createdAt: "$agent.createdAt",
      score: 1,
      latestListingAt: 1,
    },
  },
])


    return NextResponse.json(
      {
        agents,
        cursor,
        numOfPages,
        totalAgents,
      },
      { status: 200 }
    )
  } catch (err) {
    console.log("AGENT_FETCH_ERROR", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
