"use client"
import { useGetPopularListings } from "@lib/customApi"
import { Listing } from "./Card"
import {Skeleton} from "./ui/skeleton"
import {ArrowLeft,ArrowRight } from "lucide-react"
import { useDarkMode } from "@lib/DarkModeProvider"
import { useState,useRef,useEffect } from "react"
import PopularCard from "./PopularCard"

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
