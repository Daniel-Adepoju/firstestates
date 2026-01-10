"use client"

import { useRef } from "react"
import { useSearchParams } from "next/navigation"
import { useUser } from "@utils/user"
import RoommateCard from "@components/RoommateCard"
import Card from "@components/listing/Card"
import Pagination from "@components/Pagination"
import { useGetListings, useGetRequests } from "@lib/customApi"
import { useNextPage } from "@lib/useIntersection"
import { Skeleton } from "@components/ui/skeleton"
import { RequestSection } from "./RequestSection"
import { SectionHeader } from "./SectionHeader"
import { useAnimation } from "@lib/useAnimation"
import AgentSection from "./AgentSection"
import { FileX2 } from "lucide-react"
import Link from "next/link"

const SchoolFocus = () => {
  const searchParams = useSearchParams()
  const school = searchParams.get("school") || ""
  const page = searchParams.get("page") || "1"

  const { session } = useUser()
  const username = session?.user?.username
  const displayName = username ? `, ${username}` : ""

  // refs
  const coRentScrollRef = useRef<HTMLDivElement>(null)
  // const roommateScrollRef = useRef<HTMLDivElement>(null)

  // fetch routine

  const { data: listings, isLoading: listingsLoading } = useGetListings({
    limit: 12,
    page,
    school,
  })

  const buildRequestQuery = (type: "co-rent" | "roommate") => ({
    limit: 12,
    school,
    requester: session?.user.id,
    requestType: type,
    // status: "accepted",
    enabled: !!school,
  })

  const coRent = useGetRequests(buildRequestQuery("co-rent"))
  // const roommate = useGetRequests(buildRequestQuery("roommate"))

  const coRentNextRef = useNextPage({
    isLoading: coRent.isLoading,
    hasNextPage: coRent.hasNextPage,
    fetchNextPage: coRent.fetchNextPage,
  })

  // const roommateNextRef = useNextPage({
  //   isLoading: roommate.isLoading,
  //   hasNextPage: roommate.hasNextPage,
  //   fetchNextPage: roommate.fetchNextPage,
  // })

  // ================ RENDERSS ==============

  const renderRequestCards = (requestData: any, nextRef: ReturnType<typeof useNextPage>) => {
    const pages = requestData?.data?.pages
    const firstPage = pages?.[0]?.requests

    if (!firstPage?.length) {
      return (
        <div className="w-full inline-flex items-center justify-center text-sm font-medium">
          <FileX2 className="w-5 h-5 mr-2 text-amber-500" />
          No requests found
        </div>
      )
    }

    return pages.flatMap((page: any) =>
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

if (!listingsLoading && !session?.user) {
  return (
    <div className="mx-auto w-[90%] mt-50 mb-10 px-1.5 flex flex-col items-center justify-center text-center gap-4">
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
        Create an account or log in to use School-Focus
      </h2>   

        <Link
          href="/"
          className="px-6 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500/30 transition"
        >
          Back to homepage
        </Link>
      </div>
  )
}


  return (
    <div className="w-[98%] mt-20 mb-10 px-1.5">
      {school && (
        <h1 className="text-3xl font-bold text-center mb-1 headersFont capitalize">
          School Focus - {school}
        </h1>
      )}

      <div className="text-center text-sm p-2 pb-0 text-gray-700 dark:text-gray-200">
        Welcome to School Focus <strong>{displayName}</strong>.
      </div>
      <div className="text-center text-xs p-2 py-0 text-gray-700 dark:text-gray-200">
        Here you can find <strong>listings</strong>, <strong>agents</strong>, and{" "}
        <strong>roommate requests</strong> near your selected school.
      </div>

      {/* AGENTS */}

      <AgentSection school={school} />
     
      {/* CO-RENT REQUESTS */}
      <SectionHeader
        title="Co-Rent Requests"
        isLoading={coRent.isLoading}
        scrollRef={coRentScrollRef}
      />

      <RequestSection
        // animationRef={ref}
        scrollRef={coRentScrollRef}
        hasContent={coRent?.data?.pages?.[0]?.requests?.length}
        isLoading={coRent.isLoading}
        renderContent={() => renderRequestCards(coRent, coRentNextRef)}
        renderLoading={() => renderSkeletons(9, true)}
        isFetchingMore={coRent.isFetchingNextPage}
      />

      {/* ============= ROOMMATE REQUESTS ============= */}
      {/* <SectionHeader
        title="Roommate Requests"
        isLoading={roommate.isLoading}
        scrollRef={roommateScrollRef}
      />

      <RequestSection
        scrollRef={roommateScrollRef}
        hasContent={roommate?.data?.pages?.[0]?.requests?.length}
        isLoading={roommate.isLoading}
        renderContent={() => renderRequestCards(roommate, roommateNextRef)}
        renderLoading={() => renderSkeletons(9, true)}
        isFetchingMore={roommate.isFetchingNextPage}
      /> */}

      {/* LISTINGS */}
      <h2 className="headersFont mt-4 px-4 text-lg capitalize mx-auto text-center">Listings</h2>

      <div className={`card_list`}>
        {listingsLoading ? (
          renderSkeletons(6)
        ) : listings?.posts?.length > 0 ? (
          listings.posts.map((listing: Listing) => (
            <Card
              key={listing._id}
              listing={listing}
            />
          ))
        ) : (
          <p className="py-4">
            There are no listings near <span className="capitalize font-bold">{school}</span>
          </p>
        )}
      </div>

      {!listingsLoading && (
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
