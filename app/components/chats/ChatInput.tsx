import { useState } from "react"
import { Eye, EyeClosed, Loader2, SendHorizonal, X } from "lucide-react"
import Guidelines from "./Guidelines"
import PopularCard from "@components/listing/PopularCard"
import { useGetSingleListing } from "@lib/customApi"
import { Skeleton } from "@components/ui/skeleton"

export default function ChatInput({
  text,
  setText,
  handleSendMessage,
  sending,
  reply,
  setReply,
  listingId,
  showListing,
  setShowListing,
}: any) {
  const { data, isLoading } = useGetSingleListing(listingId)

  const listing = data?.post

  return (
    <div className="w-full relative">
      {listingId &&
        (showListing ? (
          <div className="flex items-center gap-2 mb-2">
            <div
              onClick={() => setShowListing(false)}
              className="absolute top-4 right-0 flex items-center justify-center w-8 h-6.5 mb-2 font-bold bg-amber-500 text-white rounded-lg cursor-pointer transition-all duration-300 hover:bg-amber-600 hover:scale-101"
            >
              <EyeClosed
                size={18}
                className="text-white"
              />
            </div>
            {isLoading ? (
              <Skeleton className="bg-gray-500/20 w-42 md:w-43 h-38" />
            ) : (
              <PopularCard
                listing={listing}
                wAndH={"w-42 md:w-43 min-h-35"}
              />
            )}
            <span className="text-sm text-gray-500 dark:text-gray-300">
              Chat <strong>{listing?.agent?.username || ""}</strong> about this listing
            </span>
          </div>
        ) : (
          <div
            onClick={() => setShowListing(true)}
            className="flex items-center justify-center w-8 h-6.5 mb-2 font-bold bg-amber-500 text-white rounded-lg cursor-pointer transition-all duration-300 hover:bg-amber-600 hover:scale-101"
          >
            <Eye
              size={18}
              className="text-white"
            />
          </div>
        ))}

      {!reply ? (
        !showListing ? (
          <Guidelines />
        ) : (
          <span>{""}</span>
        )
      ) : (
        <div className="relative mb-2 w-[60%] pt-4 pb-6 px-3 rounded-br-xl rounded-tr-xl bg-gray-100 dark:bg-gray-500/20 backdrop-blur-sm text-gray-700 dark:text-white">
          <div className="flex justify-between items-center px-1">
            <span className="font-semibold text-sm">Replying To:</span>

            <span
              onClick={() => setReply("")}
              className="flex items-center justify-center bg-red-600 p-1 w-5 h-5 rounded-full"
            >
              <X
                className="text-white cursor-pointer font-bold"
                size={18}
              />
            </span>
          </div>

          <div className="mt-4 w-[99%] text-sm overflow-hidden whitespace-nowrap text-ellipsis">
            {reply}
          </div>
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
          placeholder="Type your message..."
          className="flex-1 border-2 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 resize-none"
        />

        <button
          onClick={handleSendMessage}
          disabled={sending || !text.trim()}
          className="w-11 h-11 border-r-goldPrimary border-t-goldPrimary border-b-amber-400 border-l-amber-400 border-3 rounded-full gold-gradient text-white flex items-center justify-center hover:opacity-90 transition"
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
  )
}
