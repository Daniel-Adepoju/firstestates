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
import AgentSection from "./AgentSection"
import { ChevronDownCircle, FileX2, Home, Search, UsersRound } from "lucide-react"
import Link from "next/link"
import Filter from "@components/Filter"
import { useSignal } from "@preact/signals-react"
import { useSignals } from "@preact/signals-react/runtime"

const SchoolFocus = () => {
  useSignals()
  const searchParams = useSearchParams()
  const schoolParam = searchParams.get("school") || ""
  const page = searchParams.get("page") || "1"

  const { session } = useUser()
  const username = session?.user?.username
  const displayName = username ? `, ${username}` : ""

  // refs
  const coRentScrollRef = useRef<HTMLDivElement>(null)
  // const roommateScrollRef = useRef<HTMLDivElement>(null)

  // ======= Filters ============
  const location = useSignal("")
  const school = useSignal(schoolParam)
  const minPrice = useSignal("")
  const maxPrice = useSignal("")
  const beds = useSignal("")
  const baths = useSignal("")
  const toilets = useSignal("")
  const active = useSignal(false)

  // ============= Fetch routine ==================

  const { data: listings, isLoading: listingsLoading } = useGetListings({
    limit: 12,
    page,
    school: schoolParam,
    location: location.value,
    minPrice: minPrice.value,
    maxPrice: maxPrice.value,
    beds: beds.value,
    baths: baths.value,
    toilets: toilets.value,
  })

  const buildRequestQuery = (type: "co-rent" | "roommate") => ({
    limit: 12,
    school: schoolParam,
    requester: session?.user.id,
    requestType: type,
    status: "accepted",
    enabled: !!schoolParam,
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
      }),
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
      ),
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
    <div className="mb-20 mt-16 w-full md:mb-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <section className="w-full dark-to-lightblue-gradient relative overflow-hidden rounded-br-[2rem] rounded-bl-[2rem] px-6 py-10 text-white shadow-xl sm:px-10 sm:py-14">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
              <Search
                size={16}
                className="text-[#f7b657]"
              />
              School Focus
            </div>
            <h1 className={`${schoolParam && "uppercase"}  font-list text-4xl md:text-6xl font-semibold leading-tight capitalize`}>
              {schoolParam || "Find your school community"}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-blue-50 sm:text-lg">
             <strong>Welcome{displayName}. </strong>  Explore homes, meet active agents, and discover the people
              looking for a better way to live near campus
            </p>
          </div>
          <div className="relative mt-8 flex flex-wrap gap-3 text-sm">
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur-sm">
              <Home
                size={17}
                className="text-[#f7b657]"
              />{" "}
              Listings near campus
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur-sm">
              <UsersRound
                size={17}
                className="text-[#7ee2a8]"
              />{" "}
              Local agents and co-renters
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-10 px-3">
          {/* AGENTS */}
          <section className="flex flex-col gap-3">
            <AgentSection school={schoolParam} />
          </section>

          {/* CO-RENT REQUESTS */}
          <section className="flex flex-col gap-3">
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
          </section>

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
          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 px-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/70">
                  Stay close to what matters
                </p>
                <h2 className="font-list text-3xl font-semibold text-foreground">
                  Listings near {schoolParam || "your school"}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Filter by location, budget, and room details.
              </p>
            </div>

            {/* ======= Filter Toogle =========== */}
            <div
              onClick={() => (active.value = !active.value)}
              className="flex w-[97%] mx-auto md:w-[70%] md:mx-0 md:ml-auto cursor-pointer items-center justify-between rounded-xl border border-border/70 bg-secondary/55 px-4 py-3.5 text-foreground shadow-sm transition-colors hover:border-primary/40"
            >
              <span className="font-semibold text-gray-400 dark:text-gray-400 pl-2">
                Filter Listings
              </span>

              <ChevronDownCircle
                className={`w-6 h-6 text-gray-400 dark:text-gray-400 
              ml-auto ${active.value ? "rotate-180" : "rotate-0"} transition-all duration-250`}
              />
            </div>
            {/* ========== Filter Dropdown ============== */}
            <Filter
              active={active}
              selectedSchool={school}
              selectedArea={location}
              minPrice={minPrice}
              maxPrice={maxPrice}
              beds={beds}
              baths={baths}
              toilets={toilets}
            />

            <div className="card_list">
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
                  There are no listings near{" "}
                  <span className="capitalize font-bold">{schoolParam}</span>
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
          </section>
        </div>
      </div>
    </div>
  )
}

export default SchoolFocus
