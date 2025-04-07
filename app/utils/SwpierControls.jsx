'use client'
import Image from "next/image"
import { useSwiper } from "swiper/react"


const SwpierControls = () => {
    const swiper = useSwiper()
  return (
    <>
     <span onClick={() => swiper.slidePrev()} className="clickable left arrow">
    <Image 
    width={60}
    height={60}
    src='/icons/left_arrow.svg'
     alt="arrow"
    />   
    </span>
   
    <span onClick={() => swiper.slideNext()} className="clickable right arrow">
    <Image 
    width={60}
    height={60}
    src='/icons/right_arrow.svg'
     alt="arrow"
    />   
    </span>
    </>
   
  )
}

export default SwpierControls