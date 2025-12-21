import { connectToDB } from "@utils/database"
import Listing from "@models/listing"
import {cleanupListing} from "@lib/server/listingCleanup"
import { sendNotification } from "@lib/server/notificationFunctions"

export const GET = async (req) => {
const ONE_DAY = 86400 * 1000

const warnedListings = await Listing.find({
  validUntil: {
      $lte: new Date(now),
      $gt: new Date(now - ONE_DAY),
    },
  status: { $ne: "rented" },
  expiringWarningSent: false,
})

const expiredListings = await Listing.find({
  validUntil: { $lt: new Date(Date.now() - ONE_DAY) },
  status: { $ne: "rented" },
}).select("_id")

  for (const listing of expiredListings) {
    await cleanupListing(listing._id, {
      notify: true,
      reason: "expired",
    })
  }

  for (const listing of warnedListings) {
  await sendNotification({
      type: "Expiration_Warning",
      recipientRole: "agent",
      message: `Your listing at ${listing.location} will expire soon, please renew it.`,
      userId: listing.agent,
      listingId: listing._id,
    })

    // Mark as notified
    listing.expiringWarningSent = true
    await listing.save()
  }

   return NextResponse.json({
    warned: warnedListings.length,
    expired: expiredListings.length,
  })
}