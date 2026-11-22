'use server'
import { connectToDB } from "@utils/database"
import Notification from "@models/notification"
import {auth} from '@auth'
import DeviceToken from '@models/deviceToken'
import User from '@models/user'

type UserWithRole = {
  id: string;
  role?: string;
  [key: string]: any;
};
type Notification = {
  isReport?: boolean,
  listingId?: string,
}

export const markAsRead = async(notificationId:string) => {
 
 
    const userId = (await auth())?.user?.id
 
     try {
await connectToDB()
const notification = await Notification.findOne({_id: notificationId})
 const isRead = notification?.readBy.includes(userId)
if (!isRead) {
  await Notification.updateOne(
    { _id: notificationId },
    { $addToSet: { readBy: userId } },
    { new: true, runValidators: true }
  );
} else {return}

     }

     catch(err) {
        console.log(err)
     }
}


export const clearAllNotifications = async({isReport,listingId}: Notification = {}) => {
  const session = await auth() as UserWithRole | null
  const userId = session?.user?.id
  const role = session?.user?.role

  try {
    // clear All

    await connectToDB()
    await Notification.deleteMany({userId: userId})
  
  // deleting type of report listing  
  if (isReport) {
  await Notification.deleteMany({listingId,type:'report_listing'})
  }
    //clear batch
     await Notification.updateMany(
    {mode: `broadcast-${role}`},
    {$addToSet:{ clearedBy: userId}},
    { new: true, runValidators: true }
  )
  }  catch (err) {
 console.error(err)
  }
}

export const clearSingleNotification = async(notificationId:string,isReport=false,listingId?:string) => {
  const userId = (await auth())?.user?.id

  try {
    await connectToDB()
    if (isReport) {
    await Notification.deleteOne({_id: notificationId, listingId, type:'report_listing'})
  }
    await Notification.deleteOne({_id: notificationId, userId: userId})
    await Notification.updateOne(
      {_id: notificationId},
      {$addToSet: {clearedBy: userId}},
      { new: true, runValidators: true } 
    )    
  } catch (err) {
    console.log(err)
  }
}

export const sendNotification = async(val:any) => {
  await connectToDB()
  try {
 const newNotification = new Notification({
    ...val
  })
await newNotification.save()
 if (val.userId && val.push !== false) {
   try {
     const recipient = await User.findById(val.userId).select("settings.notifications.messages").lean()
     if (recipient?.settings?.notifications?.messages === false) return
     const devices = await DeviceToken.find({ user: val.userId }).select("token").lean()
     if (devices.length) {
       const { cert, getApps, initializeApp } = await import("firebase-admin/app")
       const { getMessaging } = await import("firebase-admin/messaging")
       const adminApp = getApps()[0] || initializeApp({ credential: cert({
         projectId: process.env.FIREBASE_PROJECT_ID,
         clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
         privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
       }) })
       await getMessaging(adminApp).sendEachForMulticast({
         tokens: devices.map((device) => device.token),
         notification: { title: "First Estates", body: val.message || "You have a new notification" },
         data: { type: String(val.type || "notification"), listingId: String(val.listingId || "") },
       })
     }
   } catch (error) {
     if (process.env.FCM_SERVER_KEY) {
       try {
         const devices = await DeviceToken.find({ user: val.userId }).select("token").lean()
         if (devices.length) await fetch("https://fcm.googleapis.com/fcm/send", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `key=${process.env.FCM_SERVER_KEY}` }, body: JSON.stringify({ registration_ids: devices.map((device) => device.token), notification: { title: "First Estates", body: val.message || "You have a new notification" }, data: { type: val.type || "notification", listingId: val.listingId || "" } }) })
       } catch (fallbackError) { console.error("FCM legacy fallback failed", fallbackError) }
     } else console.error("Firebase Admin push skipped", error)
   }
 }
  } catch(err) {
   console.log(err)
  }
}

