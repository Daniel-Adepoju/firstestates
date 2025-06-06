import React from "react"

interface Notification {
  _id: string
  type: string
  message: string
  read: boolean
  createdAt: string // ISO date
}

interface NotificationCardProps {
  notification: Notification
  onMarkAsRead?: (id: string) => void
  onDelete?: (id: string) => void
}

const NotifcationCard = ({ notification }: NotificationCardProps) => {
  return (
    <div
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
            ${
              notification.read
                ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                : "bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-200"
            }
          `}
        >
          {notification.type} kk
        </span>
        <p className="text-sm text-gray-700 dark:text-gray-300">{notification.message}</p>
      </div>

      {/* Right side: Date and Actions */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">
         
        </span>
        {!notification.read && (
          <button
            // onClick={() => onMarkAsRead(notification._id)}
            className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Mark as Read
          </button>
        )}
  
          <button
            // onClick={() => onDelete(notification._id)}
            className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
      </div>
    </div>
  )
}

export default NotifcationCard
