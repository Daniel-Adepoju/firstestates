import { useRef, useState } from "react"
import { Trash2, Reply, Check, CheckCheck, FlagTriangleLeft } from "lucide-react"
import { ReportModal } from "../Modals"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosdata } from "@utils/axiosUrl"

interface Msg {
  _id: string
  senderId: string
  text: string
  createdAt: string | number | Date
  readBy: string[]
  replyingTo?: string
}

interface ChatBubbleProps {
  msg: Msg
  userId: string
  showId: string
  receiverId: string | null
  setShowId: (id: string) => void
  id?: string
  setReply: (content: any) => void
  reply?: string
  nextPageRef?:any
}

const ChatBubble = ({
  msg,
  userId,
  showId,
  setShowId,
  receiverId,
  id,
  setReply,
  reply,
  nextPageRef,
}: ChatBubbleProps) => {
  const queryClient = useQueryClient()
  const [showOptions, setShowOptions] = useState(false)
  const reportRef = useRef<HTMLDialogElement>(null)

  const toggleOptions = () => {
    setShowId(msg._id)
    setShowOptions((prev) => !prev)
  }

  // Handle Delete Message
  const chatId = [userId, receiverId].sort().join("_")

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await axiosdata.value.delete(`/api/chats/${chatId}`, { data: { bubbleId: msg._id } })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] })
    },
  })

  const handleDelete = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    deleteMutation.mutate()
    setShowOptions(false)
  }
  const handleReport = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    setShowOptions(false)
    reportRef.current?.showModal()
  }

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    setShowOptions(false)
  }

  const handleReply = (e: any, content: any) => {
    e.stopPropagation()
    setShowOptions(false)
    setReply(content)
  }
  return (
    <div
    ref={nextPageRef}
      className={`flex flex-col gap-1 w-56 md:w-100  max-w-xs
    
         ${msg.senderId === userId ? "self-end" : " self-start"}
    `}
    >
      {/* Replying To */}
      {msg.replyingTo && (
        <div className="w-[80%] text-gray-500 dark:text-gray-400 self-end text-sm pt-0.5 pb-1 px-2 rounded-md font-medium bg-gray-400/10">
          {`replying to: ${msg.replyingTo}`}
        </div>
      )}
      {/* Main Bubble */}
      <div
        id={id}
        onClick={toggleOptions}
        className={`
                flex flex-col relative
                text-white w-full  min-h-fit break-words whitespace-pre-wrap p-2 pb-1 rounded-xl 
 aftr:absolute after:conten  after:cursor-pointer after:w-6 after:h-3 after:bg-inherit shadow-md after:top-[97%] after:left-0 after:rounded-bl-4xl
          ${
            msg.senderId === userId
              ? "rounded-br-none bg-goldPrimary self-end md:after:left-[93%] after:left-[90%] after:rounded-bl-none after:rounded-br-4xl"
              : "rounded-bl-none bg-gray-600 self-start"
          }`}
      >
        {msg.text}

        <div className="self-end text-sm font-medium">
          {new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </div>

        <div className="checks self-end">
          {receiverId !== null && msg?.readBy?.includes(receiverId) ? (
            <CheckCheck
              color="white"
              size={15}
            />
          ) : (
            <Check
              color="white"
              size={15}
            />
          )}
        </div>
      </div>

      {/* Chat Options */}
      <div className="m-0 flex items-center justify-start bg-black-gray-500/20  w-full">
        {showOptions && showId === msg._id && (
          <div className="flex flex-col items-end">
            <div className="flex flex-row  gap-1 items-center justify-center">
              <div
                onClick={(e) => handleReply(e, msg.text)}
                className="clickable flex  items-center bg-gray-100  dark:bg-gray-500/20 p-1 px-2 rounded-md cursor-pointer text-sm text-white"
              >
                <Reply
                  size={20}
                  className="text-gray-700 dark:text-gray-200"
                />
              </div>
              {msg.senderId === userId ? (
                <div
                  onClick={handleDelete}
                  className="clickable flex gap-1 items-center bg-gray-100  dark:bg-gray-500/20 p-1 px-2 rounded-md cursor-pointer text-sm text-white"
                >
                  <Trash2
                    size={20}
                    className="text-red-500"
                  />
                </div>
              ) : (
                <div
                  onClick={handleReport}
                  className="clickable flex gap-1 items-center bg-gray-100  dark:bg-gray-500/20 p-1 px-2 rounded-md cursor-pointer text-sm text-white"
                >
                  <FlagTriangleLeft
                    size={20}
                    className="text-red-500"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {deleteMutation.isPending && (
        <span
          className={`${msg.senderId === userId ? "self-end" : " self-start"} text-xs font-semibold text-gray-500 dark:text-gray-400`}
        >
          Deleting...
        </span>
      )}
      <ReportModal
        ref={reportRef}
        userId={userId}
        chatContent={msg.text}
        reportedUser={msg.senderId}
        action="chat"
      />
    </div>
  )
}

export default ChatBubble
