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
      {data?.pages[0].notifications.length > 0 ? (
        <div onClick={() => notificationMutation.mutate()} className="hover:underline self-start cursor-pointer dark:text-red-400 text-red-600">
          {notificationMutation.isPending ? 'Clearing' :  'Clear All'}
        </div>
      ) : (
        <div className='subheading flex flex-col gap-4 items-center'>
          No Notifications
          <FileX size={160} color='#f29829'/>
        </div>
      )}
  {/* <div className='nobar w-full overflow-y-scrol flex flex-col gap-3 pb-3'> */}
    {mappedNotifications}
         
  
  {/* </div> */}
    {isFetchingNextPage && <Loader2
        color={darkMode ? "white" : '#0874c7'} 
        size={30} className="animate-spin  my-3" />}
    </>
  );
}

export default NotificationList