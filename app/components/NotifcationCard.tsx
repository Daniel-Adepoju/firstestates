import { Check, CheckCheck } from "lucide-react"
import { useDarkMode } from '@lib/DarkModeProvider'; 
import { createdAt } from "@utils/date";
import { useNextPage } from "@lib/useIntersection";
import { useObserveRead } from "@lib/useIntersection";
import { useUser } from "@utils/user";
import { clearSingleNotification } from "@lib/server/notificationFunctions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CldImage } from "next-cloudinary";
import {useState} from "react";

export interface Notification {
  _id: string
  type: string
  message: string
  read: boolean
    readBy: [string]
  createdAt: string 
  thumbnail: string
}

interface NotificationCardProps {
  notification: Notification
  onMarkAsRead?: (id: string) => void
  onDelete?: (id: string) => void
  refValue: ReturnType<typeof useNextPage> | null
  page: number
}

const NotifcationCard = ({ notification,refValue,page }: NotificationCardProps) => {
  const {session} = useUser()
  const userId = session?.user.id
  const {darkMode} = useDarkMode()
  const date = createdAt(notification.createdAt)
  const readRef = useObserveRead(page,userId)
  const isRead = notification?.readBy.includes(userId)
  const queryClient = useQueryClient()
  const [noImage, setNoImage] = useState(false)

  const deleteMutation = useMutation({
    mutationKey:['notifMutate'],
    mutationFn: async (id: string) => {
      await clearSingleNotification(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['notifications']})
    },
  })

  return (
    <div
      ref={refValue}
      className={`
        w-full
        p-4
        rounded-lg
        border
        shadow-sm
        flex
        flex-col
        items-start
        justify-between
        gap-4
       bg-white dark:bg-gray-600 border-gray-200 dark:border-gray-600
      `}
    >
      {/* Left side: Icon + Type + Message */}
      <div className="w-full flex flex-col gap-2">
        <span
          className={`
           w-full
            text-xs
            font-semibold
            uppercase
            tracking-wide
            px-2
            py-1
            rounded
            text-center
          bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300`}
        >
          {notification.type}
        </span>
        <div className=" flex flex-row items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
       
         {notification.thumbnail &&
          <div className="cursor-pointer">
      {!notification.thumbnail.startsWith('http') || notification.thumbnail.startsWith('/images')
      ? <img className='rounded-sm w-25'
      src={notification.thumbnail} 
      alt='kd'/>
    : (
      <>
      {!noImage ? <CldImage
          width={50}
          height={50}
          crop={"auto"}
          alt="notification thumbnail"
          src={notification.thumbnail}
          onError={(e) => {
            setNoImage(true)
          }}
          className="rounded-sm w-25"
        />
        : (
          <img
            className='rounded-sm w-25'
            src={'/icons/noListings.svg'}
            alt='thumbnail'
          />
        )}
      </>
    )
    }
     
      </div>
         }
         <div>{notification.message}</div>
         </div>
      </div>

      <div className="w-full flex items-center gap-2">  
          <button
            onClick={() => deleteMutation.mutate(notification._id)}
            className="clickable text-xs px-4 py-1 bg-red-800 text-white rounded hover:bg-red-700"
          >
            {deleteMutation.isPending? 'Clearing' : 'Clear'}
          </button>
      <span className="text-xs text-gray-400 dark:text-gray-300">
      {date}
        </span>
       <div ref={readRef} data-id={notification._id} className='text-white ml-auto'>
       {!isRead ? <Check size={20} color={darkMode ? "white" : '#0874c7'}/>
        : <CheckCheck size={20} color={darkMode ? "white" : '#0874c7'}/>  }
       </div>
      </div>
    </div>
  )
}

export default NotifcationCard
