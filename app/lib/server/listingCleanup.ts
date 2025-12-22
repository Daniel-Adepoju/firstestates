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

  // Start a fresh session for this listing
  const session = await mongoose.startSession()
  try {
    session.startTransaction()

    // Sequential deletes to ensure transaction consistency
    await Request.deleteMany({ listing: listingId }, { session })
    await Comment.deleteMany({ listing: listingId }, { session })
    await Wishlist.deleteMany({ listing: listingId }, { session })
    await Appointment.deleteMany({ listingID: listingId }, { session })
    await Inhabitant.deleteMany({ listing: listingId }, { session })
    await Listing.deleteOne({ _id: listingId }, { session })

    // Commit transaction
    await session.commitTransaction()
  } catch (err) {
    await session.abortTransaction()
    throw err
  } finally {
    session.endSession()
  }

  // External side-effects after transaction is safely committed
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
}
