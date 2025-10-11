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

const SchoolFocus = () => {
  const searchParams = useSearchParams()
  const school = searchParams.get("school")
  const { session } = useUser()
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollRef2 = useRef<HTMLDivElement>(null)
  const userName = session?.user?.username
  const displayName = userName ? `, ${userName}` : ""
  const page = useSearchParams().get("page") || "1"
  const {
    data: listings,
    isLoading,
    isError,
  } = useGetListings({
    limit: 2,
    page: page,
    school: school || "",
  })

  const { data: coRentRequests, isLoading: coRentLoading } = useGetRequests({
    limit: 4,
    page: "1",
    school: school || "",
    // requestType:"co-rent",
    enabled: !!school,
  })

  const { data: roommateRequests , isLoading: roommateLoading} = useGetRequests({
    limit: 4,
    page: "1",
    // school: school || "",
    // requestType:"roommate",
    enabled: !!school,
  })

  const coRentMap =
    coRentRequests?.pages[0]?.requests?.length > 0 
      ? coRentRequests?.pages.flatMap((items) =>
          items?.requests?.flatMap((request: Request) => (
            <RoomateCard
              key={request._id}
              request={request}
            />
          ))
        )
      : "No co-rent requests found"

  const roommateMap =
    roommateRequests?.pages[0]?.requests?.length > 0
      ? roommateRequests?.pages.flatMap((items) =>
          items?.requests?.flatMap((request: Request) => (
            <RoomateCard
              key={request._id}
              request={request}
            />
          ))
        )
      : "No roommate requests found"

 const loadingMap = (quantity:number) => {
  return Array.from({ length: quantity }).map((_, i) => (
  <Skeleton key={i} className="inline-block h-80 w-60 rounded-md bg-gray-500/20 mb-6"/>
))
 }

  return (
    <div className="w-full mt-20 mb-10">
      {school && (
        <h1 className="text-3xl font-bold text-center mb-1 headersFont capitalize">
          School Focus - {school}
        </h1>
      )}

      <p className="text-center text-sm p-2 text-gray-700 dark:text-gray-200">
        {`Welcome to School Focus${displayName}. Here you can find listings and roommate requests near your school of choice.`}
      </p>

      {/* Future header components can go here */}

      {/* Main content for listings and roommate requests */}

    {/* co-rent requests header */}
    <section className="flex items-center w-[98%] mt-4.5 pb-2">
        <h2 className="headersFont w-120 px-4 text-lg">
       Co-Rent Requests
        </h2>
        {!coRentLoading && <ScrollController scrollRef={scrollRef} />}
        </section>
     
      {/* co-rent requests container */}

      <div
        ref={scrollRef}
        className={`grid grid-flow-col auto-cols-min ${(coRentRequests?.pages[0]?.requests?.length > 0 || coRentLoading) ? 'h-90' : 'h-10 p-0 gap-1 text-sm text-center'} gap-6 p-2  snap-x snap-mandatory overflow-x-scroll nobar null`}
      >
        {!coRentLoading ? coRentMap : loadingMap(1)}
        {/* <MoreVertical className="h-8 w-8 my-auto  text-gray-500 dark:text-gray-100 animate-pulse" /> */}
      </div>

      {/* roommate requests header */}
      <section className="flex items-center w-[98%] pb-2">
        <h2 className="headersFont w-120 px-4 text-lg">
        Roommate Requests
        </h2>
        {!roommateLoading && <ScrollController scrollRef={scrollRef2} />}
        </section>
      
       {/*roomate requests container*/}
      <div
        ref={scrollRef2}
        className={`grid grid-flow-col auto-cols-min ${(roommateRequests?.pages[0]?.requests?.length > 0 || roommateLoading) ? 'h-90' : 'h-10 p-0 gap-1 text-sm text-center'} gap-6 p-2  snap-x snap-mandatory overflow-x-scroll nobar null`}
      >
        {!roommateLoading ? roommateMap : loadingMap(9)}
        {/* <MoreVertical className="h-8 w-8 my-auto  text-gray-500 dark:text-gray-100 animate-pulse" /> */}
      </div>

      {/*listings in school*/}
      <h2 className="headersFont px-4 text-lg capitalize mx-auto text-center">Listings</h2>
      {/*listings container*/}
      <div
        id="listing"
        className="card_list"
      >
        {isLoading
          ? // loadingCards
            loadingMap(6)
          : listings?.posts?.map((listing: Listing) => (
              <Card
                key={listing._id}
                listing={listing}
              />
            ))}
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
