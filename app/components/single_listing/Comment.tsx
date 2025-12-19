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
      
        pb-16 md:pb-0
        backdrop-blur-xs
        w-[90%] md:w-[70%] mx-auto
        flex flex-row justify-center items-center gap-2"
        >
          <CldImage
            src={session?.user.profilePic}
            alt="user icon"
            width={35}
            height={35}
            crop={"auto"}
            className=" rounded-full"
          />
          <input
            className="flex-1 w-80 px-2 py-2.5  rounded-lg outline-2 outline-gray-600 dark:outline-gray-300 dark:placeholder-gray-300"
            type="text"
            value={content}
            required
            minLength={10}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
          />
          <button>
            {sending ? (
              <Loader2
                size={28}
                className="text-goldPrimary animate-spin"
              />
            ) : (
              <SendHorizonal
                size={28}
                className="text-goldPrimary cursor-pointer mediumScale"
              />
            )}
          </button>
        </form>
      ) : (
        <div
          className="mx-auto text-center     
        pb-16 md:pb-0"
        >
          <Link
            href="/login"
            className="quickLink text-sm"
          >
            Sign in
          </Link>{" "}
          to leave a comment
        </div>
      )}
    </>
  )
}
