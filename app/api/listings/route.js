import { connectToDB } from "@utils/database"
import Listing from "@models/listing"
import { NextResponse } from "next/server"

export const GET = async (req) => {
const {searchParams} = new URL(req.url)
  const page = searchParams.get('page') || 1
  const limit =  Number(searchParams.get('limit')) ||  10
  const search = searchParams.get('search') || ''
  const skipNum = Number((page- 1) * Number(limit))
  let cursor = Number(page)
  let content = {
    location: { $regex: search, $options: "i" },
  }

  try {
    await connectToDB()
    const postsDeets = await Listing.find() 
    const numOfPages = Math.ceil(postsDeets.length / Number(limit))
    if (cursor >= numOfPages) {
      cursor = undefined
    }

    let postsConfig = Listing.find({ $or: [content] }).populate(["agent"])
    postsConfig = postsConfig.skip(skipNum).limit(limit)

    const posts = await postsConfig
 return NextResponse.json({posts,cursor}, { status: 200 }) 
  } catch (err) {
    console.log(err)
    return NextResponse.json(err, { status: 500}) 
  }
}
