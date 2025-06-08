"use client"
import { useGetPopularListings } from "@lib/customApi"
import { Listing } from "./Card"
import { CldImage } from "next-cloudinary"
import {Skeleton} from "./ui/skeleton"
import Link from "next/link"
import { Bed, Bath, Toilet } from "lucide-react"
import { useDarkMode } from "@lib/DarkModeProvider"


export default function PopularThisWeek() {
  const { data, isLoading } = useGetPopularListings()
  const {darkMode} = useDarkMode()

  if (isLoading)
    return (
      <>
        <h2 className="subheading p-1 text-xl font-semibold mx-auto smallLine">
          Popular This Week
        </h2>
        <div className="flex flex-row justify-evenly item-center w-full mt-4">
          <Skeleton className="bg-gray-400 w-30 h-30" />
          <Skeleton className="bg-gray-400 w-30 h-30" />
          <Skeleton className="bg-gray-400 w-30 h-30" />
        </div>
      </>
    )

  return (
    <>
      <h2 className="subheading p-1 text-xl font-semibold mx-auto relative smallLine">
        Popular This Week
      </h2>
      <div
        className="popularList px-4 grid w-full grid-flow-col my-4 py-2
          overflow-x-scroll content-center gap-4 snap-x snap-mandatory"
      >
        {data?.popularListings.map((listing: Listing) => (
          <Link
            key={listing?._id}
            href={`/listings/single_listing?id=${listing?._id}`}
            className="popularCard snap-center flex flex-col border w-[200px] min-h-50 p-2 rounded-lg shadow-md bg-white"
          >
            <div className="w-[100%] h-30 relative">
              {listing?.mainImage?.startsWith("http") ? (
                <img
                  src="/images/house3.jpg"
                  alt="post_img"
                  className="object-contain mt-[-60%] w-full rounded-t-lg"
                />
              ) : (
                <CldImage
                  fill={true}
                  alt="post_img"
                  src={listing.mainImage}
                  crop={{
                    type: "auto",
                    source: true,
                  }}
                />
              )}
            </div>

            <div className="text-lg font-bold capitalize">{listing?.school}</div>
            <div className="dark:bg-gray-700 bg-slate-100 rounded-sm text-sm mb-2 font-small capitalize">
              {listing?.location}
            </div>

            <div className="w-full home_details flex flex-row justify-evenly items-center">
              <div className="flex flex-col items-center">
                  <Bed
                    size={24}
                    color={darkMode ? '#A88F6E' : '#0881A3'}
                    className="text-white"
                  />
                <span className="text-center">{listing?.bedrooms}</span>
              </div>

              <div className="flex flex-col items-center">
                  <Bath
                    size={24}
                    color={darkMode ? '#A88F6E' : '#0881A3'}
                    className="text-white"
                  />
                     <span className="text-center">{listing?.bathrooms}</span>
                </div>
             
       
           <div className="flex flex-col items-center">
                  <Toilet
                    size={24}
                   color={darkMode ? '#A88F6E' : '#0881A3'}
                    className="text-white"
                  />
                <span className="text-center">{listing?.toilets}</span>
              </div>
              </div>

             
          </Link>
        ))}
      </div>

    </>
  )
}
