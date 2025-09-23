'use client'
import Image from "next/image"
import { useSwiper } from "swiper/react"
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react"

const SwpierControls = ({className}:{className?:string}) => {
    const swiper = useSwiper()
  return (
    <div className={className}>
     <span onClick={() => swiper.slidePrev()} className="clickable left arrow rounded-full">
    <Image 
    width={60}
    height={60}
    src='/icons/left_arrow.svg'
     alt="arrow"
    />   
    </span>
   
    <span onClick={() => swiper.slideNext()} className="clickable right arrow rounded-full">
    <Image 
    width={60}
    height={60}
    src='/icons/right_arrow.svg'
     alt="arrow"
    />   
    </span>
    </div>
   
  )
}

export default SwpierControls