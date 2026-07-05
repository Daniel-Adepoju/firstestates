"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@utils/user"
import { getUserConversations } from "@/lib/server/chats"
import type { Models } from "appwrite"
import { CldImage } from "next-cloudinary"
import { MoreHorizontal, FileX } from "lucide-react"
import ConversationRow from "./ConversationRow"
import { Skeleton } from "../ui/skeleton"
import { useGetConversations } from "@lib/customApi"

type InboxProps = {
  topMargin?: string
  height?: string
}

export default function Inbox({ topMargin, height }: InboxProps) {
  const { session } = useUser()
  const userId = session?.user.id
  const router = useRouter()

  const { data, isLoading, isError, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetConversations({
      userId,
    })

  const conversations = data?.pages.flatMap((data) => data.conversations) || []

  const openChat = (receiverId: string, userId: string) => {
    router.push(`/chat?senderId=${userId}&receiverId=${receiverId}&`)
  }

  return (
    <div
      className={`${topMargin} h-screen  overflow-hidden w-full mx-auto nobar null bg-white dark:bg-black/20 shadow rounded-lg`}
    >
      <div className="ml-2 py-2 mb-2 flex flex-row items-center gap-2 border-2 border-transparent border-b-gray-500/20 dark:border-b-gray-900/70">
        {session?.user.profilePic ? (
          <CldImage
            width={45}
            height={45}
            crop="auto"
            src={session?.user.profilePic}
            alt="profile pic"
            className="rounded-full"
          />
        ) : (
          <Skeleton className="w-10 h-10 rounded-full animate-none bg-gray-500/20" />
        )}
        <h2 className="otherHead  text-center text-lg lg:text-xl font-semibold">Chats</h2>
      </div>
      <div className="space-y-3 p-2 overflow-y-scroll h-full nobar null">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                className="w-[98%] h-18 rounded-lg animate-none bg-gray-500/20 p-3 
            "
              />
            ))
          : conversations.map((convo) => (
              <ConversationRow
                key={convo._id}
                convo={convo}
                currentUserId={userId}
                handleOpenChat={(otherId: string) => openChat(otherId, userId)}
              />
            ))}

        {!isLoading && userId && conversations.length === 0 && (
          <div className="flex flex-col gap-1 items-center justify-center w-50 mt-40  text-gray-400 mx-auto">
            <FileX
              size={60}
              className="text-goldPrimary text-lg"
            />
            <span className="text-md"> No conversations yet.</span>
          </div>
        )}
      </div>
    </div>
  )
}
