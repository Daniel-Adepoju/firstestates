import { connectToDB } from "@utils/database"
import Listing from "@models/listing"
import { NextResponse } from "next/server"

export const GET = async (req, {params}) => {
  const listingId = params.id
  try {
    await connectToDB()
    const post = await Listing.findById(listingId).populate(['agent'])
 return NextResponse.json(post, { status: 200 }) 
  } catch (err) {
    console.log(err)
    return NextResponse.json(err, { status: 500}) 
  }
}
