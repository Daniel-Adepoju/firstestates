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

  const unreadBannerRef = useRef<HTMLDivElement | null>(null)
  const didInitialScroll = useRef(false)

  const containerRef = useRef<HTMLDivElement | null>(null)

  // scroll on send
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const shouldScrollToBottomRef = useRef(false)

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
    onSuccess: (message) => {
      // setSending(false)
      // queryClient.setQueryData(
      //   ["chats", userId, receiverId],
      //   (old: any) => {
      //     if (!old) return old

      //     return {
      //       ...old,
      //       pages: old.pages.map((page: any, index: number) => {
      //         // newest page is the last page because you're reversing before returning
      //         if (index !== old.pages.length - 1) return page

      //         return {
      //           ...page,
      //           messages: [...page.messages, message],
      //           total: page.total + 1,
      //         }
      //       }),
      //     }
      //   },
      // )

      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      })
      queryClient.invalidateQueries({ queryKey: ["chats"] })
    },
  })

  const handleSendMessage = async () => {
    if (!text.trim() || !userId) return
    shouldScrollToBottomRef.current = true
    sendMessageMutation.mutate({
      conversationId: conversationId!,
      text,
      senderId: userId,
      receiverId: receiverId,
      replyingTo: reply.trim().length > 0 ? reply : null,
    })
    setText("")
    setReply("")
  }
 console.log(data)
  // scrolling effects

  useEffect(() => {
    if (didInitialScroll.current) return

    if (!messages.length) return

    if (data?.pages[0]?.firstUnreadId) {
      unreadBannerRef.current?.scrollIntoView({
        block: "center",
      })
    } else {
      messagesEndRef.current?.scrollIntoView()
    }

    didInitialScroll.current = true
  }, [messages.length])

  useEffect(() => {
    if (!shouldScrollToBottomRef.current) return

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    })

    shouldScrollToBottomRef.current = false
  }, [messages.length])

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
      <div className="text-xl font-bold text-center mt-40 text-red-500">
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
          className="nobar null w-[99%] flex-1 flex flex-col overflow-y-auto space-y-2 mb-2"
        >
          <MessageList
            groupedMessages={groupedMessages}
            messagesEndRef={messagesEndRef}
            topSentinelRef={topSentinelRef}
            containerRef={containerRef}
            loadingMore={isFetchingNextPage}
            unreadBannerRef={unreadBannerRef}
            userId={userId}
            showId={showId}
            setShowId={setShowId}
            receiverId={receiverId}
            reply={reply}
            setReply={setReply}
            firstUnreadId={data?.pages[0]?.firstUnreadId}
            unreadCount={data?.pages[0]?.unreadCount}
          />
          <div
            className="h-1"
            ref={messagesEndRef}
          />
        </div>

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
