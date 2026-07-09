"use client"
import { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react"
import { User2 } from "lucide-react"
import { useUser } from "@utils/user"
import { useSearchParams } from "next/navigation"
import Inbox from "./Inbox"
import ChatLoading from "./ChatLoading"
import { groupMessagesByDate } from "@utils/date"
import MessageList from "./MessageList"
import ChatInput from "./ChatInput"
import Link from "next/link"
import { useGetChats } from "@lib/customApi"
import { axiosdata } from "@utils/axiosUrl"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { client as ably } from "@lib/AblyProvider"
import { useReadChat } from "@lib/customApi"
import { useNextPage } from "@lib/useIntersection"

export default function Chat() {
  // const ably = useAbly()
  const mutateRead = useReadChat()
  const queryClient = useQueryClient()

  const listingId = useSearchParams().get("listingId")
   const [showListing, setShowListing] = useState(true)
  // users
  const { session, status } = useUser()
  const userId = session?.user.id
  const conversationId = useSearchParams().get("conversationId")
  const receiverId = useSearchParams().get("receiverId")

  const [text, setText] = useState("")
  const [reply, setReply] = useState<any>("")
  const [showId, setShowId] = useState("")

  // fetching more states
  const containerRef = useRef<HTMLDivElement>(null)
  const topSentinelRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const shouldScrollToBottomRef = useRef(false)
  const didInitialScroll = useRef(false)
  const anchorRef = useRef<any>(null)

  const isInitialLoad = useRef(true)
  // solving unread states

  const unreadBannerRef = useRef<HTMLDivElement | null>(null)

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useGetChats({
    receiverId: receiverId!,
    senderId: userId!,
  })

  const getNextPageRef = useNextPage(
    { isLoading, isFetchingNextPage, hasNextPage, fetchNextPage },
    anchorRef,
    true,
  )

  // Message mapping
  const messages = data?.pages.flatMap((page) => page.messages) || []
  const groupedMessages = groupMessagesByDate(messages)

  //  Realtime Subcriptions
  useEffect(() => {
    if (!userId || !receiverId) return

    const ids = [userId, receiverId].sort().join("_")

    const channel = ably.channels.get(`chat:${ids}`)

    const handler = (message: any) => {
      queryClient.invalidateQueries({
        queryKey: ["chats", userId, receiverId],
      })
    }

    channel.subscribe("message:create", handler)
    channel.subscribe("message:update", handler)
    channel.subscribe("message:delete", handler)
    channel.subscribe("message:read", handler)

    return () => {
      channel.unsubscribe("message:create", handler)
      channel.unsubscribe("message:update", handler)
      channel.unsubscribe("message:delete", handler)
      channel.unsubscribe("message:read", handler)
    }
  }, [ably, userId, receiverId, queryClient])

  // Mutations / Sending
  const sendMessageMutation = useMutation({
    mutationFn: async (data: any) => {
      await axiosdata.value.post("api/chats", data)
    },
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ["chats", userId, receiverId] })
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
      listingId: listingId,
    })
    setText("")
    setReply("")
    setShowListing(false)
  }

  // scrolling effects

  useEffect(() => {
    if (didInitialScroll.current) return
    if (!messages.length) return
    // if (hasFetchedNewRef.current) return

    requestAnimationFrame(() => {
      if (data?.pages[0]?.firstUnreadId) {
        unreadBannerRef.current?.scrollIntoView({
          block: "center",
        })
      } else {
        messagesEndRef.current?.scrollIntoView({
          block: "end",
        })
      }

      didInitialScroll.current = true
      setTimeout(() => {
        isInitialLoad.current = false
    },1000)
      mutateRead.mutate({
        conversationId: data?.pages[0]?.conversationId,
        userId,
      })
    })
  }, [data])

  useEffect(() => {
    if (!shouldScrollToBottomRef.current) return
    // if (hasFetchedNewRef.current) return
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    })

    shouldScrollToBottomRef.current = false
  }, [data])

  // Restore scroll position when new older messages are added
  useLayoutEffect(() => {
    if (isInitialLoad.current) return
   if(isFetchingNextPage) return
   if(!didInitialScroll.current) return
   if(isLoading) return
   if(isFetchingNextPage) return
   if (messages.length === 1) return

    const container = containerRef.current
    const anchor = anchorRef.current

    if (!container || !anchor) return

    const newTop = anchor.element.getBoundingClientRect().top

    container.scrollTop += newTop - 300

    anchorRef.current = null
  }, [isFetchingNextPage])

  // Renders
  if (isLoading || status === "loading") return <ChatLoading />

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
    <div className="flex gap-1 w-full h-screen  xl:h-screen overflow-hidden scroll-auto">
      <div className="hidden md:block flex-1 w-[30%]">
        <Inbox topMargin="0" />
      </div>

      <div className=" flex-1 flex flex-col w-full border rounded-xl p-4 mx-auto bg-white dark:bg-black/20 nobar null">
        <div
          ref={containerRef}
          className="nobar null w-[99%] h-[400px] flex-1 flex flex-col overflow-y-auto space-y-2 mb-2"
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
            getNextPageRef={isInitialLoad.current ? null : getNextPageRef}
            anchorRef={anchorRef}
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
          listingId={listingId}
          showListing={showListing}
          setShowListing={setShowListing}
        />
      </div>
    </div>
  )
}
