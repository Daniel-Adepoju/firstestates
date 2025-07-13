import { connectToDB } from "@utils/database"
import Listing from "@models/listing"
import Notification from "@api/models/notification"
import { NextResponse } from "next/server"
import { incrementView } from "@lib/server/incrementView"

export const GET = async (req, {params}) => {
  const listingId = (await params).id
  const agent = (await params).agent
  try {
    await connectToDB()
 
    const post = await Listing.findById(listingId).populate(['agent'])
  if (!post) return new Response('Not found', { status: 404 });
    await incrementView(listingId)
    if (!agent) {
    await Listing.updateOne(
      { _id: listingId },
      { $inc: { totalViews: 1 } }
    )
  }

  const reports = await Notification.find({
    listingId: listingId,
    type: 'report_listing'
  })

  return NextResponse.json({post,reports}, { status: 200 }) 
  } catch (err) {
    console.log(err)
    return NextResponse.json(err, { status: 500}) 
  }
}
