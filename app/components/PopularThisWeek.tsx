"use client"
import { useRef } from "react"
import { useGetPopularListings } from "@lib/customApi"
import { Skeleton } from "./ui/skeleton"
import PopularCard from "./listing/PopularCard"
import ScrollController from "./ScrollController"
import { ChevronRightCircle } from "lucide-react"

export default function PopularThisWeek() {
  const { data, isLoading } = useGetPopularListings()
  const scrollRef = useRef<HTMLDivElement>(null)
  return (
    <>
      <div className="flex items-center w-[98%]">
        <div className="mx-auto w-[90%]  subheading flex items-center gap-1 ml-4 py-1 text-xl font-semibold relative">
         <span>Popular This Week</span> 
          <ChevronRightCircle className="relative w-6 h-6" />
        </div>
        <ScrollController scrollRef={scrollRef}  className='w-[30%]'/>
      </div>
      <div
        ref={scrollRef}
        className="popularList px-4 grid w-full grid-flow-col py-2
          overflow-x-scroll content-center gap-4 snap-x snap-mandatory"
      >
        {isLoading ? (
          <>
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton
                key={`skeleton-${i}`}
                className=" bg-gray-500/20 w-40 h-40 mt-10"
              />
            ))}
          </>
        ) : (
          <>
            {data?.popularListings.map((listing: Listing) => (
              <PopularCard
                listing={listing}
                key={listing._id}
              />
            ))}
          </>
        )}
      </div>
    </>
  )
}
