"use client"
import React, { useRef, useState } from "react"
import { CldImage } from "next-cloudinary"
import { truncateAddress } from "@utils/truncateAddress"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DeleteModal } from "./Modals"
import { useDarkMode } from "@lib/DarkModeProvider"
import {
  TagIcon,
  Toilet,
  Bed,
  Bath,
  MapPin,
  Eye,
  Edit2,
  EditIcon,
  Trash2,
  LoaderPinwheel,
} from "lucide-react"
import { formatNumber } from "@utils/formatNumber"
import { FeaturedBtn } from "./Featured"

export interface CardProps {
  edit?: boolean
  isAgentCard?: boolean
  listing: Listing
}
const Card = ({ edit, listing, isAgentCard }: CardProps) => {
  const [address] = useState(listing?.address || "Nigeria")
  const router = useRouter()
  const deleteRef = useRef<HTMLDialogElement>(null)
  const [deleting, setDeleting] = useState(false)
  const { darkMode } = useDarkMode()
  const [weeklyViews] = useState(formatNumber(listing?.weeklyViews ?? 0) || 0)
  const [totalViews] = useState(formatNumber(listing?.totalViews ?? 0) || 0)
  const openDialog = () => {
    deleteRef.current?.showModal()
  }

  const visitCard = () => {
    router.push(`/listings/single_listing?id=${listing?._id}`)
  }
  return (
    <>
      <div className="cardContainer">
        <div
          onClick={visitCard}
          className="card font-card"
        >
          {/* <div className='no-underline'> */}
          <div className="houseImg">
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

          <div className="body">
            <div className="location heading">{listing?.location}</div>
            <div className="address">
              <MapPin
                size={24}
                color={darkMode ? "#A88F6E" : "#0874c7"}
              />
              <span>{truncateAddress(address, 30)}</span>
            </div>
            {!edit && (
              <>
              {/* toilets,beds,baths */}
                <div className="home_details font-list foont-bold">
                  <div>
                    <Bed
                      size={30}
                      color={darkMode ? "#A88F6E" : "#0874c7"}
                    />
                    <span className="text-gray-700 dark:text-white">{listing?.bedrooms}</span>
                  </div>
                  <div>
                    <Bath
                      size={30}
                      color={darkMode ? "#A88F6E" : "#0874c7"}
                    />
                    <span className='text-gray-700 dark:text-white'>{listing?.bathrooms}</span>
                  </div>
                  <div>
                    <Toilet
                      size={30}
                      color={darkMode ? "#A88F6E" : "#0874c7"}
                    />
                    <span className='text-gray-700 dark:text-white'>{listing?.toilets}</span>
                  </div>
                </div>

         {/* agent */}
                {!isAgentCard && (
                  <div className="agent font-list font-bold">
                    <div
                      className="w-full text-sm flex flex-col
        items-center justify-start gap-1
         break-words"
                    >
                      {/* <div className="z-1000 text-md font-bold text-gray-600 dark:text-white">Listed By</div> */}
                      <Link
                        onClick={(e) => e.stopPropagation()}
                        href={`/agent-view/${listing?.agent?._id}`}
                        className="block break-all text-start  agentCardName"
                      >
                        <CldImage
                          width={20}
                          height={20}
                          alt="agent pic"
                          className="my-1"
                          src={listing?.agent?.profilePic}
                        />
                        {listing?.agent?.username}
                      </Link>
                    </div>
                  </div>
                )}

                {/* views */}
                {isAgentCard && (
                  <div className="w-full flex flex-col pl-3 font-semibold">
                    <div className="flex flex-row gap-3 items-center text-sm">
                      <Eye
                        size={30}
                       className="text-gray-700 dark:text-white"
                      />
                      Past Week Views
                      <span className="views smallNum text-gray-700 dark:text-white">{weeklyViews}</span>

                    </div>

                    <div className="flex flex-row gap-3 items-center text-sm">
                      <Eye
                        size={30}
                        className="text-gray-700 dark:text-white"
                      />
                      Total Views
                      <span className="views smallNum">{totalViews}</span>
                    </div>
                  </div>
                )}

{/* school and price tzg */}
                <div 
                className=" headersFont mx-auto px-3 py-2
                bg-gray-50 dark:bg-gray-800/10 text-sm font-medium
                   text-gray-700 dark:text-gray-200 shadow-sm  rounded-md">
                    {listing?.school}
                    </div>
                {!edit && (
                  <div className=" headersFont mx-auto inline-flex items-center gap-2 px-3 py-2 rounded-md
                   bg-gray-50 dark:bg-gray-800/10 text-sm font-medium
                   text-gray-700 dark:text-gray-200 shadow-sm">
                    <TagIcon
                      size={20}
                      className="text-green-600 dark:text-green-400"
                    />
                    <span className="text-sm">
                      &#8358;{formatNumber(Number(listing?.price) || 0)}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
          {/* </div> */}

  {/* listing availability status */}
          {!edit && (
            <div className={`tag ${listing?.status === "rented" && "rented"}`}>
              {listing?.status}
            </div>
          )}
        </div>

{/* edit buttons */}
        {edit && (
          <div className="editSide">
            <div
              onClick={() => router.push(`/agent/listings/edit?id=${listing?._id}`)}
              className="dark:bg-black/20 bg-white/80 w-10 h-10 
      flex flex-row items-center justify-center
      rounded-full shadow-md
      mediumScale cursor-pointer"
            >
              <EditIcon
                size={30}
                color="green"
              />
            </div>

            <FeaturedBtn
              listingId={listing?._id}
              isFeatured={listing?.isFeatured}
              createdDate={listing.createdAt}
            />

            <div
              className="dark:bg-black/20 bg-white/80 w-10 h-10 
      flex flex-row items-center justify-center
      rounded-full shadow-md
      mediumScale cursor-pointer"
            >
              {deleting ? (
                <LoaderPinwheel
                  size={30}
                  color="darkred"
                  className="animate-spin"
                />
              ) : (
                <Trash2
                  onClick={openDialog}
                  size={30}
                  color="darkred"
                />
              )}
            </div>
            <DeleteModal
              ref={deleteRef}
              setDeleting={setDeleting}
              listingId={listing?._id ?? ""}
            />
          </div>
        )}
      </div>
    </>
  )
}
export default Card
