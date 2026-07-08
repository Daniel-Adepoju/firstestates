import ChatBubble from "./ChatBubble"
import { Loader2, ArrowDown, FileX2 } from "lucide-react"

export default function MessageList({
  topSentinelRef,
  groupedMessages,
  messagesEndRef,
  loadingMore,
  userId,
  showId,
  setShowId,
  receiverId,
  reply,
  setReply,
  unreadBannerRef,
  firstUnreadId,
  unreadCount,
  getNextPageRef,
  anchorRef,
}: any) {

   console.log(groupedMessages.length)
  return (

    <>
    <div ref={topSentinelRef} className='h-4'/>
      {loadingMore && (
        <div className="text-center pt-2 py-4">
          <Loader2
            className="animate-spin mx-auto mb-1 text-gray-400 dark:text-gray-500"
            size={20}
          />
          <p className="text-xs text-gray-400 dark:text-gray-500">Loading older messages...</p>
        </div>
      )}

      {groupedMessages.map((group: any) => (
        <div key={group.date}>
          <h4 className="text-center text-sm text-gray-500 dark:text-gray-300 my-4">
            {group.date}
          </h4>

          <div className="flex flex-col gap-4 mb-2 nobar null ">
            {group.messages
              .slice()
              .reverse()
              .map((msg: any,index:number) => (
                <div
                  key={msg?._id}
                  className={`w-full flex flex-col flex-1 flex-wrap items-center
                `}
                >
                  {msg?._id === firstUnreadId && unreadCount > 0 && (
                    <div
                      ref={unreadBannerRef}
                      className="w-[100%] mt-6 mb-6 flex-1 flex flex-col !mx-auto !items-center gap-2 py-3 text-sm text-gray-500 dark:text-gray-300"
                    >
                      <span>
                        {unreadCount} new {unreadCount === 1 ? "message" : "messages"}
                      </span>
                      <ArrowDown
                        size={26}
                        onClick={() =>
                          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="p-1 smallScale cursor-pointer rounded-full shadow-lg dark:bg-gray-700 dark:shadow-black"
                      />
                    </div>
                  )}

                  <ChatBubble
                    id={msg?._id}
                    msg={msg}
                    userId={userId}
                    showId={showId}
                    setShowId={setShowId}
                    receiverId={receiverId}
                    reply={reply}
                    setReply={setReply}
                    nextPageRef={index === groupedMessages.length - 1 ? getNextPageRef : null}
                  />
                </div>
              ))}
          </div>
        </div>
      ))}

      {groupedMessages.length < 0 && (
        <div className="mt-46 flex flex-col items-center justify-center gap-2 text-center text-gray-500 dark:text-gray-300">
          <FileX2
            size={40}
            className="text-goldPrimary"
          />
          <span className="text-sm">No message in this chat</span>
        </div>
      )}
    </>
  )
}
