"use client"

import { CldImage } from "next-cloudinary"

type ConversationRowProps = {
  convo: {
    id: string
    userIds: string[]
    lastMessage?: string
    participant: any
    unreadCount?: any
  }
  currentUserId: string
  handleOpenChat: (otherId: string, conversationId: string) => void
}

export default function ConversationRow({
  convo,
  currentUserId,
  handleOpenChat,
}: ConversationRowProps) {
  const otherId = convo.userIds.find((id) => id !== currentUserId)

  return (
    <div
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
          crop={"auto"}
          className="w-12 h-12 rounded-full"
        />

        <div className="rext-sm font-medium ml-1 dark:text-gray-300 text-gray-500">
          {convo?.participant?.username}
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 truncate">
        {convo.lastMessage}
      </div>

      {convo.unreadCount !== "0" && (
        <div className="absolute right-5 top-5 flex flex-col items-center">
          <h6 className="text-xs font-medium mb-1 text-amber-500 ">New</h6>
          <div
            className="
       w-6 h-6 flex itemms-center justify-center
      text-md font-semibold text-white dark:gold-gradient darkblue-gradient rounded-full"
          >
            {parseInt(convo.unreadCount) > 9 ? "9+" : convo.unreadCount}
          </div>
        </div>
      )}
    </div>
  )
}
