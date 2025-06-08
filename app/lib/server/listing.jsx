"use server"
import { connectToDB } from "@utils/database"
import Listing from "@models/listing"
import { auth } from "@auth"
import { revalidatePath } from "next/cache"
import { deleteImage, deleteMultipleImages } from "./deleteImage"
import { sendNotification } from "./notificationFunctions"


export const createListing = async (val) => {
  const session = await auth()
  const userId = session?.user.id
  const newVal = { ...val, agent: userId }
  await connectToDB()
  try {
    if (!userId) {
      return {message:"Unauthorized", status:"danger"};
    }

    const newListing = new Listing(newVal)
    await newListing.save()
      await sendNotification({
      type: "New_Listing",
      recipientRole: "agent",
      message: `You created a new listing`,
      userId,
      thumbnail: val.mainImage,
    })
    return { message: "Created Successfully", status: "success" }
  } catch (err) {
    await deleteImage(val.mainImage)
    await deleteMultipleImages(val.gallery)
    return { message: "Unable To Create,Refresh And Try Again", status: "danger" }
  }
}

export const editListing = async (val, userId) => {
  try {
    await connectToDB()
    const newVal = { ...val }
    await Listing.findOneAndUpdate({ _id: val.id },
      newVal,
      {
      new: true,
      runValidators: true,
    })
    // if(val.status === 'rented') {
    //     await sendNotification({
    //   type: "Listing_Edited",
    //   recipientRole: "agent",
    //   message: `You Rented a listing`,
    //   userId,
    //   thumbnail: val.mainImage,
    // })
    // } 
    await sendNotification({
      type: "Listing_Edited",
      recipientRole: "agent",
      message: `You edited a listing`,
      userId,
      thumbnail: val.mainImage,
    })
  
    // revalidatePath("/agent/listings")
    return { message: "Edited Successfully", status: "success" }
  } catch (err) {
    return { message: "Unable To Edit,Refresh And Try Again", status: "danger" }
  }
}

export const deleteListing = async (id) => {
  try {
    await connectToDB()

    const listing = await Listing.findOne({ _id: id })

    if (!listing) {
      throw new Error("Listing not found")
    }

    if (listing.status === "rented") {
      console.log("hahah")
      return { message: `You can't delete a rented listing`, status: "warning" }
    } 
    await Listing.deleteOne({ _id: id })
    await deleteImage(listing.mainImage)
    await deleteMultipleImages(listing.gallery)
    await sendNotification({
      type: "Listing_Deleted",
      recipientRole: "agent",
      message: `You deleted a listing at ${listing.location}`,
      userId: listing.agent._id,
    })
    revalidatePath('/agent/listings')
    return { message: "Deleted Successfully", status: "success" }
   
  } catch (err) {
    return { message: "Unable To Delete,Refresh And Try Again", status: "danger" }
  }
}
