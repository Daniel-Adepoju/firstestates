'use client'
import Image from "next/image"
import { useSwiper } from "swiper/react"
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react"

const SwpierControls = ({className}:{className?:string}) => {
    const swiper = useSwiper()
  return (
    <div className={className}>
     <span onClick={() => swiper.slidePrev()} className="flex items-center justify-center clickable left arrow rounded-full">
          <ChevronLeftCircle size={40} color="white"/>  
    </span>
   
    <span onClick={() => swiper.slideNext()} className="flex items-center justify-center clickable right arrow rounded-full">
       <ChevronRightCircle size={40} color="white"/>  
    </span>
    </div>
   
  )
}

export default SwpierControls