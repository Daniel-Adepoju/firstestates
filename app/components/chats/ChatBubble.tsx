"use client"

import { useRef, useState } from "react"
import {
  AudioLines,
  Check,
  CheckCheck,
  Edit3,
  FlagTriangleLeft,
  Reply,
  Star,
  Trash2,
} from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosdata } from "@utils/axiosUrl"
import { ReportModal } from "../Modals"
import PopularCard from "@components/listing/PopularCard"
import VoiceMessageBubble from "./VoiceMessageBubble"
import { Popover, PopoverAnchor, PopoverContent } from "@components/ui/popover"

export default function ChatBubble({ msg, userId, receiverId, setReply, id }: any) {
  const queryClient = useQueryClient()
  const reportRef = useRef<HTMLDialogElement>(null)
  const [menu, setMenu] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(msg.text || "")
  const [offset, setOffset] = useState(0)
  const startX = useRef<number | null>(null)
  const moved = useRef(false)

  const chatId = [userId, receiverId].sort().join("_")
  const chatQueryKey = ["chats", userId, receiverId]
  const outgoing = String(msg.senderId) === String(userId)
  const starred = msg.starredBy?.some((value: string) => String(value) === String(userId))

  const update = useMutation({
    mutationFn: (payload: any) =>
      axiosdata.value.patch(`/api/chats/${chatId}`, { bubbleId: msg._id, ...payload }),
    onSuccess: () => {
      setMenu(false)
      setEditing(false)
      queryClient.invalidateQueries({ queryKey: ["chats"] })
    },
  })

  const remove = useMutation({
    mutationFn: (mode: string) =>
      axiosdata.value.delete(`/api/chats/${chatId}`, { data: { bubbleId: msg._id, mode } }),
    onSuccess: () => {
      setMenu(false)
      queryClient.invalidateQueries({ queryKey: ["chats"] })
    },
  })

  const starMessage = useMutation({
    mutationFn: () =>
      axiosdata.value.patch(`/api/chats/${chatId}`, { bubbleId: msg._id, action: "star" }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: chatQueryKey })
      const previous = queryClient.getQueryData(chatQueryKey)
      const nextStarred = !starred
      queryClient.setQueryData(chatQueryKey, (current: any) => {
        if (!current?.pages) return current
        return {
          ...current,
          pages: current.pages.map((page: any) => ({
            ...page,
            messages: page.messages?.map((message: any) => {
              if (String(message._id) !== String(msg._id)) return message
              const currentStars = (message.starredBy || []).filter(
                (value: string) => String(value) !== String(userId),
              )
              return {
                ...message,
                starredBy: nextStarred ? [...currentStars, userId] : currentStars,
              }
            }),
          })),
        }
      })
      setMenu(false)
      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(chatQueryKey, context.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: chatQueryKey }),
  })

  const begin = (event: React.PointerEvent) => {
    if ((event.target as HTMLElement).closest("button, a, input, [role='slider']")) return
    if (event.pointerType === "mouse" && event.button !== 0) return
    moved.current = false
    startX.current = event.clientX
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const move = (event: React.PointerEvent) => {
    if (startX.current === null) return
    const distance = event.clientX - startX.current
    if (Math.abs(distance) > 8) moved.current = true
    setOffset(Math.max(0, Math.min(72, distance)))
  }

  const end = () => {
    if (offset > 42)
      setReply({ _id: msg._id, text: msg.text, messageType: msg.messageType, audio: msg.audio })
    setOffset(0)
    startX.current = null
  }

  const openMenu = (event: React.MouseEvent) => {
    if (moved.current) {
      moved.current = false
      return
    }
    if ((event.target as HTMLElement).closest("button, a, input, [role='slider']")) return
    setMenu(true)
  }

  return (
    <Popover
      open={menu}
      onOpenChange={setMenu}
    >
      <div className={`group relative flex w-full ${outgoing ? "justify-end" : "justify-start"}`}>
        <PopoverAnchor asChild>
          <div
            className="relative max-w-[min(82%,32rem)]"
            style={{
              transform: `translateX(${offset}px)`,
              transition: startX.current === null ? "transform 180ms ease-out" : "none",
            }}
            onPointerDown={begin}
            onPointerMove={move}
            onPointerUp={end}
            onClick={openMenu}
            onContextMenu={(event) => {
              event.preventDefault()
              setMenu(true)
            }}
          >
            {msg.replyTo && (
              <div className="mb-1 flex items-center gap-1 rounded-lg border-l-2 border-primary px-2 py-1 text-xs opacity-75">
                {msg.replyTo.messageType === "voice" ? (
                  <>
                    <AudioLines size={13} />
                    Replied to audio
                  </>
                ) : (
                  <>
                    <Reply size={13} />
                    {msg.replyTo.text || "Replied message"}
                  </>
                )}
              </div>
            )}
            {msg.listingId && (
              <PopularCard
                listing={msg.listingId}
                showPopular={false}
              />
            )}
            <div
              id={id}
              className={`rounded-2xl px-3 py-2 text-sm shadow-sm ${outgoing ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md border border-border bg-card text-foreground"}`}
            >
              {msg.messageType === "voice" && msg.audio?.url ? (
                <VoiceMessageBubble
                  url={msg.audio.url}
                  duration={msg.audio.duration}
                  waveform={msg.audio.waveform}
                  outgoing={outgoing}
                />
              ) : editing ? (
                <div className="flex gap-2">
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    className="min-w-0 rounded bg-white/20 px-2 py-1 text-inherit outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (draft.trim()) update.mutate({ action: "edit", text: draft })
                    }}
                  >
                    Save
                  </button>
                </div>
              ) : (
                msg.text
              )}
              <div className="mt-1 flex items-center justify-end gap-1 text-[10px] opacity-70">
                {msg.editedAt && <span>edited</span>}
                <span>
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {outgoing &&
                  (msg.readBy?.includes(receiverId) ? (
                    <CheckCheck size={13} />
                  ) : (
                    <Check size={13} />
                  ))}
              </div>
            </div>
          </div>
        </PopoverAnchor>
        <PopoverContent
          side={outgoing ? "left" : "right"}
          align="start"
          collisionPadding={12}
          className="z-[80] w-48 p-1"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <button
            type="button"
            className="chat-action w-full"
            onClick={() => {
              setReply({
                _id: msg._id,
                text: msg.text,
                messageType: msg.messageType,
                audio: msg.audio,
              })
              setMenu(false)
            }}
          >
            <Reply size={14} />
            Reply
          </button>
          <button
            type="button"
            className="chat-action w-full"
            disabled={starMessage.isPending}
            onClick={() => starMessage.mutate()}
          >
            <Star
              size={14}
              className={starred ? "fill-current" : ""}
            />
            {starred ? "Unstar" : "Star"}
          </button>
          {outgoing && msg.messageType !== "voice" && (
            <button
              type="button"
              className="chat-action w-full"
              onClick={() => {
                setEditing(true)
                setMenu(false)
              }}
            >
              <Edit3 size={14} />
              Edit
            </button>
          )}
          <button
            type="button"
            className="chat-action w-full"
            disabled={remove.isPending}
            onClick={() => remove.mutate(outgoing ? "global" : "personal")}
          >
            <Trash2 size={14} />
            {outgoing ? "Delete for everyone" : "Delete for me"}
          </button>
          {!outgoing && (
            <button
              type="button"
              className="chat-action w-full text-red-600"
              onClick={() => {
                setMenu(false)
                reportRef.current?.showModal()
              }}
            >
              <FlagTriangleLeft size={14} />
              Report
            </button>
          )}
        </PopoverContent>
      </div>
      <ReportModal
        ref={reportRef}
        userId={userId}
        chatContent={msg.text}
        reportedUser={msg.senderId}
        action="chat"
      />
    </Popover>
  )
}
