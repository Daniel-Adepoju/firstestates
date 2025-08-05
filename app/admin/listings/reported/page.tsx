'use client'

import { Skeleton } from "@components/ui/skeleton"
import { CldImage } from "next-cloudinary"
import { useGetReported } from "@lib/customApi"
import { useNextPage } from "@lib/useIntersection"
import { FileX, Loader2 } from "lucide-react"
import Link from "next/link"

const Reported = () => {
  const {data,isLoading,isFetchingNextPage,fetchNextPage,hasNextPage} = useGetReported({
    page:'1',
    limit: 10,
  })
    const ref = useNextPage({isLoading,hasNextPage,fetchNextPage})

  if (isLoading) {
    return ( 
    <div className="mt-14 w-full flex flex-col gap-4 p-4">
        {Array.from({length: 4}).map((_,index) => (
            <div key={index} className="w-full ">
            <Skeleton className="w-full max-w-200 h-20 rounded-md bg-gray-500/20" />
            </div>
        ))}
      
    </div>
  )}

  return (
    <>
    <h1 className="text-2xl font-bold otherHead">Reported Listings</h1>

<div className="flex flex-col items-center w-full gap-4">
   {data?.pages[0]?.reported.length < 1 ?
       <div className="flex flex-col items-center gap-4 mt-[140px] mx-auto md:mt-10"> 
         <FileX size={100} color='#f29829'/>
        <div className="text-gray-500  dark:text-gray-300">
        There are currently no reported listing
        </div>
        </div>
      : 
      <div className="w-full max-w-220 flex flex-col items-start gap-2">
     {data?.pages.flatMap((items) => {
      return (
        items?.reported?.flatMap((reported:Listing,index:number) => (
     <div 
     key={reported?._id}
      ref={index === items.reported.length - 1 ? ref : null}
     className="flex items-center w-full max-w-200 h-25 rounded-md shadow-sm dark:bg-gray-800/50">
     <Link href={`/admin/listings/${reported?._id}`}>
      <CldImage 
      src={reported?.mainImage}
      alt="reported listing"
      width={90}
      height={90}
      crop='auto'
      gravity='center'
      className="rounded-md"
      />
      </Link>
      <div className="flex flex-col ml-4">
        <p className="text-md font-bold">Reported by {reported.reportedBy.length} {reported.reportedBy.length > 1 ? 'users' : 'user'}</p>
        <p className="text-sm text-gray-500 dark:text-gray-300">Listing Location: {reported.location}</p>
          </div>
      </div>
        ))
    )
     })}
    {isFetchingNextPage && hasNextPage && <Loader2 className='animate-spin mx-auto'/> }
      </div>
}
      </div>
      </>
  )
}

export default Reported