import { connectToDB } from "@utils/database"
import Listing from "@models/listing"
import Request from "@models/request"
import Inhabitant from "@models/inhabitant"
import { auth } from "@auth"
import Notification from "@api/models/notification"
import { NextResponse } from "next/server"
import { incrementView } from "@lib/server/incrementView"

export const GET = async (req, { params }) => {
  const { searchParams } = new URL(req.url)
  const listingId = (await params).id
  const agent = searchParams.get("agent") === "true"

  try {
    await connectToDB()

    // check if user is a resident
    const session = await auth()
    let isUserResident = false
    let hasUserMadeRequest = false

    // check if user is an inhabitant
    if (session?.user?.id) {
      isUserResident = await Inhabitant.exists({
        user: session.user.id,
        listing: listingId,
      })
    }

    // check if user has made a request
    if (session?.user?.id) {
      hasUserMadeRequest = await Request.exists({
        requester: session.user.id,
        listing: listingId,
      })
    }

    // fetch listing
    const post = await Listing.findById(listingId).populate(["agent"])
    if (!post) return new Response("Not found", { status: 404 })

    // increment views only for non-agents
    await incrementView(listingId)
    if (!agent) {
      await Listing.updateOne({ _id: listingId }, { $inc: { totalViews: 1 } })
    }

    const reqAgg = await Request.aggregate([
      {
        $match: {
          listing: post._id,
          status: "accepted",
        },
      },
      {
        $group: {
          _id: "$listing",
          roommate: {
            $sum: {
              $cond: [{ $eq: ["$requestType", "roommate"] }, 1, 0],
            },
          },
          coRent: {
            $sum: {
              $cond: [{ $eq: ["$requestType", "co-rent"] }, 1, 0],
            },
          },
        },
      },
    ])

    const requestCounts =
      reqAgg.length > 0
        ? {
            roommate: reqAgg[0].roommate,
            coRent: reqAgg[0].coRent,
          }
        : {
            roommate: 0,
            coRent: 0,
          }

    // fetch reports
    const reports = await Notification.find({
      listingId: listingId,
      type: "report_listing",
    })

    // attach counts
    const finalPost = {
      ...post.toObject(),
      requestCounts,
      isUserResident,
      hasUserMadeRequest,
    }

    return NextResponse.json({ post: finalPost, reports }, { status: 200 })
  } catch (err) {
    console.log(err)
    return NextResponse.json(err, { status: 500 })
  }
}
