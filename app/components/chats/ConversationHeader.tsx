"use client"

import { useEffect, useRef, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CldImage } from "next-cloudinary"
import { Archive, FlagTriangleLeft, MoreVertical, Pin, Star, User2, X } from "lucide-react"
import Link from "next/link"
import { axiosdata } from "@utils/axiosUrl"
import { ReportModal } from "@components/Modals"

type ConversationHeaderProps = {
  receiver?: any
  conversationId?: string | null
  isPinned?: boolean
  userId: string
  messages: any[]
  onBack: () => void
  onDeleted: () => void
}

export default function ConversationHeader({
  receiver,
  conversationId,
  isPinned = false,
  userId,
  messages,
  onBack,
  onDeleted,
}: ConversationHeaderProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const reportRef = useRef<HTMLDialogElement>(null)
  const queryClient = useQueryClient()
  const [menuOpen, setMenuOpen] = useState(false)
  const [panel, setPanel] = useState<"starred" | "listings" | null>(null)

  const [pinned, setPinned] = useState(isPinned)
  const starredMessages = messages.filter((message) =>
    message.starredBy?.some((id: string) => String(id) === userId),
  )
  const sharedListings = messages.filter((message) => message.listingId?._id)

  const conversationAction = useMutation({
    mutationFn: async (action: "pin" | "unpin") => {
      if (!conversationId) return
      await axiosdata.value.patch(`/api/conversations/${conversationId}`, { action })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
      setPinned((value) => !value)
      setMenuOpen(false)
    },
  })

  const deleteConversation = useMutation({
    mutationFn: async () => {
      if (!conversationId) return
      await axiosdata.value.delete(`/api/conversations/${conversationId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
      setMenuOpen(false)
      onDeleted()
    },
  })

  const starMessage = useMutation({
    mutationFn: async (message: any) => {
      const chatId = [userId, String(message.receiverId)].sort().join("_")
      await axiosdata.value.patch(`/api/chats/${chatId}`, {
        bubbleId: message._id,
        action: "star",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats", userId] })
    },
  })

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false)
        setPanel(null)
      }
    }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [])

  useEffect(() => setPinned(isPinned), [isPinned])

  const showMessages = (nextPanel: "starred" | "listings") => {
    setPanel(nextPanel)
    setMenuOpen(true)
  }

  return (
    <header className="relative mb-3 flex items-center justify-between border-b border-border pb-3">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full p-2 hover:bg-muted md:hidden"
          aria-label="Back to inbox"
        >
          <span className="sr-only">Back to inbox</span>←
        </button>
        {receiver?.profilePic ? (
          <CldImage
            src={receiver.profilePic}
            width={80}
            height={80}
            crop="fill"
            alt={`${receiver.username || "User"}'s profile picture`}
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <User2 size={20} />
          </div>
        )}
        <div className="min-w-0">
          <p
            className="max-w-[min(48vw,18rem)] truncate text-sm font-semibold"
            title={receiver?.username || "Chat"}
          >
            {receiver?.username || "Chat"}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            Messages are private to this conversation
          </p>
        </div>
      </div>

      <div
        ref={menuRef}
        className="relative shrink-0"
      >
        <button
          type="button"
          onClick={() => {
            setMenuOpen((open) => !open)
            setPanel(null)
          }}
          className="rounded-full p-2 hover:bg-muted"
          aria-label="Conversation actions"
          aria-expanded={menuOpen}
        >
          <MoreVertical size={18} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-11 z-30 w-64 rounded-2xl border border-border bg-background p-1.5 shadow-xl">
            {panel ? (
              <>
                <div className="flex items-center justify-between px-2 py-1.5">
                  <p className="text-sm font-semibold">
                    {panel === "starred" ? "Starred messages" : "Shared listings"}
                  </p>
                  <button
                    type="button"
                    onClick={() => setPanel(null)}
                    className="rounded-md p-1 hover:bg-muted"
                    aria-label="Close panel"
                  >
                    <X size={15} />
                  </button>
                </div>
                <div className="max-h-64 space-y-1 overflow-y-auto p-1">
                  {panel === "starred" &&
                    (starredMessages.length ? (
                      starredMessages.map((message) => (
                        <div
                          key={message._id}
                          className="flex items-center gap-2 rounded-lg p-2 text-xs hover:bg-muted"
                        >
                          <button
                            type="button"
                            className="min-w-0 flex-1 truncate text-left"
                            onClick={() => {
                              document
                                .getElementById(message._id)
                                ?.scrollIntoView({ behavior: "smooth", block: "center" })
                              setMenuOpen(false)
                            }}
                          >
                            {message.messageType === "voice"
                              ? "Voice message"
                              : message.text || "Attachment"}
                          </button>
                          <button
                            type="button"
                            onClick={() => starMessage.mutate(message)}
                            className="shrink-0 text-primary"
                            aria-label="Unstar message"
                          >
                            <Star
                              size={14}
                              className="fill-current"
                            />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="p-3 text-xs text-muted-foreground">No starred messages yet.</p>
                    ))}
                  {panel === "listings" &&
                    (sharedListings.length ? (
                      sharedListings.map((message) => (
                        <Link
                          key={message._id}
                          href={`/listings/single_listing?id=${message.listingId._id}`}
                          onClick={() => setMenuOpen(false)}
                          className="block truncate rounded-lg p-2 text-xs hover:bg-muted"
                        >
                          {message.listingId.location ||
                            message.listingId.address ||
                            "Shared listing"}
                        </Link>
                      ))
                    ) : (
                      <p className="p-3 text-xs text-muted-foreground">
                        No listings shared in this chat.
                      </p>
                    ))}
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="chat-action w-full"
                  onClick={() => showMessages("starred")}
                >
                  <Star size={15} />
                  Starred messages
                </button>
                <button
                  type="button"
                  className="chat-action w-full"
                  onClick={() => showMessages("listings")}
                >
                  <Archive size={15} />
                  Shared listings
                </button>
                {conversationId && (
                  <button
                    type="button"
                    className="chat-action w-full"
                    disabled={conversationAction.isPending}
                    onClick={() => conversationAction.mutate(pinned ? "unpin" : "pin")}
                  >
                    <Pin
                      size={15}
                      className={pinned ? "fill-current" : ""}
                    />
                    {pinned ? "Unpin conversation" : "Pin conversation"}
                  </button>
                )}
                <button
                  type="button"
                  className="chat-action w-full text-red-600 dark:text-red-500"
                  onClick={() => {
                    setMenuOpen(false)
                    reportRef.current?.showModal()
                  }}
                >
                  <FlagTriangleLeft size={15} />
                  Report person
                </button>
                {conversationId && (
                  <button
                    type="button"
                    className="chat-action w-full text-red-600 dark:text-red-500"
                    disabled={deleteConversation.isPending}
                    onClick={() => deleteConversation.mutate()}
                  >
                    <Archive size={15} />
                    Delete conversation
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <ReportModal
        ref={reportRef}
        userId={userId}
        reportedUser={receiver?._id || ""}
        action="chat"
      />
    </header>
  )
}
