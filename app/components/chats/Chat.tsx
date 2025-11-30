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

    return flatMessages[index - 1].$id // message right before unread
  })()
  const lastReadRef = useRef<HTMLDivElement | null>(null)

  const containerRef = useRef<HTMLDivElement | null>(null)

  // Fetch unread count for current conversation
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

  // Load conversation + messages

  useEffect(() => {
    if (!userId || !recipientId) return

    const setupConversation = async () => {
      setLoading(true)
      try {
        const convo = await getOrCreateConversation(userId, recipientId)
        setConversationId(convo.$id)
        const msgs = await getMessages(convo.$id)
        setMessages(msgs)
        await fetchUnreadCount()
      } catch (err) {
        console.error("Failed to load conversation", err)
      } finally {
        setLoading(false)
      }
    }

    setupConversation()
  }, [userId, recipientId])

  // Mark messages as read + update unread count
  useEffect(() => {
    if (unreadCount === undefined || unreadCount === null) return
    if (!lastUnreadId || !conversationId || !userId) return

    const target = document.getElementById(lastUnreadId)
    if (!target) return

    const observer = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0]

        if (!entry.isIntersecting) return
        // if (!userScrolled) return
        // mark all unread as read

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

  // Scroll to bottom when no unread messages

  useEffect(() => {
    if (!conversationId || !userId) return
    // if (!unreadCountRef.current) return

    const run = async () => {
      // Wait for unreadCount to load
      const count = await fetchUnreadCount()
      unreadCountRef.current = count
      setTimeout(() => {
        if (unreadCountRef.current! > 0 && firstUnreadId) {
          // scroll to last read message
          // setUnreadCount(count)
          lastReadRef.current?.scrollIntoView({ behavior: "auto", block: "center" })
        } else if (unreadCountRef.current === 0) {
          // No unread → scroll to bottom
          // setUnreadCount(0)
          messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
        }
      },500)
    }

    run()
  }, [conversationId, userId, unreadCount, unreadCountRef.current,loading])

  //Real-time listener for new messages

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

  if (loading) return <ChatLoading />

  if (!userId || !session) {
    return (
      <div className="loginFirst text-xl text-center py-10">
        <span>To use our chat feature </span>
        <Link
          href="/login"
          className="mx-1 px-4 py-2 rounded-md text-white bg-darkblue dark:bg-coffee"
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

      <div className="md:h-[97.5%] flex-1 flex flex-col  w-full  border rounded-xl  p-4 mx-auto dark:bg-gray-700/40 nobar null">
        {/* Messages Container */}
        {/* <div className="mt-20 text-lg">{unreadCount}</div> */}
        <div
          ref={containerRef}
          className="nobar null w-[98%] flex-1 flex flex-col overflow-y-auto space-y-2 mb-4"
        >
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
                    {/* last read target */}
                    {msg.$id === lastReadMessageId && <div ref={lastReadRef} />}
                    {/* Unread Messages Banner */}
                    {/* msg.$id === '692c973800094bd9bb18' */}
                    {/* msg.$id === firstUnreadId && (unreadCount as number) > 0 */}
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
                    {/* chat bubble */}
                    {/* read chats */}

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

          {/* Always at bottom */}
          <div ref={messagesEndRef} />
        </div>

        {/* Guidelines */}
        <div className="text-xs text-gray-600 dark:text-gray-300 mb-3">
          <p>
            To avoid getting banned or permanently removed from First Estates, please use the chat
            feature responsibly.
          </p>
          <ul className="list-disc pl-5 mt-1 space-y-0.5">
            <li>Treat others with kindness and respect</li>
            <li>Avoid hate speech, harassment, or abusive language</li>
          </ul>
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 border dark:border-gray-400 rounded-lg px-4 py-2 focus:outline-none resize-none"
          />
          <button
            onClick={handleSendMessage}
            disabled={sending || !text.trim()}
            className="w-10 h-10 flex items-center justify-center clickable bg-goldPrimary text-white  rounded-full hover:bg-goldPrimary/90 cursor-pointer"
          >
            {sending ? (
              <Loader2
                size={22}
                className="animate-spin"
              />
            ) : (
              <SendHorizonal size={22} />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
