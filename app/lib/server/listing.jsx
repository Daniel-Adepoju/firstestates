"use server"
import { connectToDB } from "@utils/database"
import Listing from "@models/listing"
import Comment from "@models/comment"
import Appointment from "@models/appointment"
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

export const editListing = async (val, userId, extras=false) => {
  try {
    await connectToDB()
    const newVal = { ...val }
   const listing = await Listing.findOneAndUpdate({ _id: val.id },
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

    if (!extras){
    await sendNotification({
      type: "Listing_Edited",
      recipientRole: "agent",
      message: `You edited a listing`,
      userId,
      thumbnail: val.mainImage,
      listingId: val.id,
    })
     return { message: "Edited Successfully", status: "success" }
  }
   
   return { message: "Successful", status: "success" }
  } catch (err) {
    if(!extras) {
     return { message: "Unable To Edit,Refresh And Try Again", status: "danger" } 
    } else {
      return { message: "Failed", status: "danger" }
    }
    
  }
}

export const markAsFeatured = async (val, userId) => {
  try {
    await connectToDB()
    const newVal = { ...val }
   const listing = await Listing.findOne({ _id: val.id })
    await Listing.findOneAndUpdate({ _id: val.id },
      newVal,
      {
      new: true,
      runValidators: true,
    })
 
    await sendNotification({
      type: "Listing_Edited",
      recipientRole: "agent",
      message: `You marked a listing as featured`,
      userId,
      thumbnail: listing.mainImage,
      listingId: val.id,
    })
  
    return { message: "Successful", status: "success" }
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
      return { message: `You can't delete a rented listing`, status: "warning" }
    } 
    await Listing.deleteOne({ _id: id })
    await Comment.deleteMany({ listing: id })
    await Appointment.deleteMany({listingID:id})
    await deleteImage(listing.mainImage)
    await deleteMultipleImages(listing.gallery)

    await sendNotification({
      type: "Listing_Deleted",
      recipientRole: "agent",
      message: `You deleted a listing at ${listing.location}`,
      userId: listing.agent._id,
      listingId: id,
    })

    revalidatePath('/agent/listings')
    return { message: "Deleted Successfully", status: "success" }
   
  } catch (err) {
    return { message: "Unable To Delete,Refresh And Try Again", status: "danger" }
  }
}

export const sendComment = async (val) => {
  const session = await auth()
  const userId = session?.user.id
  if (!userId) {
    return { message: "Unauthorized", status: "danger" }
  }
  try {
    await connectToDB()
    const newVal = { ...val, author: userId }
    const listing = await Listing.findOne({ _id: val.listing})
    if (!listing) {
      return { message: "Listing not found", status: "warning" }
    }
    const newComment = new Comment(newVal)
    await newComment.save()
    await sendNotification({
      type: "New_Comment",
      recipientRole: "agent",
      message: `You have a new comment on your listing at ${listing.location}`,
      userId: listing.agent._id,
      thumbnail: listing.mainImage,
      listingId: listing._id,
    })
    return { message: "Commented Successfully", status: "success" }
  } catch (err) {
    return { message: "Unable To Comment,Refresh And Try Again", status: "danger" }
  }
}

export const reportListing = async (val) => {
   if (!val?.listingId || !val?.sentBy) {
    return { message: "Invalid data sent", status: "danger" }
  }

  try {
    await connectToDB()
    const listing = await Listing.findOne({ _id: val.listingId})
    if (!listing) {
      return { message: "Listing not found", status: "warning" }
    }
    // if (listing.reportedBy.includes(val.sentBy)) {
    //   return { message: "You have already reported this listing", status: "warning" }
    // }
    await Listing.updateOne({ _id: val.listingId }, { $addToSet: { reportedBy: val.sentBy }})

    await sendNotification(val)
    
    return { message: "Reported Successfully", status: "success" }
  } catch (err) {
    return { message: "Unable To Report,Refresh And Try Again", status: "danger" }
  }
}