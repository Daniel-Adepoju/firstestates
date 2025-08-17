import Link from "next/link"
import { CldImage } from "next-cloudinary"
import { Bed, Bath, Toilet } from "lucide-react"
import { useDarkMode } from "@lib/DarkModeProvider"
import { CardProps } from "./Card"

interface PopCardProps {
  listing: CardProps["listing"]
  type?: string
  refValue?: any
}

const PopularCard = ({ listing, type, refValue }: PopCardProps) => {
  const { darkMode } = useDarkMode()

  return (
    <Link
      ref={refValue || null}
      href={
        type === "appointment"
          ? `/agent/appointments/${listing?._id}`
          : `/listings/single_listing?id=${listing?._id}`
      }
      className="popularCard snap-center flex flex-col border w-[200px] min-h-50 p-2 rounded-xl shadow-md bg-white"
    >
      <div className="w-[100%] h-30 relative">
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

      <div className="text-lg text-gray-700 dark:text-white font-bold capitalize">{listing?.school}</div>
      <div className="dark:bg-gray-700 bg-slate-100 rounded-sm text-sm mb-2 font-small capitalize">
        {listing?.location}
      </div>

      <div className="w-full home_details flex flex-row justify-evenly items-center">
        <div className="flex flex-col items-center">
          <Bed
            size={24}
            color={darkMode ? "#A88F6E" : "#0874c7"}
            className="text-white"
          />
          <span className="text-center">{listing?.bedrooms}</span>
        </div>

        <div className="flex flex-col items-center">
          <Bath
            size={24}
            color={darkMode ? "#A88F6E" : "#0874c7"}
            className="text-white"
          />
          <span className="text-center">{listing?.bathrooms}</span>
        </div>

        <div className="flex flex-col items-center">
          <Toilet
            size={24}
            color={darkMode ? "#A88F6E" : "#0874c7"}
            className="text-white"
          />
          <span className="text-center">{listing?.toilets}</span>
        </div>
      </div>
    </Link>
  )
}

export default PopularCard
