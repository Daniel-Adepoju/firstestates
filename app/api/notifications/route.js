import { connectToDB } from "@utils/database"
import { NextResponse } from "next/server"
import Notification from "@models/notification"
import { auth } from "@auth"


export const GET = async (req) => {
  const {searchParams} = new URL(req.url)
  const page = searchParams.get('page') || 1
  const limit =  Number(searchParams.get('limit')) ||  10
  const skipNum = Number((page- 1) * Number(limit))
  let cursor = Number(page)

  try {
    const session = await auth()
    const userId = session.user.id;
   const userRole = session.user.role;
    const searchOptions = [
        { userId: userId},
       
        {
        clearedBy:{$ne:userId},
        recipientRole: userRole,
        mode: `broadcast-${userRole}`
      }
    ]
    await connectToDB()

    const unreadNotifications = await Notification.countDocuments({
        $or:searchOptions,
        readBy:{$ne:userId}
    })
 
    const notificationsCount = await Notification.countDocuments({$or:searchOptions})
    const numOfPages = Math.ceil(notificationsCount / Number(limit))
   
    if (cursor >= numOfPages) {
      cursor = numOfPages
    }

 const notifications = await Notification.find({$or:searchOptions}).skip(skipNum).limit(limit).sort('-createdAt')

 return NextResponse.json({notifications,cursor,numOfPages,unreadNotifications}, { status: 200 }) 
  } catch (err) {
    console.log(err)
    return NextResponse.json(err, { status: 500}) 
  }
}


