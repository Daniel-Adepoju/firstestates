
import { connectToDB } from "@utils/database"
import Listing from "@models/listing"
import { NextResponse } from "next/server"

export const GET = async () => {
  try {
    await connectToDB()
    const popularListings = await Listing.find().limit(10).sort('-weeklyViews')
   return NextResponse.json({popularListings}, { status: 200 }) 
  } catch (err) {
    console.log(err)
    return NextResponse.json(err, { status: 500}) 
  }
}
