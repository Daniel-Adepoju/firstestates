"use client"

import { useSearchParams } from "next/navigation"
import { useUser } from "@utils/user"
import RoommateCard from "@components/RoommateCard"
import ScrollController from "@components/ScrollController"
import { useGetRequests } from "@lib/customApi"
import { Skeleton } from "@components/ui/skeleton"
import { MoreVertical } from "lucide-react"
import { useNextPage } from "@lib/useIntersection"
import { useRef } from "react"

const ListingRequests = ({ requestType }: any) => {
  const searchParams = useSearchParams()
  const listingId = searchParams.get("listing")
  const { session } = useUser()

  const scrollRef = useRef<HTMLDivElement>(null)

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetRequests({
    limit: 12,
    listingId: listingId || "",
    requestType: requestType || "",
    // requester: session?.user.id,
    status: "accepted",
    enabled: !!listingId && !!requestType,
  })

  const nextPageRef = useNextPage({
    isLoading,
    hasNextPage,
    fetchNextPage,
  })

  // Map requests
  const requestMap =
    data?.pages[0]?.requests?.length > 0
      ? data?.pages.flatMap((page) =>
          page.requests.map((request: Request, index: number) => (
            <RoommateCard
              key={request._id}
              request={request}
              refValue={index === page.requests.length - 1 ? nextPageRef : null}
            />
          ))
        )
      : "No requests found"

  // Loading skeletons
  const loadingMap = Array.from({ length: 9 }).map((_, i) => (
    <Skeleton
      key={i}
      className="relative inline-block h-60 w-85 rounded-md bg-gray-500/20 mb-6"
    >
      <Skeleton className="absolute z-1 bg-gray-300 dark:bg-darkGray w-70 h-40 left-7.5 bottom-[-40px] !animate-none" />
    </Skeleton>
  ))

  return (
    <div className="w-full mt-30 mb-10 px-2">
      <h2 className="w-100 headersFont text-xl mb-2 capitalize mx-auto text-center">
        {requestType === "roommate" ? "Roommate Requests" : "Co-Rent Requests"} on this listing
      </h2>

      <div className="flex items-center w-full pb-2">
        {!isLoading && <ScrollController scrollRef={scrollRef} />}
      </div>

      <section
        ref={scrollRef}
        className={`grid grid-flow-col auto-cols-min ${
          isLoading || data?.pages[0]?.requests?.length > 0
            ? "h-90"
            : "h-20 whitespace-nowrap mx-auto w-full flex items-center justify-center text-sm"
        } gap-6 p-2 snap-x snap-mandatory overflow-x-scroll nobar`}
      >
        {!isLoading ? requestMap : loadingMap}

        {isFetchingNextPage && (
          <MoreVertical
            size={45}
            className="h-8 w-8 my-auto text-gray-500 dark:text-gray-100 animate-pulse"
          />
        )}
      </section>
    </div>
  )
}

export default ListingRequests
