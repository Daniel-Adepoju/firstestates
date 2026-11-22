import { Eye, EyeClosed, Loader2, SendHorizonal, X, AudioLines } from "lucide-react"
import Guidelines from "./Guidelines"
import PopularCard from "@components/listing/PopularCard"
import { useGetSingleListing } from "@lib/customApi"
import { Skeleton } from "@components/ui/skeleton"
import VoiceRecorder from "./VoiceRecorder"

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
  sendVoiceMessage,
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
                showPopular={false}
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
            {typeof reply === "string" ? reply : <><AudioLines size={14} className="mr-1 inline" />Replied to audio</>}
          </div>
        </div>
      )}
      <div className="flex items-center gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage() } }}
          placeholder="Type your message..."
          rows={1}
          className="max-h-28 min-h-11 flex-1 resize-none border-2 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300"
        />

        {text.trim() ? <button onClick={handleSendMessage} disabled={sending} className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-60" aria-label="Send message">{sending ? <Loader2 className="animate-spin" size={20} /> : <SendHorizonal size={20} />}</button> : <VoiceRecorder onSend={sendVoiceMessage} disabled={sending} />}
      </div>
    </div>
  )
}
