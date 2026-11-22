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
      <div className="flex w-full min-w-0 flex-col gap-3 overflow-hidden rounded-2xl border border-border/50 bg-background/45 p-4 transition-colors hover:border-primary/20">
        <div className="flex w-full flex-row items-center gap-3">
          <CldImage
            // onError={() => setNoImage(true)}
            src={comment?.author.profilePic || defaultImage}
            alt="user icon"
            width={100}
            height={100}
            crop={"fill"}
            gravity="center"
            className="h-9 w-9 rounded-full ring-2 ring-primary/10"
          />
          <span className="username text-sm font-semibold text-foreground">{comment?.author.username}</span>
        </div>
        <div className="w-full min-w-0 overflow-hidden break-words whitespace-pre-wrap text-sm">
          {comment?.content}
        </div>
        <div className="self-end text-xs font-medium text-muted-foreground">{parseDate(comment?.createdAt)}</div>
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
        ${isAgent ? "pb-2" : "pb-4"}
        mt-2 w-full min-w-0 flex flex-row items-center justify-center gap-3 border-t border-border/50 pt-5
           `}
        >
          <CldImage
            src={session?.user.profilePic}
            alt="user icon"
            width={100}
            height={100}
            crop={"fill"}
            className="h-9 w-9 rounded-full ring-2 ring-primary/10"
          />
          <input
            className="w-full min-w-0 flex-1 rounded-2xl border border-border/60 bg-secondary/35 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-white/[0.04] dark:placeholder:text-slate-400"
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
                className="text-primary animate-spin"
              />
            ) : (
              <SendHorizonal
                size={28}
                className="cursor-pointer text-primary transition hover:scale-105"
              />
            )}
          </button>
        </form>
      ) : (
        <div
          className="mx-auto border-t border-border/50 pt-5 text-center text-sm text-muted-foreground"
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
