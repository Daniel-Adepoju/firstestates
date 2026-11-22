"use client"

import { Loader2 } from "lucide-react"
import { Skeleton } from "@components/ui/skeleton"
import { Comment, WriteComment, CommentProps } from "@components/single_listing/Comment"
import { useNextPage } from "@lib/useIntersection"

interface CommentsSectionProps {
  listingId: string
  commentsQuery: any
  isAgent?:boolean
}

const CommentsSection = ({ listingId, commentsQuery ,isAgent}: CommentsSectionProps) => {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = commentsQuery
  const ref = useNextPage({ commentLoading: isLoading, hasNextPage, fetchNextPage })
const demoComment = {
   content: 'This is a demo comment.',
   createdAt: new Date(),
   author: 'nonone'
}
  return (
    <div className="singleCardSection listing-soft-section relative w-full min-w-0">
      <div className="single_card listing-soft-card">
        <div className="heading listing-section-heading mx-auto">Comments</div>

        <div className="flex max-h-[32rem] w-full min-w-0 flex-col items-stretch gap-3 overflow-y-auto py-5">
          {isLoading ? (
            <Skeleton className="h-24 w-full rounded-2xl bg-primary/5" />
          )  : (
            data?.pages.flatMap((page: any) =>
              page.comments.map((comment: CommentProps, index: number) => (
                <div key={comment._id} className="w-full min-w-0">
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
          {/* <>
           <Comment
                    comment={demoComment}
                    listingId={listingId}
                  />
                     <Comment
                    comment={demoComment}
                    listingId={listingId}
                  />
                   <Comment
                    comment={demoComment}
                    listingId={listingId}
                  />
                     <Comment
                    comment={demoComment}
                    listingId={listingId}
                  />
                   <Comment
                    comment={demoComment}
                    listingId={listingId}
                  />
                     <Comment
                    comment={demoComment}
                    listingId={listingId}
                  />
                   <Comment
                    comment={demoComment}
                    listingId={listingId}
                  />
                     <Comment
                    comment={demoComment}
                    listingId={listingId}
                  />
                   <Comment
                    comment={demoComment}
                    listingId={listingId}
                  />
                     <Comment
                    comment={demoComment}
                    listingId={listingId}
                  />
            </> */}
        </div>

        <WriteComment listingId={listingId} isAgent={isAgent} />
      </div>
    </div>
  )
}

export default CommentsSection
