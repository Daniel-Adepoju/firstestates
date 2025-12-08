"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import { client } from "@/lib/server/appwrite"
import {
  sendMessage,
  getMessages, // ← will be replaced below
  getUnreadChatsInConversation,
  getOrCreateConversation,
  updateReadStatus,
} from "@/lib/server/chats"
import { useUser } from "@utils/user"
import type { Models, Query } from "appwrite" // ← make sure Query is imported
import { useSearchParams } from "next/navigation"
import { ArrowDown } from "lucide-react"
import Link from "next/link"
import Inbox from "./Inbox"
import ChatBubble from "./ChatBubble"
import ChatLoading from "./ChatLoading"
import { Loader2, SendHorizonal } from "lucide-react"
import { groupMessagesByDate } from "@utils/date"

export default function Chat() {
  const [messages, setMessages] = useState<Models.Document[]>([])
  const [unreadCount, setUnreadCount] = useState<number | undefined>(0)
  const [unreadLoading, setUnreadLoading] = useState(false)
  const groupedMessages = groupMessagesByDate(messages)

  const { session } = useUser()
  const userId = session?.user.id
  const recipientId = useSearchParams().get("recipientId")

  const [conversationId, setConversationId] = useState<string | null>(null)
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [showId, setShowId] = useState("")

  // STATES FOR INFINITE SCROLL
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const topSentinelRef = useRef<HTMLDivElement>(null)
  const chatMessageLimit = 30

  // States for unread
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

  // observe messages end
  // useEffect(() => {
  //   if (!messagesEndRef.current || !containerRef.current) return

  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       if (entry.isIntersecting && hasMore && !loadingMore) {
  //         loadMoreMessages()
  //       }
  //     },
  //     { root: containerRef.current, threshold: 0.1 }
  //   )

  //   observer.observe(messagesEndRef.current)
  //   return () => observer.disconnect()
  // }, [hasMore, loadingMore, loadMoreMessages])

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
        if (unreadCountRef.current! > 0 && firstUnreadId) {
          lastReadRef.current?.scrollIntoView({ behavior: "auto", block: "center" })
        } else if (unreadCountRef.current === 0) {
          messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
        }
      }, 500)
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
          setMessages((prev) => [...prev, newMsg])
          messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
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

  // renders
  if (loading) return <ChatLoading />

  if (!userId || !session) {
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
    <div className="flex gap-1 w-full h-screen md:h-152 overflow-hidden">
      <div className="hidden md:block flex-1 w-[30%]">
        <Inbox topMargin="0" />
      </div>

      <div className="md:h-[97.5%] flex-1 flex flex-col  w-full  border rounded-xl  p-4 mx-auto bg-white dark:bg-gray-700/40 nobar null">
     
        <div
          ref={containerRef}
          className="nobar null w-[98%] flex-1 flex flex-col overflow-y-auto space-y-2 mb-4"
        >
          {/* sentinel + loading indicator */}

          <div
            ref={topSentinelRef}
            className="h-1 text-blue-600"
          />
        

          {loadingMore && (
            <div className="text-center py-4">
              <Loader2
                className="animate-spin mx-auto mb-1 text-gray-400 dark:text-gray-500"
                size={20}
              />
              <p className="text-xs text-gray-400 dark:text-gray-500">Loading older messages...</p>
            </div>
          )}
{/* 
          {!hasMore && messages.length > 0 && (
            <div className="text-center py-2 text-sm text-gray-400 dark:text-gray-500">
              No more messages
            </div>
          )} */}

          {Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date}>
              <h4 className="text-center text-sm text-gray-500 dark:text-gray-300 my-4">{date}</h4>
              <div className="flex flex-col gap-4 mb-2 nobar null">
                {msgs.map((msg: any) => (
                  <div
                    key={msg.$id}
                    className={`w-full flex flex-col flex-1 flex-wrap items-center
                      ${msg.userId === userId ? "justify-end" : "justify-start"}`}
                  >
                    {msg.$id === lastReadMessageId && <div ref={lastReadRef} />}

                    {msg.$id === firstUnreadId && (unreadCountRef?.current as number) > 0 && (
                      <div className="w-[100%] mt-6 mb-6 flex-1 flex flex-col !mx-auto !items-center !justify-center !justify-self-center !place-self-center gap-2 py-3 text-sm text-gray-500 dark:text-gray-300">
                        <span>
                          You have {unreadCount} unread {unreadCount === 1 ? "message" : "messages"}
                        </span>
                        <ArrowDown
                          size={26}
                          onClick={() =>
                            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
                          }
                          className="p-1 smallScale cursor-pointer rounded-full shadow-lg dark:shadow-black"
                        />
                      </div>
                    )}

                    <ChatBubble
                      id={msg.$id}
                      msg={msg}
                      userId={userId}
                      showId={showId}
                      setShowId={setShowId}
                      recipientId={recipientId}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Guidelines */}
       <details className="mb-3">
  <summary className="text-xs text-gray-600 dark:text-gray-300 cursor-pointer">
    To avoid getting banned or permanently removed from First Estates, please use the chat
    feature responsibly.
  </summary>

  <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
    <ul className="list-disc pl-5 space-y-0.5">
      <li>Treat others with kindness and respect</li>
      <li>Avoid hate speech, harassment, or abusive language</li>
    </ul>
  </div>
</details>


        {/* Input */}
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 border dark:border-gray-400 rounded-lg px-4 py-2.5 focus:outline-none resize-none"
          />
          <button
            onClick={handleSendMessage}
            disabled={sending || !text.trim()}
            className="w-10 h-10 rounded-full gold-gradient text-white flex items-center justify-center hover:opacity-90 transition"
          >
            {sending ? (
              <Loader2
                className="animate-spin"
                size={20}
              />
            ) : (
              <SendHorizonal size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
