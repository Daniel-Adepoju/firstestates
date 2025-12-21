import Listing from "@models/listing"
import Request from "@models/request"
import Comment from "@models/comment"
import Wishlist from "@models/wishlist"
import Appointment from "@models/appointment"
import Inhabitant from "@models/inhabitant"
import { sendNotification } from "./notificationFunctions"
import { deleteImage, deleteMultipleImages } from "./deleteImage"

import mongoose from "mongoose"

export async function cleanupListing(
  listingId: mongoose.Types.ObjectId | string,
  options?: {
    notify?: boolean
    reason?: "manual" | "expired" | "admin"
  }
) {
  const listing = await Listing.findById(listingId)
  if (!listing) return

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    await Promise.all([
      Request.deleteMany({ listing: listingId }, { session }),
      Comment.deleteMany({ listing: listingId }, { session }),
      Wishlist.deleteMany({ listing: listingId }, { session }),
      Appointment.deleteMany({ listingID: listingId }, { session }),
      Inhabitant.deleteMany({ listing: listingId }, { session }),
      Listing.deleteOne({ _id: listingId }, { session }),
    ])

    await session.commitTransaction()
    session.endSession()

    // External side-effects AFTER DB commit
    await deleteImage(listing.mainImage)
    await deleteMultipleImages(listing.gallery)

    if (options?.notify) {
      await sendNotification({
        type: "Listing_Deleted",
        recipientRole: "agent",
        message:
          options.reason === "expired"
            ? `Your listing at ${listing.location} has expired`
            : `You deleted a listing at ${listing.location}`,
        userId: listing.agent._id,
        listingId,
      })
    }
  } catch (err) {
    await session.abortTransaction()
    session.endSession()
    throw err
  }
}
