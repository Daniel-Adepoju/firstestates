import { connectToDB } from "@utils/database"
import Listing from "@models/listing"
import { NextResponse } from "next/server"
import { incrementView } from "@lib/server/incrementView"

export const GET = async (req, {params}) => {
  const listingId = (await params).id
  try {
    await connectToDB()
 
    const post = await Listing.findById(listingId).populate(['agent'])
     await incrementView(listingId)
  if (!post) return new Response('Not found', { status: 404 });

  return NextResponse.json(post, { status: 200 }) 
  } catch (err) {
    console.log(err)
    return NextResponse.json(err, { status: 500}) 
  }
}
