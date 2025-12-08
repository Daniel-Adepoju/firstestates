"use client"
import { useGetUser } from "@lib/customApi"
import { CldImage } from "next-cloudinary"
import { Skeleton } from "../ui/skeleton"
import { useEffect, useState } from "react"
import { getUnreadChatsInConversation } from "@/lib/server/chats"
import { Models } from "appwrite"
import { client } from "@lib/server/appwrite"

type ConversationRowProps = {
  convo: {
    $id: string
    userIds: string[]
    lastMessage?: string
  }
  currentUserId: string
  onClick: (otherId: string) => void
}

export default function ConversationRow({ convo, currentUserId, onClick }: ConversationRowProps) {
  const otherId = convo.userIds.find((id) => id !== currentUserId)
  const [unreadMessages, setUnreadMessages] = useState("")
  const { data: user, isLoading } = useGetUser({
    id: otherId,
    enabled: !!otherId,
    page: "1",
    limit: 1,
  })
  const [newLastMessage, setNewLastMessage] = useState("")

  const getUnread = async () => {
    const res = await getUnreadChatsInConversation(convo.$id, currentUserId)
    setUnreadMessages(res)
  }

  useEffect(() => {
    if (!currentUserId) return
    getUnread()

    const unsubscribe = client.subscribe(
      `databases.${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_APPWRITE_CONVERSATIONS_ID}.documents`,
      (res) => {
        const newMsg = res.payload as Models.Document
        if (newMsg.$id !== convo.$id) return

        if (res.events.some((e) => e.includes("create"))) {
          setNewLastMessage(newMsg.lastMessage)
        }

        if (res.events.some((e) => e.includes("update"))) {
          setNewLastMessage(newMsg.lastMessage)
        }

        if (res.events.some((e) => e.includes("delete"))) {
          setNewLastMessage("Message Deleted")
        }
        getUnread()
      }
    )

    return () => unsubscribe()
  }, [currentUserId])

  return (
    <div
      className="relative p-3 bg-black/5 dark:bg-gray-700/40 rounded-md
      border-1 border-transparent border-t-gray-500/30 cursor-pointer
       hover:bg-gray-400/20 dark:hover:bg-gray-500/20"
      onClick={() => otherId && onClick(otherId)}
    >
      <div className="flex items-center">
        {isLoading ? (
          <Skeleton className=" gap-4 w-10 h-10 rounded-full bg-gray-500/20" />
        ) : (
          <CldImage
            src={user?.profilePic}
            width={40}
            height={40}
            alt="profilePic"
            crop={"auto"}
            className="rounded-full"
          />
        )}
        <div className="font-medium ml-1 dark:text-gray-300 text-gray-500">
          {isLoading ? (
            <Skeleton className="w-32 h-4  bg-gray-500/20" />
          ) : (
            user?.username || "Unknown User"
          )}
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 truncate">
        {isLoading ? (
          <Skeleton className="ml-1 w-32 h-4 bg-gray-500/20" />
        ) : newLastMessage ? (
          newLastMessage
        ) : (
          convo.lastMessage
        )}
      </div>
      {unreadMessages && unreadMessages !== "0" && (
        <div className="absolute right-5 top-5 flex flex-col items-center">
          <h6 className="text-xs dark:text-gray-300 text-gray-500 ">New</h6>
          <div
            className="
       w-6 h-6 flex itemms-center justify-center
      text-md font-bold text-white dark:gold-gradient darkblue-gradient rounded-full"
          >
            {parseInt(unreadMessages) > 9 ? "9+" : unreadMessages}
          </div>
        </div>
      )}
    </div>
  )
}
