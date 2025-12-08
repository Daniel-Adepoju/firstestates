"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import { client } from "@/lib/server/appwrite"
import {
  sendMessage,
  getMessages,
  getUnreadChatsInConversation,
  getOrCreateConversation,
  updateReadStatus,
} from "@/lib/server/chats"
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

export default function Chat() {
  const [messages, setMessages] = useState<Models.Document[]>([])
  
  const [unreadCount, setUnreadCount] = useState<number | undefined>(0)
  const [unreadLoading, setUnreadLoading] = useState(false)
  const groupedMessages = groupMessagesByDate(messages)

  // users
  const { session } = useUser()
  const userId = session?.user.id
  const recipientId = useSearchParams().get("recipientId")

  // loading states
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [showId, setShowId] = useState("")

  // fetching more states
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const topSentinelRef = useRef<HTMLDivElement>(null)
  const chatMessageLimit = 30

  // solving unread states
  const unreadObserver = useRef<IntersectionObserver | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const flatMessages = Object.values(groupedMessages).flat()
  const unreadCountRef = useRef<number | null>(null)
  const lastUnreadId = [...flatMessages].reverse().find((m) => !m.readBy.includes(userId))?.$id
  const firstUnreadId = flatMessages.find((m) => !m.readBy.includes(userId))?.$id
  const lastReadMessageId = (() => {
    if (!firstUnreadId) return null
    const index = flatMessages.findIndex((m) => m.$id === firstUnreadId)
    if (index <= 0) return null
    return flatMessages[index - 1].$id
  })()
  const lastReadRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // scroll on send
const newMessageRef = useRef<Models.Document | null>(null)


 // fetch unread count in conversation
  const fetchUnreadCount = async () => {
    if (!conversationId || !userId) return null
    setUnreadLoading(true)
    try {
      const countStr = await getUnreadChatsInConversation(conversationId, userId)
      const count = parseInt(countStr) || 0
      setUnreadCount(count)
      unreadCountRef.current = count
      return count
    } catch (err) {
      console.error("Failed to fetch unread count", err)
      return null
    } finally {
      setUnreadLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!text.trim() || !conversationId || !userId || sending) return
    setSending(true)
    await sendMessage(text, userId, recipientId!, conversationId)
    setText("")
    setSending(false)
    await fetchUnreadCount()
  }

  // load older messages

  const loadMoreMessages = useCallback(async () => {
    if (loadingMore || !hasMore || !conversationId || messages.length === 0) return

    const oldestId = messages[0].$id
    setLoadingMore(true)
    try {
      const older = await getMessages(conversationId, chatMessageLimit, oldestId)
      if (older.length < chatMessageLimit) setHasMore(false)
      if (older.length > 0) {
        setMessages((prev) => [...older, ...prev])
      }
    } catch (err) {
      console.error("Failed to load more messages", err)
    } finally {
      setLoadingMore(false)
    }
  }, [conversationId, messages, loadingMore, hasMore])

  //  observe top sentinel

  useEffect(() => {
    if (!topSentinelRef.current || !containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loadingMore) {
          loadMoreMessages()
        }
      },
      { root: containerRef.current, threshold: 0.1 }
    )

    observer.observe(topSentinelRef.current)

    return () => observer.disconnect()
  }, [hasMore, loadingMore, loadMoreMessages])



  // setup conversation
  
  useEffect(() => {
    if (!userId || !recipientId) return

    const setupConversation = async () => {
      setLoading(true)
      try {
        const convo = await getOrCreateConversation(userId, recipientId)
        setConversationId(convo.$id)
        const msgs = await getMessages(convo.$id, chatMessageLimit) // ← first page
        setMessages(msgs)
        setHasMore(msgs.length >= chatMessageLimit)
        await fetchUnreadCount()
      } catch (err) {
        console.error("Failed to load conversation", err)
      } finally {
        setLoading(false)
      }
    }

    setupConversation()
  }, [userId, recipientId])

  // update read status when last unread message is visible
  useEffect(() => {
    if (unreadCount === undefined || unreadCount === null) return
    if (!lastUnreadId || !conversationId || !userId) return

    const target = document.getElementById(lastUnreadId)
    if (!target) return

    const observer = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0]
        if (!entry.isIntersecting) return

        await updateReadStatus(userId, conversationId)
        await fetchUnreadCount()
        observer.disconnect()
      },
      { threshold: 1.0 }
    )

    observer.observe(target)
    unreadObserver.current = observer

    return () => observer.disconnect()
  }, [lastUnreadId, conversationId])

  // scroll to last unread message or messages end
  useEffect(() => {
    if (!conversationId || !userId) return

    const run = async () => {
      const count = await fetchUnreadCount()
      unreadCountRef.current = count
      setTimeout(() => {
        if (!loadingMore && unreadCountRef.current! > 0 && firstUnreadId) {
          lastReadRef.current?.scrollIntoView({ behavior: "auto", block: "center" })
        } else if (unreadCountRef.current === 0) {
          messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
        }
      }, 300)
    }

    run()
  }, [conversationId, userId, unreadCount, unreadCountRef.current, loading])

  // realtime subscription
  useEffect(() => {
    if (!conversationId) return
    const unsubscribe = client.subscribe(
      `databases.${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID}.documents`,
      (res) => {
        const newMsg = res.payload as Models.Document
        if (newMsg.conversationId !== conversationId) return

        if (res.events.some((e) => e.includes("create"))) {
          newMessageRef.current = newMsg 
  setMessages(prev => [...prev, newMsg])
        }

        if (res.events.some((e) => e.includes("update"))) {
          setMessages((prev) => prev.map((msg) => (msg.$id === newMsg.$id ? newMsg : msg)))
        }

        if (res.events.some((e) => e.includes("delete"))) {
          setMessages((prev) => prev.filter((msg) => msg.$id !== newMsg.$id))
        }
      }
    )

    return () => unsubscribe()
  }, [conversationId])



  // Detect message added at the bottom
useEffect(() => {

  if (!newMessageRef.current) return

  const latest = newMessageRef.current

  // Only scroll for my own messages
  if (latest.senderId === userId) {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 10)
  }

  // reset
  newMessageRef.current = null
}, [messages])




  // renders
  if (loading) return <ChatLoading />

  if (!loading && (!userId || !session)) {
    return (
      <div className="loginFirst text-xl text-center py-10">
        <span>To use our chat feature </span>
        <Link
          href="/login"
          className="mx-1 px-4 py-2 rounded-md text-white darkblue-gradient dark:bg-coffee"
        >
          Log in
        </Link>
      </div>
    )
  }

  if (userId === recipientId) {
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
          loadingMore={loadingMore}
          hasMore={hasMore}
          lastReadMessageId={lastReadMessageId}
          lastReadRef={lastReadRef}
          firstUnreadId={firstUnreadId}
          unreadCountRef={unreadCountRef}
          unreadCount={unreadCount}
          userId={userId}
          showId={showId}
          setShowId={setShowId}
          recipientId={recipientId}
        />
         <div className="h-1" ref={messagesEndRef} />

</div>
        <Guidelines />

        <ChatInput
          text={text}
          setText={setText}
          handleSendMessage={handleSendMessage}
          sending={sending}
        />
      </div>
    </div>
  )
}
