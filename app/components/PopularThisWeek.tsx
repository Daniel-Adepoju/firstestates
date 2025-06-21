"use client"
import { useGetPopularListings } from "@lib/customApi"
import { Listing } from "./Card"
import { CldImage } from "next-cloudinary"
import {Skeleton} from "./ui/skeleton"
import Link from "next/link"
import { Bed, Bath, Toilet,ArrowLeft,ArrowRight } from "lucide-react"
import { useDarkMode } from "@lib/DarkModeProvider"
import { useState,useRef,useEffect } from "react"

export default function PopularThisWeek() {
  const { data, isLoading } = useGetPopularListings()
  const {darkMode} = useDarkMode()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)

  const checkScroll = () => {
    const el = scrollRef?.current;
    if (!el) return
    setShowLeft(el.scrollLeft > 0)
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth)
  }
  
    useEffect(() => {
    checkScroll();
    const el = scrollRef?.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll);
    return () => el.removeEventListener('scroll', checkScroll);
  }, [scrollRef.current]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  }
  



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
      <div className="w-[98%] flex justify-end">
      <div className="flex flex-row gap-4">
       {showLeft && <div 
        onClick={() => scroll('left')}
        className='mediumScale cursor-pointer dark:bg-gray-600 shadow-md p-2 rounded-full'>
         <ArrowLeft size={30} color={darkMode ? '#A88F6E' : '#f29829'}/>  
        </div>}
         
       {showRight && <div 
        onClick={() => scroll('right')}
       className='mediumScale cursor-pointer dark:bg-gray-600 shadow-md p-2 rounded-full'>
        <ArrowRight size={30} color={darkMode ? '#A88F6E' : '#f29829'}/>
      </div>}
      </div>
      </div>
      <div
        ref={scrollRef}
        className="popularList px-4 grid w-full grid-flow-col my-4 py-2
          overflow-x-scroll content-center gap-4 snap-x snap-mandatory"
      >
        {data?.popularListings.map((listing: Listing) => (
          <Link
            key={listing?._id}
            href={`/listings/single_listing?id=${listing?._id}`}
            className="popularCard snap-center flex flex-col border w-[200px] min-h-50 p-2 rounded-xl shadow-md bg-white"
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
