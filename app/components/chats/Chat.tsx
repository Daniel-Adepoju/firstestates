"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import { User2 } from "lucide-react"
import { useUser } from "@utils/user"
import type { Models } from "appwrite"
import { useSearchParams } from "next/navigation"
import Inbox from "./Inbox"
import ChatLoading from "./ChatLoading"
import { groupMessagesByDate } from "@utils/date"
import MessageList from "./MessageList"
import Guidelines from "./Guidelines"
import ChatInput from "./ChatInput"
import Link from "next/link"
import { useGetChats } from "@lib/customApi"
import { axiosdata } from "@utils/axiosUrl"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export default function Chat() {
  const queryClient = useQueryClient()
  // users
  const { session } = useUser()
  const userId = session?.user.id
  const conversationId = useSearchParams().get("conversationId")
  const receiverId = useSearchParams().get("receiverId")

  // loading states
  const [text, setText] = useState("")
  const [reply, setReply] = useState<any>("")
  const [showId, setShowId] = useState("")

  // fetching more states
  const topSentinelRef = useRef<HTMLDivElement>(null)

  // solving unread states
  const unreadObserver = useRef<IntersectionObserver | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const unreadCountRef = useRef<number | null>(null)
  const lastReadMessageId = ""
  const lastReadRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // scroll on send
  const newMessageRef = useRef<Models.Document | null>(null)

  const { data, isLoading, isFetchingNextPage, hasNextPage } = useGetChats({
    receiverId: receiverId!,
    senderId: userId!,
  })

  // Message mapping
  const messages = data?.pages.flatMap((page) => page.messages) || []
  const groupedMessages = groupMessagesByDate(messages)
  const flatMessages = Object.values(groupedMessages).flat()
  console.log({ data })
  // Mutations

  const sendMessageMutation = useMutation({
    mutationFn: async (data: any) => {
      await axiosdata.value.post("api/chats", data)
    },
    onSuccess: () => {
      // setSending(false)
      queryClient.invalidateQueries({ queryKey: ["chat"] })
    },
  })

  const handleSendMessage = async () => {
    if (!text.trim() || !userId) return
    console.log("click btn")
    sendMessageMutation.mutate({
      conversationId: conversationId!,
      text,
      senderId: userId,
      receiverId: receiverId,
      reply: reply.trim().length > 0 ? reply : null,
    })
    setText("")
  }

  // console.log({ groupedMessages, messages })
  // renders
  if (isLoading) return <ChatLoading />

  if (!userId || !session) {
    return (
      <div className="w-full items-center justify-center flex flex-col gap-6 my-40">
        <User2
          size={40}
          className="text-gray-700 dark:text-gray-200"
        />

        <div className="mx-auto flex items-center justify-center gap-2 text-xl text-center">
          <span className="text-md text-gray-700 dark:text-gray-200">To use our chat feature </span>
          <Link
            href="/login"
            className="text-sm font-medium mx-1 px-4 py-1.5 rounded-xl text-white bg-goldPrimary"
          >
            Log in
          </Link>
        </div>
      </div>
    )
  }

  if (userId === receiverId) {
    return (
      <div className="text-xl font-bold text-center mt-40 text-gray-600 dark:text-white">
        You can't chat with yourself
      </div>
    )
  }

  return (
    <div className="flex gap-1 w-full h-screen  xl:h-screen overflow-hidden">
      <div className="hidden md:block flex-1 w-[30%]">
        <Inbox topMargin="0" />
      </div>

      <div className=" flex-1 flex flex-col w-full border rounded-xl p-4 mx-auto bg-white dark:bg-black/20 nobar null">
        <div
          ref={containerRef}
          className="nobar null w-[98%] flex-1 flex flex-col overflow-y-auto space-y-2 mb-4"
        >
          {/* {messages.length > 0 && !loading && !unreadLoading && Number(unreadCount) > 0 && ( */}
          <div ref={topSentinelRef} />
          {/* )} */}
          <MessageList
            groupedMessages={groupedMessages}
            messagesEndRef={messagesEndRef}
            topSentinelRef={topSentinelRef}
            containerRef={containerRef}
            loadingMore={isFetchingNextPage}
            lastReadMessageId={lastReadMessageId}
            lastReadRef={lastReadRef}
            // firstUnreadId={firstUnreadId}
            unreadCountRef={unreadCountRef}
            // unreadCount={unreadCount}
            userId={userId}
            showId={showId}
            setShowId={setShowId}
            receiverId={receiverId}
          />
          <div
            className="h-1"
            ref={messagesEndRef}
          />
        </div>
        <Guidelines />

        <ChatInput
          text={text}
          setText={setText}
          handleSendMessage={handleSendMessage}
          sending={sendMessageMutation.isPending}
          reply={reply}
          setReply={setReply}
        />
      </div>
    </div>
  )
}
