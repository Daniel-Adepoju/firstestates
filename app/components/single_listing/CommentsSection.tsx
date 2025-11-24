"use client"

import { Loader2 } from "lucide-react"
import { Skeleton } from "@components/ui/skeleton"
import { Comment, WriteComment, CommentProps } from "@components/single_listing/Comment"
import { useNextPage } from "@lib/useIntersection"

interface CommentsSectionProps {
  listingId: string
  commentsQuery: any
}

const CommentsSection = ({ listingId, commentsQuery }: CommentsSectionProps) => {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = commentsQuery
  const ref = useNextPage({ commentLoading: isLoading, hasNextPage, fetchNextPage })

  return (
    <div className="singleCardSection relative">
      <div className="single_card">
        <div className="heading mx-auto">Comments</div>

        <div className="pt-6 pb-16 flex flex-col items-center gap-4 max-h-200 overflow-y-auto nobar w-full">
          {isLoading ? (
            <Skeleton className="bg-gray-200 w-full h-[100px] rounded-xl" />
          ) : data?.pages[0].comments.length === 0 ? (
            <div className="text-gray-500 dark:text-white text-center">
              No comments yet. Be the first to share your thoughts!
            </div>
          ) : (
            data?.pages.flatMap((page: any) =>
              page.comments.map((comment: CommentProps, index: number) => (
                <div key={comment._id}>
                  <Comment
                    comment={comment}
                    refValue={index === page.comments.length - 1 ? ref : null}
                    listingId={listingId}
                  />
                  {isFetchingNextPage && (
                    <Loader2
                      size={20}
                      className="text-goldPrimary animate-spin absolute bottom-12 left-[50%]"
                    />
                  )}
                </div>
              ))
            )
          )}
        </div>

        <WriteComment listingId={listingId} />
      </div>
    </div>
  )
}

export default CommentsSection
