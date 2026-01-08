"use client"

import { useUser } from "@utils/user"
import { Trash, Loader2 } from "lucide-react"
import { useGetInhabitants } from "@lib/customApi"
import { CldImage } from "next-cloudinary"
import { DeleteResident } from "@components/agent/ResidentFunctions"
import Link from "next/link"
import Searchbar from "@components/Searchbar"
import { useEffect, useState } from "react"
import { Skeleton } from "@components/ui/skeleton"
import { useNextPage } from "@lib/useIntersection"

const ManageResidents = () => {
  const { session } = useUser()
  const isResult = session?.user?.isPremium
 const [search,setSearch] = useState("")
 const [debouncedSearch,setDebouncedSearch] = useState("")
  const { data, isLoading,hasNextPage,fetchNextPage,isFetchingNextPage } = useGetInhabitants({
    listingId: "",
    limit: 14,
    agent: session?.user?.id,
    search: debouncedSearch,
  })
  const nextPageRef = useNextPage({hasNextPage,fetchNextPage,isFetchingNextPage})

 useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)
    return () => clearTimeout(handler)
  }, [search])

    if (!isResult) {
      return (
        <div className="w-full flex flex-col gap-2 items-center">
           <h2 className='text-foreground mt-30 font-bold text-md text-center'>
         Coming Soon ...

          {/* This feature is only available for premium agents */}
          
       
        </h2>
        {/* <button
            className="w-50 ml-4 px-4 py-3 font-bold text-sm gloss darkblue-gradient-vertical text-white rounded-xl hover:bg-goldSecondary transition"
            onClick={() => {
              window.location.href = "/agent/upgrade"
            }}
          >
            Upgrade Now
          </button> */}
         </div>
      )
    }

  return (
<div className="text-foreground w-full">
  {/* Heading */}
  <h2 className="otherHead text-center text-md font-bold mx-auto w-70">
    Manage Your Residents
  </h2>
  {/* searchbar */}
  <Searchbar 
    className="mx-auto flex items-center mt-4 gap-3 w-[95%] md:w-[80%] lg:w-[60%]"
    placeholder="Search Residents"
    search={search}
    setSearch={(e) => setSearch(e.target.value)}
  />
  {/* Residents List */} 
  {!isLoading ? (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {data?.pages.flatMap((items) =>
        items.inhabitants.map((resident: any, index:number) => (
          <div
            key={resident._id}
            ref={index === items.inhabitants.length - 1 ? nextPageRef : null}
            className="flex flex-col border-2  dark:border-gray-500/70 bg-muted/10 dark:bg-black/20 rounded-2xl p-2 hover:shadow-md dark:hover:shadow-gray-700 transition-all"
          >
            <div className="flex items-center gap-4">
              {/* Profile Pic */}
              <CldImage
                src={resident?.user?.profilePic}
                alt="dp"
                width={30}
                height={30}
                crop="auto"
                className="object-fill rounded-full"
              />

              {/* Info */}
              <div className="flex flex-col">
                <span className="font-semibold">{resident?.user?.username}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {resident?.user?.email}
                </span>
              </div>

              {/* Listing image */}
              <Link
                className="ml-auto"
                href={`/agent/listings/single_listing?id=${resident?.listing?._id}`}
              >
                <CldImage
                  src={resident?.listing?.mainImage}
                  alt="dp"
                  width={100}
                  height={60}
                  crop="fit"
                  gravity="north_west"
                  className="object-fill rounded-md border-2"
                />
              </Link>
            </div>

            {/* bottom */}
            <div className="flex items-center justify-self-end justify-between px-2 mt-2">
              <span className="text-sm">
                See Listing:
                <Link
                  href={`/agent/listings/single_listing?id=${resident?.listing?._id}`}
                  className="cursor-pointer pl-1 mt-1 text-xs text-blue-500 dark:text-amber-400 font-medium"
                >
                  {resident?.listing?.location}
                </Link>
              </span>

              <DeleteResident
                trash={true}
                inhabitantId={resident._id}
                className="bg-white dark:bg-black"
              />
            </div>
          </div>
        ))
      )}
    </div>
  ) : (
    <div className="w-full flex flex-col gap-2 mt-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="mb-4">
          <Skeleton className="w-full h-30 rounded-xl bg-gray-500/20" />
        </div>
      ))}
    </div>
  )}
  {isFetchingNextPage && (
    <Loader2 className="animate-spin text-gray-700 dark:text-gray-200 mt-6 mx-auto" />
  )}
</div>
  )
}

export default ManageResidents
