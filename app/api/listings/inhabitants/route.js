import { connectToDB } from "@utils/database"
import Inhabitant from "@models/inhabitant"
import { NextResponse } from "next/server"
import { auth } from "@auth"

export const GET = async (req) => {
  const { searchParams } = new URL(req.url)
  const page = searchParams.get("page") || 1
  const limit = Number(searchParams.get("limit")) || 10
  const skipNum = (Number(page) - 1) * Number(limit)
  let cursor = Number(page)


  const matchConditions = []

  if (searchParams.get("listingId")) {
    matchConditions.push({ listing: searchParams.get("listingId") })
  }
  if (searchParams.get("agent")) {
    matchConditions.push({ agent: searchParams.get("agent") })
  }
  const query = matchConditions.length > 0 ? { $and: matchConditions } : {}
  const inhabitantsCount = await Inhabitant.countDocuments(query)
  const numOfPages = Math.ceil(inhabitantsCount / Number(limit))
  if (cursor >= numOfPages) {
    cursor = numOfPages
  }
  try {
    await connectToDB()

    const inhabitants = await Inhabitant.find(query)
      .populate({
        path: "user",
        select: "username email profilePic",
      })
      .sort("-createdAt")
      .skip(skipNum)
      .limit(limit)

    return NextResponse.json({ inhabitants, cursor, numOfPages }, { status: 200 })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: "Failed to fetch inhabitant" }, { status: 500 })
  }
}

export const POST = async (req) => {
  try {
    const session = await auth()
    await connectToDB()
    const { val } = await req.json()
 console.log(val, 'dd')
    const inhabitant = new Inhabitant({...val, agent: session?.user?.id})
    // const inhabitant = new Inhabitant({...val})
    await inhabitant.save()

    return NextResponse.json({ inhabitant }, { status: 201 })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: "Failed to update inhabitant" }, { status: 500 })
  }
}
