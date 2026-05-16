import Link from "next/link"
import { CldImage } from "next-cloudinary"
import { Bed, Bath, Toilet } from "lucide-react"
import { CardProps } from "./Card"
import { useAnimation } from "@lib/useAnimation"

interface PopCardProps {
  listing: CardProps["listing"]
  type?: string
  refValue?: any
  isAnimation?:boolean
  wAndH?:string
}

const PopularCard = ({ listing, type, refValue,isAnimation=false,wAndH }: PopCardProps) => {

  const { ref, className: animateClass } = useAnimation({
  threshold: 0.1,
  rootMargin: "0px 0px -80px 0px",
})

  return (
    
        <div
          ref={isAnimation ? ref as React.RefObject<HTMLDivElement> : null}
          className={`${isAnimation && animateClass} 
        `}
        >
   
  
    <Link
      ref={refValue || null}
      href={
        type === "appointment"
          ? `/agent/appointments/${listing?._id}`
          : `/listings/single_listing?id=${listing?._id}`
      }
      className={`popularCard agentPCard snap-center flex flex-col 
      border ${wAndH ? wAndH : "w-[200px] md:w-[200px] min-h-50"} p-2 rounded-xl shadow-md
       dark:shadow-black bg-white`}
    >
      <div className={`w-[100%] ${wAndH ? 'h-26' : 'h-30'} relative`}>
        {listing?.mainImage?.startsWith("http") ? (
          <CldImage
            fill={true}
            alt="post_img"
            src={"kfettsopnyhqhuq8o4aj"}
            crop={{
              type: "auto",
              source: true,
            }}
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
            className="rounded-md"
          />
        )}
      </div>

      <div className="text-md  text-gray-700 dark:text-white font-bold capitalize">
        {listing?.school}
      </div>

      <div className="my-1  dark:bg-gray-700 bg-slate-100 rounded-sm text-xs font-medium py-[3px] px-2 mb-2 font-small capitalize truncate">
        {listing?.location}
      </div>

      <div className="w-full mt-2  flex flex-row justify-evenly items-center">
        <div className="flex flex-col items-center">
          <Bed
            size={wAndH ? 18 : 22}
            className="text-goldPrimary font-bold"
          />
          <span className="text-center text-sm font-medium dark:text-white text-gray-700">{listing?.bedrooms}</span>
        </div>

        <div className="flex flex-col items-center">
          <Bath
            size={wAndH ? 18 : 22}
            className="text-goldPrimary font-bold"
          />
          <span className="text-center text-sm font-medium dark:text-white text-gray-700">{listing?.bathrooms}</span>
        </div>

        <div className="flex flex-col items-center">
          <Toilet
            size={wAndH ? 18 : 22}
            className="text-goldPrimary font-bold"
          />
          <span className="text-center text-sm font-medium dark:text-white text-gray-700">{listing?.toilets}</span>
        </div>
      </div>
    </Link>

         </div>
  )
}

export default PopularCard
