'use client'
import { useDarkMode } from '@lib/DarkModeProvider';
import { useState } from "react";
import NotifcationCard from "./NotifcationCard";
import { useGetNotifications } from "@lib/customApi";
import { Notification } from "./NotifcationCard";
import { Loader } from '@utils/loaders';
import { FileX, Loader2 } from "lucide-react";
import {useNextPage} from '@lib/useIntersection'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clearAllNotifications } from '@lib/server/notificationFunctions';
// const data = [
//   {
//     "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e5f" },
//     "recipientRole": "agent",
//     "type": "new_listing",
//     "message": "A new property listing is available for review.",
//     "read": false,
//     "mode": "individual"
//   },
//   {
//     "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e5f" },
//     "recipientRole": "client",
//     "type": "listing_approved",
//     "message": "Your property listing has been approved.",
//     "read": true,
//     "mode": "individual"
//   },
//   {
//     "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e60" },
//     "recipientRole": "admin",
//     "type": "user_reported",
//     "message": "A user has been reported for suspicious activity.",
//     "read": true,
//     "mode": "broadcast"
//   },
//   {
//     "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e61" },
//     "recipientRole": "agent",
//     "type": "new_message",
//     "message": "You have a new message from a client.",
//     "read": false,
//     "mode": "individual"
//   },
//   {
//     "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e62" },
//     "recipientRole": "client",
//     "type": "promotion",
//     "message": "Check out the latest promotions for property listings.",
//     "read": false,
//     "mode": "broadcast"
//   },
//   {
//     "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e63" },
//     "recipientRole": "admin",
//     "type": "system_update",
//     "message": "The system has been updated to version 2.1.",
//     "read": false,
//     "mode": "broadcast"
//   },
//   {
//     "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e64" },
//     "recipientRole": "agent",
//     "type": "task_assigned",
//     "message": "A new task has been assigned to you.",
//     "read": false,
//     "mode": "individual"
//   },
//   {
//     "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e65" },
//     "recipientRole": "client",
//     "type": "listing_expired",
//     "message": "Your property listing has expired.",
//     "read": false,
//     "mode": "individual"
//   },
//   {
//     "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e66" },
//     "recipientRole": "admin",
//     "type": "backup_complete",
//     "message": "Daily database backup completed successfully.",
//     "read": false,
//     "mode": "broadcast"
//   },
//   {
//     "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e67" },
//     "recipientRole": "agent",
//     "type": "listing_reviewed",
//     "message": "A property listing you submitted has been reviewed.",
//     "read": false,
//     "mode": "individual"
//   },
//   {
//     "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e68" },
//     "recipientRole": "client",
//     "type": "new_offer",
//     "message": "A new offer has been made on your property.",
//     "read": false,
//     "mode": "individual"
//   },
//   {
//     "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e69" },
//     "recipientRole": "admin",
//     "type": "server_alert",
//     "message": "High CPU usage detected on the server.",
//     "read": false,
//     "mode": "broadcast"
//   },
//   {
//     "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e70" },
//     "recipientRole": "agent",
//     "type": "payment_received",
//     "message": "A payment has been received for your recent sale.",
//     "read": false,
//     "mode": "individual"
//   },
//   {
//     "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e71" },
//     "recipientRole": "client",
//     "type": "feedback_request",
//     "message": "Please provide feedback on your recent experience.",
//     "read": false,
//     "mode": "individual"
//   },
//   {
//     "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e72" },
//     "recipientRole": "admin",
//     "type": "security_alert",
//     "message": "A new device has logged into an admin account.",
//     "read": false,
//     "mode": "broadcast"
//   },
//   {
//     "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e73" },
//     "recipientRole": "agent",
//     "type": "lead_notification",
//     "message": "You have a new lead assigned to you.",
//     "read": false,
//     "mode": "individual"
//   },
//   {
//     "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e74" },
//     "recipientRole": "client",
//     "type": "account_verified",
//     "message": "Your account has been successfully verified.",
//     "read": false,
//     "mode": "individual"
//   },
//   {
//     "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e75" },
//     "recipientRole": "admin",
//     "type": "scheduled_maintenance",
//     "message": "Scheduled maintenance is planned for tomorrow.",
//     "read": false,
//     "mode": "broadcast"
//   },
//   {
//     "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e76" },
//     "recipientRole": "agent",
//     "type": "bonus_announcement",
//     "message": "Congratulations! You've earned a bonus for outstanding performance.",
//     "read": false,
//     "mode": "individual"
//   },
//   {
//     "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e77" },
//     "recipientRole": "client",
//     "type": "welcome",
//     "message": "Welcome to our property listing app! Explore the features now.",
//     "read": false,
//     "mode": "individual"
//   }
// ]

 

const NotificationList = () => {
  const [page] = useState('1')
  const [limit] = useState(10)
   const {darkMode} = useDarkMode()
   const queryClient = useQueryClient()
 

const {data,isLoading,isFetchingNextPage,fetchNextPage,hasNextPage} = useGetNotifications({page,limit})
 const ref = useNextPage({isLoading,hasNextPage,fetchNextPage})

const mappedNotifications =  data?.pages.flatMap((items) => {
      return ( items.notifications.flatMap((notification: Notification,index:number) => {
        return (
          <div className="w-full" key={notification._id}>
            <NotifcationCard 
            notification={notification}
            refValue={index === items.notifications.length - 1 ? ref : null}
             page={data?.pages.length}
           />
          </div>
        );
      }))
      })

const notificationMutation = useMutation({
  mutationKey:['notifMutate'],
  mutationFn: async () => {
    await clearAllNotifications()
  },
  onSuccess: () => {
    queryClient.invalidateQueries({queryKey: ['notifications']})
  },

  })

  if(isLoading) {
     return <Loader className='my-30'/>
  }
  return (
    <>
     {data?.pages[0].notifications.length > 0 ?
     <div onClick={() => notificationMutation.mutate()} className="hover:underline self-start cursor-pointer dark:text-red-400 text-red-600">
    {notificationMutation.isPending ? 'Clearing' :  'Clear All'}
      </div> :
      <div className='subheading flex flex-col gap-4 items-center'>
        No Notifications
        <FileX size={160} color='#f29829'/>
        </div> }

 {mappedNotifications}
 {isFetchingNextPage && <Loader2
     color={darkMode ? "white" : '#0874c7'} 
     size={30} className="animate-spin  my-3" />}
    </>
  );
}

export default NotificationList