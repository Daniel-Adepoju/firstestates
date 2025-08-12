import { CldImage } from "next-cloudinary"
import { useState } from "react"
import { useUser } from "@utils/user"
import Link from "next/link"
import { Loader2, SendHorizonal } from "lucide-react"
import { useDarkMode } from "@lib/DarkModeProvider"
import { sendComment } from "@lib/server/listing"
import { useNotification } from "@lib/Notification"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNextPage } from "@lib/useIntersection"
import { parseDate } from "@utils/date"

interface CommentAuthor {
  username: string
  profilePic: string
}

export interface CommentProps {
  _id?: string
  author: CommentAuthor
  content: string
  createdAt: string
}

interface commentCardProps {
  comment?: CommentProps
  listingId?: string
  refValue?: ReturnType<typeof useNextPage> | null
}

export const Comment = ({ comment, refValue }: commentCardProps) => {
  const [noImage, setNoImage] = useState(false)
  const defaultImage = "firstestatesdefaultuserpicture"
  return (
    <div ref={refValue}>
      <div className="w-full overflow-hidden outline-1 outline-gray-300 p-4 rounded-lg flex flex-col gap-2">
        <div className="w-full rounded-full flex flex-row items-center gap-2">
          <CldImage
            // onError={() => setNoImage(true)}
            src={comment?.author.profilePic || defaultImage}
            alt="user icon"
            width={30}
            height={30}
            crop={"auto"}
            className="rounded-full border-1 border-white"
          />
          <span className="username">{comment?.author.username}</span>
        </div>
        <div className="whitespace-pre-wrap overflow-hidden break-words w-80 md:w-120 lg:w-150">
          {comment?.content}
        </div>
        <div className="self-end text-sm text-gray-400">{parseDate(comment?.createdAt)}</div>
      </div>
    </div>
  )
}

export const WriteComment = ({ listingId }: commentCardProps) => {
  const { session } = useUser()
  const { darkMode } = useDarkMode()
  const [content, setContent] = useState("")
  const { notification } = useNotification()
  const [sending, setSending] = useState(false)
  const queryClient = useQueryClient()

  const handleSendComment = async () => {
    setSending(true)
    try {
      const res = await sendComment({
        content,
        listing: listingId,
      })
      setSending(false)
      setContent("")
      notification.setIsActive(true)
      notification.setMessage(res.message)
      notification.setType(res.status)
    } catch (err) {
      console.log(err)
    }
  }
  const sendCommentMutation = useMutation({
    mutationFn: handleSendComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", listingId] })
    },
  })

  return (
    <>
      {session?.user ? (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            sendCommentMutation.mutate()
          }}
          className="
        absolute bottom-0 left-5
        p-6
        px-5
        backdrop-blur-xs
        w-[90%] h-10 md:w-[70%] md:left-35 lg:left-50
        flex flex-row justify-center items-center gap-2"
        >
          <CldImage
            src={session?.user.profilePic}
            alt="user icon"
            width={30}
            height={30}
            crop={"auto"}
            className=" rounded-full border-1 border-white"
          />
          <input
            className="flex-1 w-80 p-2 rounded-lg outline-2 outline-gray-600"
            type="text"
            value={content}
            required
            minLength={10}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
          />
          <button>
            {sending ? (
              <Loader2
                size={25}
                className="animate-spin"
                color={darkMode ? "#A88F6E" : "#0874c7"}
              />
            ) : (
              <SendHorizonal
                size={25}
                className="cursor-pointer mediumScale"
                color={darkMode ? "#A88F6E" : "#0874c7"}
              />
            )}
          </button>
        </form>
      ) : (
        <div className="mx-auto text-center">
          <Link
            href="/login"
            className="quickLink "
          >
            Sign in
          </Link>{" "}
          to comment
        </div>
      )}
    </>
  )
}
