'use server'
import { connectToDB } from "@utils/database"
import Notification from "@models/notification"
import {auth} from '@auth'

type UserWithRole = {
  id: string;
  role?: string;
  [key: string]: any;
};

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


export const clearAllNotifications = async() => {
  const session = await auth() as UserWithRole | null
  const userId = session?.user?.id
  const role = session?.user?.role

  try {
    // clear All

    await connectToDB()
    await Notification.deleteMany({userId: userId})

    //clear batch
     await Notification.updateMany(
    {mode: `broadcast-${role}`},
    {$addToSet:{ clearedBy: userId}},
    { new: true, runValidators: true }
  );
  }  catch (err) {

  }
}

export const clearSingleNotification = async(notificationId:string) => {
  const userId = (await auth())?.user?.id

  try {
    await connectToDB()
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
  } catch(err) {
   console.log(err)
  }
}

