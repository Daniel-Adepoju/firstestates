"use client"
import React, { useRef, useState } from "react"
import { CldImage } from "next-cloudinary"
import { truncateAddress } from "@utils/truncateAddress"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DeleteModal } from "./Modals"
import { useDarkMode } from "@lib/DarkModeProvider"
import {
  Toilet,
  Bed,
  Bath,
  MapPin,
  Eye,
  EditIcon,
  Trash2,
  LoaderPinwheel,
  MoreVerticalIcon,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
} from "lucide-react"
import { formatNumber } from "@utils/formatNumber"
import { FeaturedBtn } from "./Featured"
import { WishlistButton } from "./WishListCard"

export interface CardProps {
  edit?: boolean
  isAgentCard?: boolean
  listing: Listing
  isInWishList?: boolean
}
const Card = ({ edit, listing, isAgentCard, isInWishList }: CardProps) => {
  const [address] = useState(listing?.address || "Nigeria")
  const router = useRouter()
  const deleteRef = useRef<HTMLDialogElement>(null)
  const [deleting, setDeleting] = useState(false)
  const { darkMode } = useDarkMode()
  const [weeklyViews] = useState(formatNumber(listing?.weeklyViews ?? 0) || 0)
  const [totalViews] = useState(formatNumber(listing?.totalViews ?? 0) || 0)
  const [showMore, setShowMore] = useState(false)
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
          {/* image */}
          <div className="houseImg">
            {listing?.mainImage?.startsWith("http") ? (
              <CldImage
                fill={true}
                alt="post_img"
                src={"igy0tozve5oyjrsfmq3o"}
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
              />
            )}

            {/*actions  */}
            <div className="flex flex-col items-center justify-center gap-1 absolute top-2 right-3 z-10">
               <WishlistButton
              isInWishList={isInWishList || false}
              listingId={listing?._id ?? ""}
            />
              <div className="rounded-full bg-white dark:bg-gray-700 w-6.5 h-6.5 flex items-center justify-center p-0.5">
            <MoreHorizontal size={30} className="text-gray-700 dark:text-white"/>
            </div>
            </div>
           
          </div>

          <div className="body">
            {/* location */}
            <div className="location heading">{listing?.location}</div>

            {/* address */}
            <div className="address">
              <MapPin
                size={24}
                color={darkMode ? "#A88F6E" : "#0874c7"}
              />
              <span>{truncateAddress(address, 30)}</span>
            </div>

            {!edit && (
              <>
                {/* amenities */}
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
                    <span className="text-gray-700 dark:text-white">{listing?.bathrooms}</span>
                  </div>
                  <div>
                    <Toilet
                      size={30}
                      color={darkMode ? "#A88F6E" : "#0874c7"}
                    />
                    <span className="text-gray-700 dark:text-white">{listing?.toilets}</span>
                  </div>
                </div>

              {/* unique to client */}
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


                {/* unique to agents */}
                
                {/* views */}
                {isAgentCard && (
                  <div className="w-full flex flex-col pl-3 font-semibold">
                    <div className="flex flex-row gap-3 items-center text-sm">
                      <Eye
                        size={30}
                        className="text-gray-700 dark:text-white"
                      />
                      Past Week Views
                      <span className="views smallNum text-gray-700 dark:text-white">
                        {weeklyViews}
                      </span>
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
              </>
            )}
          </div>

          {/*more content --> listing availability status,school and price*/}
          {!edit && (
            <div className="capitalize absolute top-0 left-[1px] flex flex-col items-center justify-start justify-content-start gap-1 px-2 z-2">
              {/* school*/}
              <div
                className="self-start headersFont w-25 inline-flex item-center justify-center px-3 py-2
                bg-white dark:bg-gray-700 text-sm font-medium
                   text-gray-700 dark:text-gray-200 rounded-md"
              >
                {listing?.school}
              </div>

              {/* status */}
              <div
                className={`tag no_absolute ${
                  listing?.status === "rented" && "rented"
                } w-25 self-start px-3.5 py-2 text-sm rounded-md  headersFont`}
              >
                {listing?.status}
              </div>

              {/* price */}
              {showMore && (
                <div
                  className="self-start headersFont w-25 inline-flex items-center justify-center gap-1 px-3.5 py-2 rounded-md
                   bg-gray-50 dark:bg-gray-700 text-sm font-medium
                   text-gray-700 dark:text-gray-200 shadow-sm"
                >
                  <span className="text-sm">
                    &#8358;{formatNumber(Number(listing?.price) || 0)}
                  </span>
                </div>
              )}

              {showMore && (
                <div
                  className=" headersFont w-full self-start inline-flex items-center justify-center gap-1 px-3.5 py-2 rounded-md
                   bg-green-700  text-sm font-medium
                   text-gray-700 dark:text-gray-200 shadow-sm"
                >
                  <span className="text-sm text-white">Roomate Request</span>
                </div>
              )}

              {/* showmore btn */}
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMore(!showMore)
                }}
                className="bg-white dark:bg-gray-700 rounded-full self-start ml-2 p-1 h-6.5 w-6.5 flex items-center justify-center"
              >
                {!showMore ? (
                  <ChevronDown
                    size={20}
                    className="animate-spin repeat-1 duration-50 text-gray-700 dark:text-white"
                  />
                ) : (
                  <ChevronUp
                    size={20}
                    className="animate-spin repeat-1 duration-50 text-gray-700 dark:text-white"
                  />
                )}
              </div>
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
