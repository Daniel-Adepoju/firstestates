"use client"

import { CldImage } from "next-cloudinary"
import { MoreVertical, Pin, Trash2 } from "lucide-react"
import { useState } from "react"
import { axiosdata } from "@utils/axiosUrl"
import { useQueryClient } from "@tanstack/react-query"

type ConversationRowProps = {
  convo: {
    _id?: string
    id: string
    userIds: string[]
    lastMessage?: string
    participant: any
    unreadCount?: any
    pinnedBy?: string[]
  }
  refValue?: any
  currentUserId: string
  handleOpenChat: (otherId: string, conversationId: string) => void
}

export default function ConversationRow({
  convo,
  currentUserId,
  handleOpenChat,
  refValue,
}: ConversationRowProps) {
  const otherId = convo.userIds.find((id) => id !== currentUserId)
  const [menu, setMenu] = useState(false)
  const queryClient = useQueryClient()
  const action = async (type: "pin" | "unpin") => { await axiosdata.value.patch(`/api/conversations/${(convo as any)._id}`, { action: type }); setMenu(false); queryClient.invalidateQueries({ queryKey: ["conversations", currentUserId] }) }
  const remove = async () => { await axiosdata.value.delete(`/api/conversations/${(convo as any)._id}`); setMenu(false); queryClient.invalidateQueries({ queryKey: ["conversations", currentUserId] }) }

  return (
    <div
      ref={refValue}
      className="relative p-3 bg-black/5 dark:bg-gray-700/40 rounded-xl
      border-1 border-transparent border-t-gray-500/30 cursor-pointer
       hover:bg-gray-400/20 dark:hover:bg-gray-500/20"
      onClick={() => otherId && handleOpenChat(otherId, currentUserId)}
    >
      <div className="flex gap-1 items-center">
        <CldImage
          src={convo?.participant?.profilePic}
          width={200}
          height={200}
          alt="profilePic"
          crop={"fit"}
          className="w-12 h-12 rounded-full"
        />

        <div className="rext-sm font-medium ml-1 dark:text-gray-300 text-gray-500">
          {convo?.participant?.username}
        </div>
      </div>
      <button type="button" aria-label="Conversation actions" onClick={(event) => { event.stopPropagation(); setMenu(value => !value) }} className="absolute right-2 top-2 rounded-lg p-1 text-muted-foreground hover:bg-muted"><MoreVertical size={17} /></button>
      {(menu) && <div onClick={event => event.stopPropagation()} className="absolute right-2 top-9 z-10 flex min-w-32 flex-col rounded-xl border border-border bg-background p-1 shadow-xl"><button type="button" className="chat-action" onClick={() => action((convo as any).pinnedBy?.some((id: string) => String(id) === currentUserId) ? "unpin" : "pin")}><Pin size={14} />{(convo as any).pinnedBy?.some((id: string) => String(id) === currentUserId) ? "Unpin" : "Pin"}</button><button type="button" className="chat-action text-red-600" onClick={remove}><Trash2 size={14} />Delete</button></div>}
      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 truncate">
        {convo.lastMessage}
      </div>

      {convo.unreadCount > 0 && (
        <div className="absolute right-5 top-5 flex flex-col items-center">
          <h6 className="text-xs font-medium mb-1 text-amber-500 ">New</h6>
          <div
            className="
       w-6 h-6 flex items-center justify-center
      text-sm font-semibold text-white gold-gradient rounded-full"
          >
            {convo.unreadCount}
            {/* {parseInt(convo.unreadCount) > 9 ? "9+" : convo.unreadCount} */}
          </div>
        </div>
      )}
      {(convo as any).pinnedBy?.some((id: string) => String(id) === currentUserId) && <Pin size={13} className="absolute bottom-2 right-2 text-primary" />}
    </div>
  )
}
