"use client"

import { useRef } from "react"
import { useGetRequests } from "@lib/customApi"
import { useUser } from "@utils/user"
import { useNextPage } from "@lib/useIntersection"
import RoommateCard from "@components/RoommateCard"
import { Skeleton } from "@components/ui/skeleton"
import { MoreVertical } from "lucide-react"
import ScrollController from "@components/ScrollController"
import { FileX2, FileX } from "lucide-react"

const BookmarkedRequests = () => {
  const { session } = useUser()
  const userId = session?.user?.id
  const scrollRef = useRef<any>(null)

  const { data, isLoading, isError, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetRequests({
      limit: 12,
      isBookmarked: "true",
      // status: "accepted",
      requester: userId,
      enabled: Boolean(userId),
    })
  let hasContent = data?.pages?.[0]?.requests?.length > 0

  console.log(data)
  const nextPageRef = useNextPage({ fetchNextPage, isFetchingNextPage, hasNextPage })

  const renderRequestCards = (requestData: any, nextRef: ReturnType<typeof useNextPage>) => {
    const pages = requestData?.pages
    const firstPage = requestData?.pages[0]?.requests

    if (!firstPage?.length && !isLoading) {
      return (
        <div className="w-full inline-flex items-center justify-center text-sm font-medium">
          <FileX2 className="w-5 h-5 mr-2 text-amber-500" />

          No have no bookmarked requests
        </div>
      )
    }

    return pages?.flatMap((page: any) =>
      page.requests.map((req: Request, index: number) => {
        const isLast = index === page.requests.length - 1
        return (
          <RoommateCard
            key={req._id}
            request={req}
            refValue={isLast ? nextRef : null}
          />
        )
      })
    )
  }

  const renderSkeletons = (count: number, isRequest?: boolean) =>
    Array.from({ length: count }).map((_, i) =>
      isRequest ? (
        <Skeleton
          key={i}
          className="relative inline-block h-60 w-85 rounded-md bg-gray-500/20 dark:bg-gray-500/40 mt-6"
        >
          <Skeleton className="absolute z-1 bg-gray-300 dark:bg-gray-500 w-70 h-40 left-7.5 bottom-[-40px] !animate-none" />
        </Skeleton>
      ) : (
        <Skeleton
          key={i}
          className="inline-block h-75 w-65 rounded-md bg-gray-500/20 mb-6 first:mt-6 last:mb-6"
        />
      )
    )
  return (
    <div className="mt-20 w-[98%] mx-auto">
      <h2 className="headersFont mt-4 px-4 py-4 text-lg capitalize mx-auto text-center">
        Your Bookmarked Requests
      </h2>

      {!isLoading && <ScrollController scrollRef={scrollRef} />}

      <section
        ref={scrollRef}
        className={`mt-4  bg-white dark:bg-darkGray  ${
          hasContent || isLoading
            ? "h-90 grid grid-flow-col auto-cols-min pt-5"
            : "h-20 whitespace-nowrap mx-auto  w-full text-sm flex items-center "
        } gap-6 px-2  pb-0 snap-x snap-mandatory overflow-x-scroll nobar null outline-2 outline-gray-200 dark:outline-black/20 rounded-lg`}
      >
        {isLoading ? renderSkeletons(10, true) : renderRequestCards(data, nextPageRef)}

        {isFetchingNextPage && (
          <MoreVertical
            size={50}
            className="h-8 w-8 my-auto text-gray-600 dark:text-gray-100 animate-pulse"
          />
        )}
      </section>
    </div>
  )
}

export default BookmarkedRequests
