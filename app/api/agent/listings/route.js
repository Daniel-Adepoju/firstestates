import { connectToDB } from "@utils/database"
import Listing from "@models/listing"
import { NextResponse } from "next/server"

export const GET = async (req) => {
const {searchParams} = new URL(req.url)
const agentId = searchParams.get('id')

  try {
    await connectToDB()
    const listings = await Listing.find({agent: agentId}).populate(["agent"]).sort('-createdAt')
 return NextResponse.json({listings}, { status: 200 }) 
  } catch (err) {
    console.log(err)
    return NextResponse.json(err, { status: 500}) 
  }
}
