"use client"

import { useSearchParams } from "next/navigation"
import { useUser } from "@utils/user"
import RoomateCard from "@components/RoomateCard"
import Card from "@components/Card"
import { useGetListings, useGetRequests } from "@lib/customApi"
import Pagination from "@components/Pagination"
import ScrollController from "@components/ScrollController"
import { useRef } from "react"
import { MoreVertical } from "lucide-react"
import { Skeleton } from "@components/ui/skeleton"
import { useNextPage } from "@lib/useIntersection"

const SchoolFocus = () => {
  const searchParams = useSearchParams()
  const school = searchParams.get("school")
  const { session } = useUser()
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollRef2 = useRef<HTMLDivElement>(null)
  const userName = session?.user?.username
  const displayName = userName ? `, ${userName}` : ""
  const page = useSearchParams().get("page") || "1"

  // listings fetch
  const {
    data: listings,
    isLoading,
    isError,
  } = useGetListings({ limit: 2, page: page, school: school || "" })

  // co rent fetch

  const {
    data: coRentRequests,
    isLoading: coRentLoading,
    hasNextPage: coRentHasNextPage,
    fetchNextPage: coRentFetchNextPage,
    isFetchingNextPage: coRentIsFetchingNextPage,
  } = useGetRequests({
    limit: 12,
    school: school || "",
    requestType: "co-rent",
    requester: session?.user.id,
    enabled: !!school,
    // status:"accepted",
  })
  const coRentNextPageRef = useNextPage({
    isLoading: coRentLoading,
    hasNextPage: coRentHasNextPage,
    fetchNextPage: coRentFetchNextPage,
  })

  //  roommate fetch
  const {
    data: roommateRequests,
    isLoading: roommateLoading,
    hasNextPage: roommateHasNextPage,
    fetchNextPage: roommateFetchNextPage,
    isFetchingNextPage: roommateIsFetchingNextPage,
  } = useGetRequests({
    limit: 12,
    school: school || "",
    requestType: "roommate",
    requester: session?.user.id,
    enabled: !!school,
    // status: "accepted",
  })

  const roommateNextPageRef = useNextPage({
    isLoading: roommateLoading,
    hasNextPage: roommateHasNextPage,
    fetchNextPage: roommateFetchNextPage,
  })

  // co-rent map
  const coRentMap =
    coRentRequests?.pages[0]?.requests?.length > 0
      ? coRentRequests?.pages.flatMap((items) =>
          items?.requests?.flatMap((request: Request, index: number) => (
            <RoomateCard
              refValue={index === items?.requests?.length - 1 ? coRentNextPageRef : null}
              key={request._id}
              request={request}
              // firstItem={index === 0}
              // lastItem={index === items?.requests?.length - 1}
            />
          ))
        )
      : "No co-rent requests found"

  // roommate map
  const roommateMap =
    roommateRequests?.pages[0]?.requests?.length > 0
      ? roommateRequests?.pages.flatMap((items) =>
          items?.requests?.flatMap((request: Request, index: number) => (
            <RoomateCard
              refValue={items?.requests?.length - 1 === index ? roommateNextPageRef : null}
              key={request._id}
              request={request}
              //   firstItem={index === 0}
              // lastItem={index === items?.requests?.length - 1}
            />
          ))
        )
      : "No roommate requests found"

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
    <div className="w-full mt-20 mb-10 px-1.5">
      {school && (
        <h1 className="text-3xl font-bold text-center mb-1 headersFont capitalize">
          School Focus - {school}
        </h1>
      )}
      <p className="text-center text-sm p-2 text-gray-700 dark:text-gray-200">
        Welcome to School Focus <strong>{displayName}</strong>. Here you can find{" "}
        <strong>listings</strong> and <strong>roommate requests</strong> near your school of choice.
      </p>

      {/* co-rent requests header */}
      <div className="flex items-center w-[98%] mt-4.5 pb-2">
        <h2 className="headersFont w-120 px-4 text-lg">Co-Rent Requests</h2>
        {!coRentLoading && <ScrollController scrollRef={scrollRef} />}
      </div>

      {/* co-rent requests container */}

      <section
        ref={scrollRef}
        className={`grid grid-flow-col auto-cols-min ${
          coRentRequests?.pages[0]?.requests?.length > 0 || coRentLoading
            ? "h-90"
            : "h-20 whitespace-nowrap mx-auto w-100 flex items-center justify-center text-sm"
        } gap-6 p-2 snap-x snap-mandatory overflow-x-scroll nobar null`}
      >
        {!coRentLoading ? coRentMap : loadingMap(9, true)}
        {coRentIsFetchingNextPage && (
          <MoreVertical
            size={50}
            className=" h-8 w-8 my-auto  text-gray-500 dark:text-gray-100 animate-pulse"
          />
        )}
      </section>

      {/* roommate requests header */}
      <div className="flex items-center w-[98%] pb-2">
        <h2 className="headersFont w-120 px-4 text-lg">Roommate Requests</h2>
        {!roommateLoading && <ScrollController scrollRef={scrollRef2} />}
      </div>

      {/*roomate requests container*/}
      <section
        ref={scrollRef2}
        className={`grid grid-flow-col auto-cols-min ${
          roommateRequests?.pages[0]?.requests?.length > 0 || roommateLoading
            ? "h-90 "
            : "h-20 whitespace-nowrap mx-auto w-100 flex items-center justify-center text-sm"
        } gap-6 p-2  snap-x snap-mandatory overflow-x-scroll nobar null`}
      >
        {!roommateLoading ? roommateMap : loadingMap(9, true)}
        {roommateIsFetchingNextPage && (
          <MoreVertical
            size={50}
            className="h-8 w-8 my-auto  text-gray-500 dark:text-gray-100 animate-pulse"
          />
        )}
      </section>

      {/*listings in school*/}

      <h2 className="headersFont px-4 text-lg capitalize mx-auto text-center">Listings</h2>

      {/*listings container*/}
      <div
        id="listing"
        className="card_list"
      >
        {isLoading ? (
          loadingMap(6)
        ) : listings.posts.length > 0 ? (
          listings?.posts?.map((listing: Listing) => (
            <Card
              key={listing._id}
              listing={listing}
            />
          ))
        ) : (
          <p className="pb-2">
            There are currently no listings near{" "}
            <span className="capitalize font-bold">{school}</span>{" "}
          </p>
        )}
      </div>
      {!isLoading && (
        <Pagination
          currentPage={Number(listings?.cursor)}
          totalPages={Number(listings?.numOfPages)}
          hashParams="#listing"
        />
      )}
    </div>
  )
}

export default SchoolFocus
