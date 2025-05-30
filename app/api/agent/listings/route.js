import { connectToDB } from "@utils/database"
import Listing from "@models/listing"
import { NextResponse } from "next/server"

export const GET = async (req) => {
const {searchParams} = new URL(req.url)
const agentId = searchParams.get('id')
 const page = searchParams.get('page') || 1
  const limit =  Number(searchParams.get('limit')) ||  10
 const skipNum = Number((page- 1) * Number(limit))
   let cursor = Number(page)

  try {
    await connectToDB()
     let totalDocs = await Listing.countDocuments({agent: agentId})
     let currentRentings = await Listing.countDocuments({agent: agentId, status: "rented"})
     console.log(totalDocs)
    const listings = await Listing.find({agent: agentId}).populate(["agent"]).skip(skipNum).limit(limit).sort('-createdAt')
    const numOfPages = Math.ceil(totalDocs/ Number(limit))
    if (cursor >= numOfPages) {
      cursor = numOfPages
    }
 
 return NextResponse.json({listings,currentListings:totalDocs,currentRentings,cursor,numOfPages}, { status: 200 }) 
  } catch (err) {
    console.log(err)
    return NextResponse.json(err, { status: 500}) 
  }
}
