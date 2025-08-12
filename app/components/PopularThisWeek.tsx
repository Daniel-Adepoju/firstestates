"use client"
import { useGetPopularListings } from "@lib/customApi"
import {Skeleton} from "./ui/skeleton"
import PopularCard from "./PopularCard"
import ScrollController,{scrollRef} from "./ScrollController"
import { ArrowRightCircle } from "lucide-react"

export default function PopularThisWeek() {
  const { data, isLoading } = useGetPopularListings()

  return (
    <>
      <h2 className="subheading flex items-center gap-1 ml-4 mb-[-40px] py-1 text-xl font-semibold relative">
        Popular This Week
        <ArrowRightCircle className="relative w-6 h-6"/>
      </h2>
    <ScrollController />
    
      <div
        ref={scrollRef}
        className="popularList px-4 grid w-full grid-flow-col py-2
          overflow-x-scroll content-center gap-4 snap-x snap-mandatory"
      >
        {isLoading ? (
        <>
         {Array.from({length:12}).map((_,i) => (
           <Skeleton key={`skeleton-${i}`} className="animate-none bg-gray-500/20 w-40 h-40 mt-10" />
         ))}
         </>)
     
        : (
        <>
        {data?.popularListings.map((listing: Listing) => (
       <PopularCard listing={listing} key={listing._id} />
        ))}
        </>
      )}
      </div>

    </>
  )
}
