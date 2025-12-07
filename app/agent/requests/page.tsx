"use client"

import { useSearchParams } from "next/navigation"
import { useUser } from "@utils/user"
import RoomateCard from "@components/RoomateCard"
import { useGetRequests } from "@lib/customApi"
import Pagination from "@components/Pagination"
import ScrollController from "@components/ScrollController"
import { useRef } from "react"
import { MoreVertical } from "lucide-react"
import { Skeleton } from "@components/ui/skeleton"
import { useNextPage } from "@lib/useIntersection"

const RequestsInAgent = () => {
  const searchParams = useSearchParams()

  const { session } = useUser()
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollRef2 = useRef<HTMLDivElement>(null)

  // pending requests fetch
  const {
    data: pendingRequests,
    isLoading: pendingLoading,
    hasNextPage: pendingHasNextPage,
    fetchNextPage: pendingFetchNextPage,
    isFetchingNextPage: pendingIsFetchingNextPage,
  } = useGetRequests({
    limit: 12,
    status: "pending",
    agent: session?.user.id,
    enabled: !!session?.user.id,
  })

  const pendingNextPageRef = useNextPage({
    isLoading: pendingLoading,
    hasNextPage: pendingHasNextPage,
    fetchNextPage: pendingFetchNextPage,
  })

  // accepted requests fetch
  const {
    data: acceptedRequests,
    isLoading: acceptedLoading,
    hasNextPage: acceptedHasNextPage,
    fetchNextPage: acceptedFetchNextPage,
    isFetchingNextPage: acceptedIsFetchingNextPage,
  } = useGetRequests({
    limit: 12,
    status: "accepted",
    agent: session?.user.id,
    enabled: !!session?.user.id,
  })

  const acceptedNextPageRef = useNextPage({
    isLoading: acceptedLoading,
    hasNextPage: acceptedHasNextPage,
    fetchNextPage: acceptedFetchNextPage,
  })

  // pending map
  const pendingMap =
    !!session?.user.id && pendingRequests?.pages[0]?.requests?.length > 0
      ? pendingRequests?.pages.flatMap((items) =>
          items?.requests?.flatMap((request: Request, index: number) => (
            <RoomateCard
              refValue={index === items?.requests?.length - 1 ? pendingNextPageRef : null}
              key={request._id}
              request={request}
              isAgent={true}
            />
          ))
        )
      : "No pending requests found"

  // accepted map
  const acceptedMap =
    !!session?.user.id && acceptedRequests?.pages[0]?.requests?.length > 0
      ? acceptedRequests?.pages.flatMap((items) =>
          items?.requests?.flatMap((request: Request, index: number) => (
            <RoomateCard
              refValue={items?.requests?.length - 1 === index ? acceptedNextPageRef : null}
              key={request._id}
              request={request}
            />
          ))
        )
      : "No accepted requests found"

  const loadingMap = (quantity: number, request?: boolean) => {
    if (request) {
      return Array.from({ length: quantity }).map((_, i) => (
        <Skeleton
          key={i}
          className="relative inline-block h-60 w-85 rounded-md bg-gray-500/20 mb-6"
        >
          <Skeleton className="absolute z-1 bg-gray-300 dark:bg-darkGray w-70 h-40 left-7.5 bottom-[-40px] !animate-none" />
        </Skeleton>
      ))
    } else {
      return Array.from({ length: quantity }).map((_, i) => (
        <Skeleton
          key={i}
          className="inline-block h-75 w-65 rounded-md bg-gray-500/20 mb-6"
        />
      ))
    }
  }

  return (
    session?.user.id && (
      <div className="w-full mb-10">
        <div className="flex flex-col">
          <p className="text-center text-md p-2 font-semibold text-gray-700 dark:text-gray-200">
            Manage all client roommate and co-rent requests in one place.
          </p>
          {/* <p className="text-center text-md p-2 font-semibold text-gray-700 dark:text-gray-200">
            Pending requests are requests are in <span className="w-6 h-6 bg-greenPrimary"></span>
            and roommate requests are in <div className="w-3 h-3 p-2.5 gold-gradient rounded-full"></div>
          </p> */}
        </div>

        {/* pending requests header */}
        <div className="flex items-center w-[98%] mt-4.5 pb-2">
          <h2 className="headersFont w-120 px-4 text-lg dark:text-white">Pending Requests</h2>
          {!pendingLoading && <ScrollController scrollRef={scrollRef} />}
        </div>

        {/* pending requests container */}
        <section
          ref={scrollRef}
          className={`dark:text-white grid grid-flow-col auto-cols-min ${
            pendingRequests?.pages[0]?.requests?.length > 0 || pendingLoading
              ? "h-100"
              : "h-20 whitespace-nowrap mx-auto w-100 flex items-center justify-center text-sm"
          } gap-6 p-2 snap-x snap-mandatory overflow-x-scroll nobar null`}
        >
          {!pendingLoading ? pendingMap : loadingMap(9, true)}
          {pendingIsFetchingNextPage && (
            <MoreVertical
              size={50}
              className="h-8 w-8 my-auto text-gray-500 dark:text-gray-100 animate-pulse"
            />
          )}
        </section>

        {/* accepted requests header */}
        <div className="mt-6 flex items-center w-[98%] pb-2">
          <h2 className="headersFont w-120 px-4 text-lg dark:text-white">Accepted Requests</h2>
          {!acceptedLoading && <ScrollController scrollRef={scrollRef2} />}
        </div>

        {/* accepted requests container */}
        <section
          ref={scrollRef2}
          className={`dark:text-white grid grid-flow-col auto-cols-min ${
            acceptedRequests?.pages[0]?.requests?.length > 0 || acceptedLoading
              ? "h-90"
              : "h-20 whitespace-nowrap mx-auto w-100 flex items-center justify-center text-sm"
          } gap-6 p-2 snap-x snap-mandatory overflow-x-scroll nobar null`}
        >
          {!acceptedLoading ? acceptedMap : loadingMap(9, true)}
          {acceptedIsFetchingNextPage && (
            <MoreVertical
              size={50}
              className="h-8 w-8 my-auto text-gray-500 dark:text-gray-100 animate-pulse"
            />
          )}
        </section>
      </div>
    )
  )
}

export default RequestsInAgent
