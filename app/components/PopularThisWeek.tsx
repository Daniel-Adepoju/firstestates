"use client"
import { useRef } from "react"
import { useGetPopularListings } from "@lib/customApi"
import { Skeleton } from "./ui/skeleton"
import PopularCard from "./listing/PopularCard"
import ScrollController from "./ScrollController"
import { ChartBarIncreasing } from "lucide-react"

export default function PopularThisWeek() {
  const { data, isLoading } = useGetPopularListings()
  const scrollRef = useRef<HTMLDivElement>(null)
  return (
    <>
      <div className="mx-auto flex w-[94%] items-end justify-between gap-4 border-b border-slate-200 pb-3 dark:border-white/10">
        <div>
          {/* <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-goldPrimary">
            Discover nearby
          </p> */}
          <div className="subheading flex items-center gap-2 text-xl font-semibold">
            <ChartBarIncreasing className="h-6 w-6 text-goldPrimary" />
            <span>Popular this week</span>
          </div>
        </div>
        <ScrollController
          scrollRef={scrollRef}
          className="w-auto"
        />
      </div>
      <div
        ref={scrollRef}
        className="popularList grid w-full grid-flow-col gap-4 overflow-x-scroll px-4 py-5 snap-x snap-mandatory"
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
