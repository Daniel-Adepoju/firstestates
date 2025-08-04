"use client"
import { useGetPopularListings } from "@lib/customApi"
import {Skeleton} from "./ui/skeleton"
import PopularCard from "./PopularCard"
import ScrollController,{scrollRef} from "./ScrollController"

export default function PopularThisWeek() {
  const { data, isLoading } = useGetPopularListings()

  return (
    <>
      <h2 className="subheading p-1 text-xl font-semibold mx-auto relative smallLine">
        Popular This Week
      </h2>
    <ScrollController />
    
      <div
        ref={scrollRef}
        className="popularList px-4 grid w-full grid-flow-col my-4 py-2
          overflow-x-scroll content-center gap-4 snap-x snap-mandatory"
      >
        {isLoading ? (
        <>
         {Array.from({length:12}).map((_,i) => (
           <Skeleton key={`skeleton-${i}`} className="animate-none bg-gray-500/20 w-40 h-40" />
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
