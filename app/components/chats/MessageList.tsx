import ChatBubble from "./ChatBubble"
import { Loader2, ArrowDown } from "lucide-react"

export default function MessageList({
  groupedMessages,
  messagesEndRef,
  topSentinelRef,
  containerRef,
  loadingMore,
  hasMore,
  lastReadMessageId,
  lastReadRef,
  firstUnreadId,
  unreadCountRef,
  unreadCount,
  userId,
  showId,
  setShowId,
  recipientId
}: any) {
  return (
    // <div
    //   ref={containerRef}
    //   className="nobar null w-[98%] flex-1 flex flex-col overflow-y-auto space-y-2 mb-4"
    // >
    <>
      

      {loadingMore && (
        <div className="text-center pt-2 py-4">
          <Loader2 className="animate-spin mx-auto mb-1 text-gray-400 dark:text-gray-500" size={20} />
          <p className="text-xs text-gray-400 dark:text-gray-500">Loading older messages...</p>
        </div>
      )}

      {Object.entries(groupedMessages).map(([date, msgs]: any) => (
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

                {msg.$id === firstUnreadId && (unreadCountRef.current as number) > 0 && (
                  <div className="w-[100%] mt-6 mb-6 flex-1 flex flex-col !mx-auto !items-center gap-2 py-3 text-sm text-gray-500 dark:text-gray-300">
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

     
    </>
  )
}
