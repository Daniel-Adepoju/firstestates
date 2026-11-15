import { CldImage } from "next-cloudinary"
import { useState } from "react"
import { useUser } from "@utils/user"
import Link from "next/link"
import { Loader2, SendHorizonal } from "lucide-react"
import { useDarkMode } from "@lib/DarkModeProvider"
import { sendComment } from "@lib/server/listing"
import { useNotification } from "@utils/Toast"
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
  isAgent?: boolean
}

export const Comment = ({ comment, refValue }: commentCardProps) => {
  const defaultImage = "firstestatesdefaultuserpicture"
  return (
    <div ref={refValue} className="w-full min-w-0">
      <div className="flex w-full min-w-0 flex-col gap-2 overflow-hidden rounded-md border-b border-b-gray-300 p-4 dark:border-b-gray-600">
        <div className="w-full rounded-full flex flex-row items-center gap-2">
          <CldImage
            // onError={() => setNoImage(true)}
            src={comment?.author.profilePic || defaultImage}
            alt="user icon"
            width={30}
            height={30}
            crop={"fill"}
            gravity="center"
            className="rounded-full"
          />
          <span className="username">{comment?.author.username}</span>
        </div>
        <div className="w-full min-w-0 overflow-hidden break-words whitespace-pre-wrap text-sm">
          {comment?.content}
        </div>
        <div className="self-end text-sm text-gray-400">{parseDate(comment?.createdAt)}</div>
      </div>
    </div>
  )
}

export const WriteComment = ({ listingId, isAgent }: commentCardProps) => {
  const { session } = useUser()
  const { darkMode } = useDarkMode()
  const [content, setContent] = useState("")
  const notification = useNotification()
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
          className={`
      
        ${isAgent ? "pb-2" : "pb-18.5 md:pb-4"}
        backdrop-blur-md bg-white/30 dark:bg-black/20
        w-full min-w-0
        flex flex-row items-center justify-center gap-2
           `}
        >
          <CldImage
            src={session?.user.profilePic}
            alt="user icon"
            width={35}
            height={35}
            crop={"fill"}
            className=" rounded-full"
          />
          <input
            className="w-full min-w-0 flex-1 rounded-lg bg-white px-3 py-2.5 outline-2 outline-gray-200 duration-200 ease-in-out focus:outline-goldPrimary dark:bg-[#17191e] dark:outline-gray-600/80 dark:placeholder-gray-300"
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
