import { useRef, useState } from "react"
import { Trash2, FlagTriangleRight, Check, CheckCheck } from "lucide-react"
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
  recipientId: string | null
  setShowId: (id: string) => void
  id?: string
}

const ChatBubble = ({ msg, userId, showId, setShowId, recipientId, id }: ChatBubbleProps) => {
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
  return (
    <>
      <div
        id={id}
        onClick={toggleOptions}
        className={`
                flex flex-col relative
                text-white w-50 md:w-100 min-h-fit break-words whitespace-pre-wrap p-2 rounded-lg max-w-xs
 after:absolute after:content-['']  after:cursor-pointer after:w-6 after:h-3 after:bg-inherit shadow-md after:top-[97%] after:left-0 after:rounded-bl-4xl
          ${
            msg.senderId === userId
              ? "rounded-br-none bg-goldPrimary self-end md:after:left-[93%] after:left-[88%] after:rounded-bl-none after:rounded-br-4xl"
              : "rounded-bl-none bg-gray-600 self-start"
          }`}
      >
        {msg.text}
        <div className="checks self-end">
          {recipientId !== null && msg?.readBy?.includes(recipientId) ? (
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
        <div className="flex flex-col items-end">
          {showOptions && showId === msg.$id && (
            <div className="flex flex-col items-end">
              <div className="flex flex-row items-center justify-center gap-2">
                {msg.senderId === userId ? (
                  <div
                    onClick={handleDelete}
                    className="clickable flex gap-1 items-center bg-black/10 p-1 px-2 rounded cursor-pointer text-sm text-white"
                  >
                    <Trash2 color="white" />
                    Delete
                  </div>
                ) : (
                  <div
                    onClick={handleReport}
                    className="clickable flex gap-1 items-center bg-black/10 p-1 px-2 rounded cursor-pointer text-sm text-white"
                  >
                    
                    <FlagTriangleRight className="text-red-600" />
                    Report
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <ReportModal
        ref={reportRef}
        userId={userId}
        chatContent={msg.text}
        reportedUser={msg.senderId}
      />
    </>
  )
}

export default ChatBubble
