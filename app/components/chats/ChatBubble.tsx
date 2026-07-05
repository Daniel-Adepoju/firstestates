import { useRef, useState } from "react"
import { Trash2, Reply, Check, CheckCheck, FlagTriangleLeft } from "lucide-react"
import { ReportModal } from "../Modals"
import { deleteMessage } from "@lib/server/chats"

interface Msg {
  $id: string
  senderId: string
  text: string
  createdAt: string | number | Date
  readBy: string[]
}

interface ChatBubbleProps {
  msg: Msg
  userId: string
  showId: string
  receiverId: string | null
  setShowId: (id: string) => void
  id?: string
}

const ChatBubble = ({ msg, userId, showId, setShowId, receiverId, id }: ChatBubbleProps) => {
  const [showOptions, setShowOptions] = useState(false)
  const reportRef = useRef<HTMLDialogElement>(null)

  const toggleOptions = () => {
    setShowId(msg.$id)
    setShowOptions((prev) => !prev)
  }

  const handleDelete = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    await deleteMessage(msg.$id)
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

  const handleReply = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, content: any) => {
    e.stopPropagation()
    setShowOptions(false)
    setReply(content)
  }
  return (
    <div
      className={`flex flex-col gap-1 w-56 md:w-100  max-w-xs
    
         ${msg.senderId === userId ? "self-end" : " self-start"}
    `}
    >
      {/* Replying To */}
      <div className="w-[80%] text-gray-400 dark:text-gray-500 self-end text-sm pt-0.5 pb-1 px-2 rounded-md font-medium bg-gray-400/10">
        {`replying to i dont know`}
      </div>

      {/* Main Bubble */}
      <div
        id={id}
        onClick={toggleOptions}
        className={`
                flex flex-col relative
                text-white w-full  min-h-fit break-words whitespace-pre-wrap p-2 rounded-xl 
 aftr:absolute after:conten  after:cursor-pointer after:w-6 after:h-3 after:bg-inherit shadow-md after:top-[97%] after:left-0 after:rounded-bl-4xl
          ${
            msg.senderId === userId
              ? "rounded-br-none bg-goldPrimary self-end md:after:left-[93%] after:left-[90%] after:rounded-bl-none after:rounded-br-4xl"
              : "rounded-bl-none bg-gray-600 self-start"
          }`}
      >
        {msg.text}
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

        <div className="self-end text-sm font-medium">
          {new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </div>
      </div>

      {/* Chat Options */}
      <div className="m-0 flex items-center justify-start bg-black-gray-500/20  w-full">
        {showOptions && showId === msg.$id && (
          <div className="flex flex-col items-end">
            <div className="flex flex-row items-center justify-center">
              <div
                onClick={() => handleReply(e, msg.text)}
                className="clickable flex gap-1 items-center bg-black/10 p-1 px-2 rounded cursor-pointer text-sm text-white"
              >
                <Reply
                  size={20}
                  className="text-gray-700 dark:text-gray-200"
                />
              </div>
              {msg.senderId === userId ? (
                <div
                  onClick={handleDelete}
                  className="clickable flex gap-1 items-center bg-black/10 p-1 px-2 rounded cursor-pointer text-sm text-white"
                >
                  <Trash2
                    size={20}
                    className="text-red-500"
                  />
                </div>
              ) : (
                <div
                  onClick={handleReport}
                  className="clickable flex gap-1 items-center bg-black/10 p-1 px-2 rounded cursor-pointer text-sm text-white"
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
