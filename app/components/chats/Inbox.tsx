"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@utils/user"
import { CldImage } from "next-cloudinary"
import { Loader2, FileX, Search, SlidersHorizontal } from "lucide-react"
import ConversationRow from "./ConversationRow"
import { Skeleton } from "../ui/skeleton"
import { useGetConversations } from "@lib/customApi"
import { useNextPage } from "@lib/useIntersection"
import { client as ably } from "@lib/AblyProvider"
import { useQueryClient } from "@tanstack/react-query"
import ConversationEmptyState from "./ConversationEmptyState"

type InboxProps = {
  topMargin?: string
  height?: string
  splitView?: boolean
}

export default function Inbox({ topMargin, height, splitView = false }: InboxProps) {
  const { session } = useUser()
  const userId = session?.user.id
  const router = useRouter()
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState<"all" | "read" | "unread" | "pinned">("all")
  const [search, setSearch] = useState("")

  const { data, isLoading, isError, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetConversations({
      userId,
      filter,
    })
  const nextPageRef = useNextPage({ isLoading, fetchNextPage, hasNextPage })

  const conversations = (data?.pages.flatMap((data) => data.conversations) || []).filter((convo: any) => convo.participant?.username?.toLowerCase().includes(search.toLowerCase()))

  const openChat = (receiverId: string, userId: string, conversationId?: string) => {
    router.push(`/chat?senderId=${userId}&receiverId=${receiverId}&conversationId=${conversationId || ""}`)
  }

  useEffect(() => {
    if (!userId) return
 const ids = [userId]
    const channel = ably.channels.get(`inbox:${userId}`)

    const refreshInbox = () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", userId],
      })

      queryClient.invalidateQueries({
        queryKey: ["unreadChats", userId],
      })
    }
    channel.subscribe("conversation:read", refreshInbox)
    channel.subscribe("conversation:create", refreshInbox)
    channel.subscribe("conversation:update", refreshInbox)
    channel.subscribe("conversation:delete", refreshInbox)

    return () => {
      channel.unsubscribe("conversation:create", refreshInbox)
      channel.unsubscribe("conversation:update", refreshInbox)
      channel.unsubscribe("conversation:delete", refreshInbox)
    }
  }, [ably, userId])

  return (
    <div className={splitView ? "flex h-full min-h-0 w-full min-w-0 gap-3" : "h-full w-full min-w-0"}>
      <div className={splitView ? "h-full min-h-0 w-full min-w-0 md:w-[min(30rem,45%)] lg:w-[min(36rem,43%)]" : "h-full w-full"}>
        <div className={`${topMargin || ""} flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-lg bg-white shadow dark:bg-black/20`}>
      <div className="ml-2 py-2 mb-2 flex flex-row items-center gap-2 border-2 border-transparent border-b-gray-500/20 dark:border-b-gray-900/70">
        {session?.user.profilePic ? (
          <CldImage
            width={100}
            height={100}
            crop="fit"
            src={session?.user.profilePic}
            alt="profile pic"
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <Skeleton className="w-10 h-10 rounded-full animate-none bg-gray-500/20" />
        )}
        <h2 className="otherHead  text-center text-lg lg:text-xl font-semibold">Chats</h2>
      </div>
      <div className="space-y-2 px-2"><label className="flex items-center gap-2 rounded-xl border border-border px-3 py-2"><Search size={16} className="text-muted-foreground" /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search conversations" className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></label><div className="flex gap-1 overflow-x-auto pb-1">{(["all", "read", "unread", "pinned"] as const).map(value => <button key={value} type="button" onClick={() => setFilter(value)} className={`rounded-full px-3 py-1.5 text-xs capitalize ${filter === value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}><SlidersHorizontal size={12} className="mr-1 inline" />{value}</button>)}</div></div>
      <div className="nobar null min-h-0 flex-1 space-y-3 overflow-y-auto p-2">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                className="w-[98%] h-18 rounded-lg animate-none bg-gray-500/20 p-3 
            "
              />
            ))
          : conversations.map((convo, index: number) => (
              <ConversationRow
                key={convo._id}
                convo={convo}
                currentUserId={userId}
                refValue={index === conversations.length - 1 ? nextPageRef : null}
                handleOpenChat={(otherId: string) => openChat(otherId, userId, convo._id)}
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
        {isFetchingNextPage && (
          <Loader2 className="mt-6 mx-auto text-gray-500 dark:text-gray-400 animate-spin" />
        )}
      </div>
        </div>
      </div>
      {splitView && <ConversationEmptyState />}
    </div>
  )
}
